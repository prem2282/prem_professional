#!/usr/bin/env python3
"""Write thumbnail-focused image prompts for all 20 blogs."""

from pathlib import Path

PROMPTS = [
    (1, "01-tokens", "Tokens", "TOKENS RUN THE BILL",
     "coin-sized text chips filling a vertical meter to the brim",
     "cream background, gold meter fill, navy typography"),
    (2, "02-parameters", "Parameters", "DESIGN THE KNOBS",
     "two elegant control dials (temperature and top_p) with gold indicator ticks",
     "soft cream gradient, minimal cockpit panel aesthetic"),
    (3, "03-prompt-engineering-patterns", "Prompt Patterns", "PATTERN LIBRARY",
     "four neat stacked cards like a recipe deck with gold spine",
     "clean shelf layout, ivory cards on cream"),
    (4, "04-system-prompt-design-enterprise-apps", "System Prompts", "LAYER POLICY",
     "five horizontal translucent layers stacked like architecture strata",
     "enterprise blueprint feel, gold top layer highlight"),
    (5, "05-structured-output-json-reliability", "JSON Reliability", "PARSE OR FAIL",
     "curly braces { } passing through a validation gate with green check",
     "crisp minimal, cream base, gold gate frame"),
    (6, "06-function-calling-and-tool-use-patterns", "Tool Use", "TOOLS HAVE SIDE EFFECTS",
     "wrench icon connected to API nodes with caution amber ring on write node",
     "network diagram minimal, 3 nodes only, navy lines gold accent"),
    (7, "07-rag-fundamentals-for-production", "RAG Production", "WRONG CHUNK",
     "magnifying glass over document stack with one wrong highlighted page glowing red, one correct gold",
     "document metaphor, cream desk tone, strong contrast highlight"),
    (8, "08-chunking-and-embedding-strategies", "Chunking", "SPLIT MATTERS",
     "document sheet cut into puzzle pieces with one gap showing broken sentence",
     "minimal puzzle metaphor, gold edge on correct join"),
    (9, "09-reranking-and-retrieval-quality", "Reranking", "SECOND OPINION",
     "two ranked lists side by side, gold star on promoted top item",
     "clean list UI abstract, cream background"),
    (10, "10-context-window-management", "Context Window", "PACK THE WINDOW",
     "vertical progress jar segmented System RAG History with overflow spill",
     "glass jar metaphor, gold danger line near top"),
    (11, "11-hallucination-mitigation-enterprise-workflows", "Hallucination", "GROUND IT",
     "speech bubble tethered to document with citation chain link",
     "trust metaphor, gold link, navy bubble outline"),
    (12, "12-evaluation-frameworks-offline-and-online", "Evaluation", "MEASURE BEFORE SHIP",
     "checklist clipboard with green pass stamp and small live graph pulse",
     "QA release gate aesthetic, cream and gold"),
    (13, "13-agentic-workflows-multi-step-planning", "Agentic Workflows", "BOUND THE LOOP",
     "circular arrow loop with step counter 3/10 and stop barrier",
     "agent loop abstract, gold stop line, no robot face"),
    (14, "14-guardrails-safety-policy-enforcement", "Guardrails", "GATES FIRST",
     "three turnstile gates in a row with shield icon on first gate",
     "security pipeline abstract, gold pass lane"),
    (15, "15-latency-optimization-for-llm-apps", "Latency", "FIND THE SLOW LAYER",
     "horizontal waterfall bar chart one segment dramatically wider glowing gold",
     "perf dashboard abstract, navy bars cream bg"),
    (16, "16-cost-optimization-and-token-budgeting", "Token Budget", "BURN LEDGER",
     "stacked coin columns shrinking after optimization arrow",
     "FinOps metaphor, gold coins navy labels minimal"),
    (17, "17-caching-strategies-for-ai-responses", "Caching", "CACHE THE HIT",
     "lightning bolt skipping over LLM tower to instant response chip",
     "fast path vs slow path, gold lightning cream sky"),
    (18, "18-observability-for-genai-systems", "Observability", "TRACE THE ANSWER",
     "single trace_id badge with branching span waterfall lines",
     "APM abstract, gold root span highlight"),
    (19, "19-prompt-injection-and-security-hardening", "Prompt Injection", "UNTRUSTED DATA",
     "email envelope with hidden dagger text blocked by brick wall barrier",
     "security metaphor, red block gold safe zone"),
    (20, "20-ai-governance-and-responsible-deployment", "AI Governance", "GOVERNANCE LADDER",
     "four-rung ladder ascending with flag at top and kill-switch icon at base",
     "maturity metaphor, gold upper rungs cream sky"),
]

