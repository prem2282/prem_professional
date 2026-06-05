#!/usr/bin/env python3
"""Create blogs/{slug}.html stubs that redirect to blogs/NN-{slug}.html."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOGS = ROOT / "blogs"
SITE = "https://prem2282.github.io/prem_professional"

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

META_KEYS = (
    "description",
    "og:type",
    "og:title",
    "og:description",
    "og:image",
    "og:image:width",
    "og:image:height",
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
)


def extract_meta(html: str) -> dict[str, str]:
    meta: dict[str, str] = {}
    for key in META_KEYS:
        if key == "description":
            pat = r'<meta name="description" content="([^"]*)"'
        elif key.startswith("og:"):
            pat = rf'<meta property="{re.escape(key)}" content="([^"]*)"'
        else:
            pat = rf'<meta name="{re.escape(key)}" content="([^"]*)"'
        m = re.search(pat, html)
        if m:
            meta[key] = m.group(1)
    title_m = re.search(r"<title>([^<]*)</title>", html)
    if title_m:
        meta["title"] = title_m.group(1)
    return meta


def meta_tag(key: str, value: str) -> str:
    if key == "description":
        return f'  <meta name="description" content="{value}" />'
    if key.startswith("og:"):
        return f'  <meta property="{key}" content="{value}" />'
    if key == "title":
        return ""
    return f'  <meta name="{key}" content="{value}" />'


def redirect_html(slug: str, new_base: str, meta: dict[str, str]) -> str:
    canonical = f"{SITE}/blogs/{new_base}.html"
    title = meta.get("title", f"Redirect — {slug}")
    head_meta = "\n".join(
        meta_tag(k, meta[k]) for k in META_KEYS if k in meta
    )
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="refresh" content="0; url={new_base}.html" />
  <link rel="canonical" href="{canonical}" />
  <meta property="og:url" content="{canonical}" />
{head_meta}
  <title>{title}</title>
  <script>location.replace("{new_base}.html");</script>
</head>
<body>
  <p>This page has moved. <a href="{new_base}.html">Continue to the article</a>.</p>
</body>
</html>
"""


def main() -> None:
    for i, slug in enumerate(BLOGS_ORDER, start=1):
        new_base = f"{i:02d}-{slug}"
        dest = BLOGS / f"{new_base}.html"
        if not dest.exists():
            print("skip (missing)", dest.name)
            continue
        meta = extract_meta(dest.read_text(encoding="utf-8"))
        stub = BLOGS / f"{slug}.html"
        stub.write_text(redirect_html(slug, new_base, meta), encoding="utf-8")
        print("wrote", stub.name, "->", f"{new_base}.html")
    print("done")


if __name__ == "__main__":
    main()
