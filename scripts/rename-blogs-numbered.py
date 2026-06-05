#!/usr/bin/env python3
"""Rename blogs and prompts to numbered names; switch hero/OG images to N.webp."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOGS = ROOT / "blogs"
PROMPTS = ROOT / "image_prompts"
SITE = "https://prem2282.github.io/prem_professional"

# Order matches blogs.html (01–20)
BLOGS_ORDER = [
    "tokens",
    "parameters",
    "prompt-engineering-patterns",
    "system-prompt-design-enterprise-apps",
    "structured-output-json-reliability",
    "function-calling-and-tool-use-patterns",
    "rag-fundamentals-for-production",
    "chunking-and-embedding-strategies",
    "reranking-and-retrieval-quality",
    "context-window-management",
    "hallucination-mitigation-enterprise-workflows",
    "evaluation-frameworks-offline-and-online",
    "agentic-workflows-multi-step-planning",
    "guardrails-safety-policy-enforcement",
    "latency-optimization-for-llm-apps",
    "cost-optimization-and-token-budgeting",
    "caching-strategies-for-ai-responses",
    "observability-for-genai-systems",
    "prompt-injection-and-security-hardening",
    "ai-governance-and-responsible-deployment",
]

OLD_TO_NEW: dict[str, str] = {}
OLD_TO_NUM: dict[str, int] = {}
for i, slug in enumerate(BLOGS_ORDER, start=1):
    num = f"{i:02d}"
    OLD_TO_NEW[slug] = f"{num}-{slug}"
    OLD_TO_NUM[slug] = i


def replace_in_text(text: str) -> str:
    # Longest slugs first to avoid partial replacements
    for slug in sorted(OLD_TO_NEW, key=len, reverse=True):
        new = OLD_TO_NEW[slug]
        n = OLD_TO_NUM[slug]
        text = text.replace(f"blogs/{slug}.html", f"blogs/{new}.html")
        text = text.replace(f"../assets/images/blogs/{slug}.png", f"../assets/images/blogs/{n}.webp")
        text = text.replace(f"assets/images/blogs/{slug}.png", f"assets/images/blogs/{n}.webp")
        text = text.replace(f'"{slug}.html"', f'"{new}.html"')
        text = text.replace(f"'{slug}.html'", f"'{new}.html'")
        text = text.replace(f"href=\"{slug}.html\"", f'href="{new}.html"')
    return text


def update_prompt_file(path: Path, num: int, new_base: str) -> None:
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"^SLUG:.*$", f"SLUG: {new_base}", text, flags=re.M)
    text = re.sub(r"^BLOG_NUM:.*$", f"BLOG_NUM: {num}", text, flags=re.M)
    text = re.sub(
        r"^OUTPUT:.*$",
        f"OUTPUT: assets/images/blogs/{num}.webp",
        text,
        flags=re.M,
    )
    if "BLOG_NUM:" not in text:
        text = text.replace("SLUG:", f"BLOG_NUM: {num}\nSLUG:", 1)
    path.write_text(text, encoding="utf-8")


def main() -> None:
    # 1) Rename HTML files
    for slug, new_base in OLD_TO_NEW.items():
        old_html = BLOGS / f"{slug}.html"
        new_html = BLOGS / f"{new_base}.html"
        if old_html.exists():
            old_html.rename(new_html)
            print(f"HTML: {slug}.html -> {new_base}.html")

    # 2) Update content in renamed HTML
    for new_base in OLD_TO_NEW.values():
        path = BLOGS / f"{new_base}.html"
        if not path.exists():
            continue
        n = int(new_base[:2])
        text = path.read_text(encoding="utf-8")
        text = replace_in_text(text)
        # og:url for this file
        text = re.sub(
            r'<meta property="og:url" content="[^"]*" />',
            f'<meta property="og:url" content="{SITE}/blogs/{new_base}.html" />',
            text,
            count=1,
        )
        text = re.sub(
            r'<meta property="og:image" content="[^"]*" />',
            f'<meta property="og:image" content="{SITE}/assets/images/blogs/{n}.webp" />',
            text,
            count=1,
        )
        text = re.sub(
            r'<meta name="twitter:image" content="[^"]*" />',
            f'<meta name="twitter:image" content="{SITE}/assets/images/blogs/{n}.webp" />',
            text,
            count=1,
        )
        text = re.sub(
            r'src="../assets/images/blogs/[^"]+\.(png|webp)"',
            f'src="../assets/images/blogs/{n}.webp"',
            text,
            count=1,
        )
        path.write_text(text, encoding="utf-8")

    # 3) Rename prompt files
    for slug, new_base in OLD_TO_NEW.items():
        old_txt = PROMPTS / f"{slug}.txt"
        new_txt = PROMPTS / f"{new_base}.txt"
        if old_txt.exists():
            old_txt.rename(new_txt)
            n = OLD_TO_NUM[slug]
            update_prompt_file(new_txt, n, new_base)
            print(f"PROMPT: {slug}.txt -> {new_base}.txt")

    # 4) Global file updates
    targets = [
        ROOT / "blogs.html",
        ROOT / "assets/js/home-blog-marquee.js",
        ROOT / "blogs/linkedin_posts.txt",
        ROOT / "mylearnings/greeting-vs-real-question-rag-gate.html",
        ROOT / "mylearnings/precision-vs-details-vision-pdf-grounding.html",
        ROOT / "blogs/blogimageskill.md",
        ROOT / "assets/images/blogs/README.md",
        ROOT / "scripts/patch-blog-hero-og.py",
        ROOT / ".cursor/rules/blog-originality.mdc",
    ]
    for path in targets:
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        new_text = replace_in_text(text)
        if new_text != text:
            path.write_text(new_text, encoding="utf-8")
            print(f"UPDATED: {path.relative_to(ROOT)}")

    # 5) Manifest
    lines = ["# Blog number index\n", "| # | File | Image |\n", "|---|------|-------|\n"]
    for i, slug in enumerate(BLOGS_ORDER, start=1):
        nb = OLD_TO_NEW[slug]
        lines.append(f"| {i:02d} | `{nb}.html` | `{i}.webp` |\n")
    (ROOT / "blogs" / "BLOG_INDEX.md").write_text("".join(lines), encoding="utf-8")
    print("Wrote blogs/BLOG_INDEX.md")


if __name__ == "__main__":
    main()
