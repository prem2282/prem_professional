(function () {
  'use strict';

  var track = document.getElementById('blog-marquee-track');
  if (!track) return;

  var POSTS = [
    {
      tag: 'Foundations',
      title: 'Tokens: The Smallest Unit That Controls Your Entire AI Architecture',
      desc: 'Token budgets, context windows, cost control, and an interactive Token Lab.',
      href: 'blogs/tokens.html',
    },
    {
      tag: 'Tuning',
      title: 'Parameters: Turning LLM Behavior into a Design Choice',
      desc: 'Temperature, top_p, output limits, and the Parameter Cockpit.',
      href: 'blogs/parameters.html',
    },
    {
      tag: 'Patterns',
      title: 'Prompt Engineering Patterns: A Practical Pattern Library',
      desc: 'Reusable templates, before/after examples, and production checklists.',
      href: 'blogs/prompt-engineering-patterns.html',
    },
    {
      tag: 'Enterprise',
      title: 'System Prompt Design for Enterprise Apps: A Blueprint',
      desc: 'Layered system prompts, policy guardrails, and governance.',
      href: 'blogs/system-prompt-design-enterprise-apps.html',
    },
    {
      tag: 'Reliability',
      title: 'Structured Output and JSON Reliability',
      desc: 'Schema-first design, validation, repair retries, and fail-closed output.',
      href: 'blogs/structured-output-json-reliability.html',
    },
    {
      tag: 'Tools',
      title: 'Function Calling and Tool Use Patterns',
      desc: 'Tool contracts, retries, idempotency, and safety guardrails.',
      href: 'blogs/function-calling-and-tool-use-patterns.html',
    },
    {
      tag: 'RAG',
      title: 'RAG Fundamentals for Production',
      desc: 'Pipeline investigator—chunking, retrieval, reranking, and context.',
      href: 'blogs/rag-fundamentals-for-production.html',
    },
    {
      tag: 'RAG',
      title: 'Chunking and Embedding Strategies',
      desc: 'Split & Map Studio and Embedding Space Explorer workshops.',
      href: 'blogs/chunking-and-embedding-strategies.html',
    },
    {
      tag: 'RAG',
      title: 'Reranking and Retrieval Quality',
      desc: 'Rerank Arena and cross-encoder trade-offs in production.',
      href: 'blogs/reranking-and-retrieval-quality.html',
    },
    {
      tag: 'Context',
      title: 'Context Window Management',
      desc: 'Context Tape Allocator—budget system, RAG, history, and output reserve.',
      href: 'blogs/context-window-management.html',
    },
    {
      tag: 'Trust',
      title: 'Hallucination Mitigation in Enterprise Workflows',
      desc: 'Grounding ladder, citations, verify passes, and abstain policies.',
      href: 'blogs/hallucination-mitigation-enterprise-workflows.html',
    },
    {
      tag: 'Eval',
      title: 'Evaluation Frameworks (Offline and Online)',
      desc: 'Golden sets, CI gates, canaries, and the Eval Regression Board.',
      href: 'blogs/evaluation-frameworks-offline-and-online.html',
    },
    {
      tag: 'Agents',
      title: 'Agentic Workflows and Multi-step Planning',
      desc: 'Agent Trace Player—plans, tools, loops, and recovery paths.',
      href: 'blogs/agentic-workflows-multi-step-planning.html',
    },
    {
      tag: 'Safety',
      title: 'Guardrails, Safety, and Policy Enforcement',
      desc: 'Policy Gate Simulator—PII, injection, topic, and tool ACL layers.',
      href: 'blogs/guardrails-safety-policy-enforcement.html',
    },
  ];

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function cardHtml(post) {
    return (
      '<a class="blog-marquee-card" href="' + post.href + '">' +
      '<span class="blog-marquee-card-tag">' + post.tag + '</span>' +
      '<h3 class="blog-marquee-card-title">' + post.title + '</h3>' +
      '<p class="blog-marquee-card-desc">' + post.desc + '</p>' +
      '<span class="blog-marquee-card-cta">Read post →</span>' +
      '</a>'
    );
  }

  var picked = shuffle(POSTS).slice(0, 5);
  var html = picked.map(cardHtml).join('');
  track.innerHTML = html + html;
})();
