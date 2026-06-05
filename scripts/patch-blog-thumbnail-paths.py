#!/usr/bin/env python3
"""Use NN.webp paths from blog filename; hide hero until load; wire blog-hero.js."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOGS = ROOT / "blogs"
SITE = "https://prem2282.github.io/prem_professional"
HERO_SCRIPT = '  <script src="../assets/js/blog-hero.js"></script>\n'

FIGURE_RE = re.compile(
    r'<figure class="blog-hero"[^>]*>\s*'
    r'<img src="../assets/images/blogs/[^"]+" alt="([^"]*)" width="1200" height="630" '
    r'class="blog-hero-img" decoding="async" fetchpriority="high" />\s*'
    r'</figure>',
    re.MULTILINE,
)


def blog_num(filename: str) -> str | None:
    m = re.match(r"^(\d{2})-", filename)
    return m.group(1) if m else None


def patch_html(path: Path) -> bool:
    num = blog_num(path.name)
    if not num:
        return False

    text = path.read_text(encoding="utf-8")
    original = text
    img_path = f"{num}.webp"
    og_url = f"{SITE}/assets/images/blogs/{img_path}"

    text = re.sub(
        r'<meta property="og:image" content="[^"]*" />',
        f'<meta property="og:image" content="{og_url}" />',
        text,
        count=1,
    )
    text = re.sub(
        r'<meta name="twitter:image" content="[^"]*" />',
        f'<meta name="twitter:image" content="{og_url}" />',
        text,
        count=1,
    )

    def repl_figure(m: re.Match[str]) -> str:
        alt = m.group(1)
        return (
            f'<figure class="blog-hero" aria-label="Article thumbnail" hidden>\n'
            f'        <img src="../assets/images/blogs/{img_path}" alt="{alt}" width="1200" height="630" '
            f'class="blog-hero-img" decoding="async" fetchpriority="high" />\n'
            f"      </figure>"
        )

    text = FIGURE_RE.sub(repl_figure, text, count=1)

    if HERO_SCRIPT.strip() not in text:
        text = text.replace(
            '  <script src="../assets/js/main.js"></script>\n',
            '  <script src="../assets/js/main.js"></script>\n' + HERO_SCRIPT,
        )

    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def patch_prompts() -> None:
    prompts = ROOT / "image_prompts"
    for p in sorted(prompts.glob("*.txt")):
        m = re.match(r"^(\d{2})-", p.name)
        num = m.group(1) if m else None
        if not num:
            continue
        if not num:
            continue
        t = p.read_text(encoding="utf-8")
        t2 = re.sub(
            r"^OUTPUT: assets/images/blogs/.*$",
            f"OUTPUT: assets/images/blogs/{num}.webp",
            t,
            flags=re.M,
        )
        if t2 != t:
            p.write_text(t2, encoding="utf-8")


def main() -> None:
    for path in sorted(BLOGS.glob("*.html")):
        if patch_html(path):
            print("patched", path.name)
    patch_prompts()
    print("done")


if __name__ == "__main__":
    main()
