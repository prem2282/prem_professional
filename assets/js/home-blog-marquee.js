(function () {
  'use strict';

  var blogTrack = document.getElementById('blog-rotator-track');
  var learningTrack = document.getElementById('learning-rotator-track');
  if (!blogTrack && !learningTrack) return;

  var BLOG_POSTS = [
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
    {
      tag: 'Performance',
      title: 'Latency Optimization for LLM Apps',
      desc: 'Latency Waterfall Lab—stack p95 by gateway, RAG, TTFT, and tools.',
      href: 'blogs/latency-optimization-for-llm-apps.html',
    },
    {
      tag: 'FinOps',
      title: 'Cost Optimization and Token Budgeting',
      desc: 'Monthly Burn Ledger—volume, token shape, and optimization levers.',
      href: 'blogs/cost-optimization-and-token-budgeting.html',
    },
    {
      tag: 'Performance',
      title: 'Caching Strategies for AI Responses',
      desc: 'Cache Topology Explorer—exact, semantic, prompt, and retrieval layers.',
      href: 'blogs/caching-strategies-for-ai-responses.html',
    },
    {
      tag: 'Ops',
      title: 'Observability for GenAI Systems',
      desc: 'Minimum Viable Dashboard builder—P0/P1 signals and readiness score.',
      href: 'blogs/observability-for-genai-systems.html',
    },
    {
      tag: 'Security',
      title: 'Prompt Injection and Security Hardening',
      desc: 'Red Team Payload Deck—attacks vs your defense layers.',
      href: 'blogs/prompt-injection-and-security-hardening.html',
    },
    {
      tag: 'Governance',
      title: 'AI Governance and Responsible Deployment',
      desc: 'Governance Ladder—maturity tiers, controls, and RACI.',
      href: 'blogs/ai-governance-and-responsible-deployment.html',
    },
  ];

  var LEARNING_POSTS = [
    {
      tag: 'Experience',
      title: 'When "Hi" Cost 20,000 Tokens: Routing Greetings Before RAG',
      desc: 'A first-turn intent gate saved ~20% tokens in an early enterprise chatbot pilot.',
      href: 'mylearnings/greeting-vs-real-question-rag-gate.html',
    },
    {
      tag: 'Field Story',
      title: 'Beautiful Markdown, Wrong Numbers: Vision PDF Precision Fix',
      desc: 'Why vision-only ingest failed dense catalog tables and how text grounding fixed it.',
      href: 'mylearnings/precision-vs-details-vision-pdf-grounding.html',
    },
    {
      tag: 'My Learnings',
      title: 'All My Learnings',
      desc: 'Browse practical field stories from production GenAI and cloud delivery.',
      href: 'mylearnings.html',
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

  function cardHtml(post, tone) {
    return (
      '<a class="blog-marquee-card tone-' + tone + '" href="' + post.href + '">' +
      '<span class="blog-marquee-card-tag">' + post.tag + '</span>' +
      '<h3 class="blog-marquee-card-title">' + post.title + '</h3>' +
      '<p class="blog-marquee-card-desc">' + post.desc + '</p>' +
      '<span class="blog-marquee-card-cta">Read post →</span>' +
      '</a>'
    );
  }

  function chooseInitial(pool, count) {
    var shuffled = shuffle(pool);
    var chosen = [];
    for (var i = 0; i < count; i++) {
      chosen.push(shuffled[i % shuffled.length]);
    }
    return chosen;
  }

  function chooseNext(pool, currentHref) {
    var candidates = pool.filter(function (p) {
      return p.href !== currentHref;
    });
    if (!candidates.length) return pool[Math.floor(Math.random() * pool.length)];
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function chooseNextTone(currentTone) {
    var next = 1 + Math.floor(Math.random() * 5);
    if (next === currentTone) next = (next % 5) + 1;
    return next;
  }

  function buildRotator(track, pool) {
    if (!track || !pool.length) return;
    var slots = Math.min(3, pool.length || 3);
    var current = chooseInitial(pool, slots);
    var tones = [];
    for (var i = 0; i < slots; i++) tones.push((i % 5) + 1);
    track.innerHTML = current.map(function (post, idx) {
      return cardHtml(post, tones[idx]);
    }).join('');

    var nextSlot = 0;
    setInterval(function () {
      var cards = Array.prototype.slice.call(track.querySelectorAll('.blog-marquee-card'));
      if (!cards.length) return;
      var idx = nextSlot % cards.length;
      var card = cards[idx];
      card.classList.add('is-swapping');

      setTimeout(function () {
        var nextPost = chooseNext(pool, current[idx].href);
        var nextTone = chooseNextTone(tones[idx]);
        current[idx] = nextPost;
        tones[idx] = nextTone;
        card.outerHTML = cardHtml(nextPost, nextTone);
        cards = Array.prototype.slice.call(track.querySelectorAll('.blog-marquee-card'));
        card = cards[idx];
        if (!card) return;
        card.classList.add('is-entering');
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            card.classList.remove('is-entering');
          });
        });
      }, 460);

      nextSlot = (nextSlot + 1) % slots;
    }, 5000);
  }

  buildRotator(blogTrack, BLOG_POSTS);
  buildRotator(learningTrack, LEARNING_POSTS);
})();
