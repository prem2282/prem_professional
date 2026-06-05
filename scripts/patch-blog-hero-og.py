#!/usr/bin/env python3
"""Inject blog hero image + Open Graph tags into blogs/*.html."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOGS = ROOT / "blogs"
SITE = "https://prem2282.github.io/prem_professional"

# slug -> alt text for hero img
ALTS: dict[str, str] = {
    "tokens": "Infographic: tokens drive context, cost, and AI architecture",
    "parameters": "Infographic: LLM parameters as design knobs",
    "prompt-engineering-patterns": "Infographic: reusable prompt engineering patterns",
    "system-prompt-design-enterprise-apps": "Infographic: layered system prompts for enterprise apps",
    "structured-output-json-reliability": "Infographic: reliable JSON and structured output",
    "function-calling-and-tool-use-patterns": "Infographic: function calling and tool use patterns",
    "rag-fundamentals-for-production": "Infographic: RAG production pipeline fundamentals",
    "chunking-and-embedding-strategies": "Infographic: chunking and embedding strategies",
    "reranking-and-retrieval-quality": "Infographic: reranking improves retrieval quality",
    "context-window-management": "Infographic: context window budget packing",
    "caching-strategies-for-ai-responses": "Infographic: AI response caching layers",
    "latency-optimization-for-llm-apps": "Infographic: LLM latency waterfall optimization",
    "cost-optimization-and-token-budgeting": "Infographic: token cost optimization and budgeting",
    "hallucination-mitigation-enterprise-workflows": "Infographic: enterprise hallucination mitigation",
    "guardrails-safety-policy-enforcement": "Infographic: guardrails and policy enforcement gates",
    "prompt-injection-and-security-hardening": "Infographic: prompt injection security hardening",
    "evaluation-frameworks-offline-and-online": "Infographic: offline and online GenAI evaluation",
    "observability-for-genai-systems": "Infographic: observability for GenAI systems",
    "agentic-workflows-multi-step-planning": "Infographic: agentic workflows and multi-step planning",
    "ai-governance-and-responsible-deployment": "Infographic: AI governance and responsible deployment",
}


def og_block(title: str, desc: str, slug: str) -> str:
    url = f"{SITE}/blogs/{slug}.html"
    img = f"{SITE}/assets/images/blogs/{slug}.png"
    t = title.replace("&", "&amp;").replace('"', "&quot;")
    d = desc.replace("&", "&amp;").replace('"', "&quot;")
    return f"""  <meta property="og:type" content="article" />
  <meta property="og:title" content="{t}" />
  <meta property="og:description" content="{d}" />
  <meta property="og:url" content="{url}" />
  <meta property="og:image" content="{img}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{t}" />
  <meta name="twitter:description" content="{d}" />
  <meta name="twitter:image" content="{img}" />
"""


def hero_block(slug: str) -> str:
    alt = ALTS.get(slug, f"Infographic for {slug}")
    return f"""      <figure class="blog-hero" aria-label="Article infographic">
        <img src="../assets/images/blogs/{slug}.png" alt="{alt}" width="1200" height="630" class="blog-hero-img" decoding="async" fetchpriority="high" />
      </figure>
"""


def patch_file(path: Path) -> bool:
    slug = path.stem
    text = path.read_text(encoding="utf-8")
    changed = False

    desc_m = re.search(r'<meta name="description" content="([^"]*)"\s*/>', text)
    title_m = re.search(r"<title>([^<]*)</title>", text)
    if not desc_m or not title_m:
        print(f"SKIP (meta): {path.name}")
        return False

    desc = desc_m.group(1)
    title = title_m.group(1).replace(" | Prem", "").strip()

    if 'property="og:image"' not in text:
        insert_after = desc_m.group(0)
        block = og_block(title, desc, slug)
        text = text.replace(insert_after, insert_after + "\n" + block.rstrip() + "\n", 1)
        changed = True

    if 'class="blog-hero"' not in text:
        hero = hero_block(slug)
        # tokens.html uses div.mb-12 before h1
        if '<div class="mb-12">' in text and slug == "tokens":
            text = text.replace('<div class="mb-12">', hero + "\n      <div class=\"mb-12\">", 1)
            changed = True
        elif '<header class="mb-10">' in text:
            text = text.replace("<header class=\"mb-10\">", "<header class=\"mb-10\">\n" + hero, 1)
            changed = True
        elif '<header class="mb-8">' in text:
            text = text.replace("<header class=\"mb-8\">", "<header class=\"mb-8\">\n" + hero, 1)
            changed = True
        else:
            print(f"SKIP (hero anchor): {path.name}")
            return changed

    if changed:
        path.write_text(text, encoding="utf-8")
        print(f"OK: {path.name}")
    return changed


def main() -> None:
    for path in sorted(BLOGS.glob("*.html")):
        patch_file(path)


if __name__ == "__main__":
    main()
