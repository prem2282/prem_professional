#!/usr/bin/env python3
"""Add smooth page transitions to blog / my learnings pages."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

BOOTSTRAP = (
    '  <script>(function(){var vt=HTMLMetaElement.supports&&HTMLMetaElement.supports("view-transition");'
    'if(!vt)document.documentElement.classList.add("page-transition-pending");})();</script>\n'
)
META_VT = '  <meta name="view-transition" content="same-origin" />\n'
CSS_REL = '  <link rel="stylesheet" href="{prefix}assets/css/page-transitions.css" />\n'
JS_REL = '  <script src="{prefix}assets/js/page-transitions.js"></script>\n'

MARKERS = (
    "page-transition-pending",
    "page-transitions.css",
    "page-transitions.js",
    'name="view-transition"',
)


def already_patched(text: str) -> bool:
    return all(m in text for m in MARKERS)


def inject_head(text: str) -> str:
    if 'name="viewport"' not in text:
        return text
    viewport_line = re.search(r'  <meta name="viewport"[^>]*? />\n', text)
    if not viewport_line:
        return text
    insert_at = viewport_line.end()
    block = BOOTSTRAP + META_VT
    if "page-transition-pending" not in text:
        text = text[:insert_at] + block + text[insert_at:]
    elif 'name="view-transition"' not in text:
        text = text[:insert_at] + META_VT + text[insert_at:]
    return text


def inject_css(text: str, prefix: str) -> str:
    css = CSS_REL.format(prefix=prefix)
    if "page-transitions.css" in text:
        return text
    anchor = f'href="{prefix}assets/css/styles.css"'
    if anchor in text:
        return text.replace(
            f'  <link rel="stylesheet" href="{prefix}assets/css/styles.css" />\n',
            f'  <link rel="stylesheet" href="{prefix}assets/css/styles.css" />\n' + css,
            1,
        )
    anchor = f'href="{prefix}assets/css/blog-post.css"'
    if anchor in text:
        return text.replace(
            f'  <link rel="stylesheet" href="{prefix}assets/css/blog-post.css" />\n',
            f'  <link rel="stylesheet" href="{prefix}assets/css/blog-post.css" />\n' + css,
            1,
        )
    return text


def inject_js(text: str, prefix: str) -> str:
    js = JS_REL.format(prefix=prefix)
    if "page-transitions.js" in text:
        return text
    needle = f'  <script src="{prefix}assets/js/main.js"></script>\n'
    if needle not in text:
        return text
    return text.replace(needle, js + needle, 1)


def patch_file(path: Path, prefix: str) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text
    text = inject_head(text)
    text = inject_css(text, prefix)
    text = inject_js(text, prefix)
    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    targets: list[tuple[Path, str]] = [
        (ROOT / "blogs.html", ""),
        (ROOT / "mylearnings.html", ""),
    ]
    for path in sorted((ROOT / "blogs").glob("*.html")):
        if re.match(r"^\d{2}-", path.name):
            targets.append((path, "../"))
    for path in sorted((ROOT / "mylearnings").glob("*.html")):
        targets.append((path, "../"))

    for path, prefix in targets:
        if patch_file(path, prefix):
            print("patched", path.relative_to(ROOT))
    print("done")


if __name__ == "__main__":
    main()