TEMPLATE = """BLOG_NUM: {num}
SLUG: {slug}
OUTPUT: assets/images/blogs/{badge}.webp

BLOG_TITLE: {title}

CLICK_HOOK:
{hook}

THUMBNAIL_TEXT:
{text}

VISUAL_METAPHOR:
{metaphor}

COLOR_MOOD:
{color}

LAYOUT:
Large bold THUMBNAIL_TEXT on left or lower third. VISUAL_METAPHOR on right or upper area (55% of frame). Small series badge "{badge}" top-left in gold circle. Generous padding. No extra labels on image.

FULL_PROMPT:
Professional blog article thumbnail, 1200x630 landscape. Modern minimal tech blog cover.
No people, no faces, no cartoon, no comic, no characters.
Background: {color}.
Hero visual: {metaphor} — single focal point, clean flat vector with subtle soft shadow, not photorealistic.
Bold sans-serif headline text exactly: "{text}" in dark navy #0f172a, large and readable at small size.
Small corner badge "{badge}" in muted gold.
Premium enterprise GenAI blog aesthetic. Cream #f7f3ea base, gold #c9a227 accents. Lots of whitespace.
Designed to stop scroll on LinkedIn and invite click.

NEGATIVE:
people, human, face, hands, cartoon, comic, anime, mascot, robot, android character,
busy infographic, multiple small labels, paragraph text, watermark, logo, stock photo,
3D person, cluttered layout, cyberpunk, matrix code, generic glowing AI brain, childish style
"""

HOOKS = {
    1: "Surprise model bills often come from what you pack into context—not from user chat length.",
    2: "Temperature fixes tone, not wrong facts—learn when knobs help and when they hurt.",
    3: "Stop rewriting prompts from scratch—use production-tested patterns.",
    4: "One giant system prompt nobody owns is how enterprise copilots drift.",
    5: "Downstream code needs JSON that parses every time—not usually.",
    6: "Tool-calling turns your app into a distributed system with real side effects.",
    7: "Most RAG failures are wrong retrieval—the model believed the wrong paragraph.",
    8: "Chunk boundaries decide what your vector DB can ever find.",
    9: "Vector search is fast; reranking decides what the LLM actually reads.",
    10: "System, RAG, and history fight for the same context window.",
    11: "Fluent wrong answers need grounding—not a bigger model.",
    12: "Ship golden-set evals before you ship Friday deploys.",
    13: "Unbounded agent loops burn tokens and duplicate writes.",
    14: "Block bad input before tokens hit the model—not after.",
    15: "Your p95 latency often hides in retrieval and buffering—not generation.",
    16: "Finance asks about the invoice—engineers need token unit economics.",
    17: "Cache the right layer or pay full model price for the same FAQ.",
    18: "HTTP 200 with a wrong answer needs a trace—not a guess.",
    19: "Tickets and PDFs can inject instructions—treat data as hostile.",
    20: "Guardrails run ops; governance decides who owns policy before prod.",
}

def main():
    out = Path(__file__).resolve().parents[1] / "image_prompts"
    for num, slug, title, text, metaphor, color in PROMPTS:
        badge = f"{num:02d}"
        content = TEMPLATE.format(
            num=num, slug=slug, title=title, hook=HOOKS[num],
            text=text, metaphor=metaphor, color=color, badge=badge,
        )
        path = out / f"{slug}.txt"
        path.write_text(content, encoding="utf-8")
        print("wrote", path.name)

if __name__ == "__main__":
    main()
