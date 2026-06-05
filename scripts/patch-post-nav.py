#!/usr/bin/env python3
"""Inject post-nav.js into numbered blog posts and my learnings articles."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT_TAG = '  <script src="../assets/js/post-nav.js"></script>\n'
MARKER = SCRIPT_TAG.strip()


def inject(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if MARKER in text:
        return False
    needle = '  <script src="../assets/js/main.js"></script>\n'
    if needle not in text:
        return False
    text = text.replace(needle, needle + SCRIPT_TAG, 1)
    path.write_text(text, encoding="utf-8")
    return True


def main() -> None:
    blogs = ROOT / "blogs"
    learnings = ROOT / "mylearnings"
    for path in sorted(blogs.glob("*.html")):
        if not re.match(r"^\d{2}-", path.name):
            continue
        if inject(path):
            print("patched", path.relative_to(ROOT))
    for path in sorted(learnings.glob("*.html")):
        if inject(path):
            print("patched", path.relative_to(ROOT))
    print("done")


if __name__ == "__main__":
    main()
