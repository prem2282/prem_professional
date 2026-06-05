/**
 * Floating prev/next arrows on blog and my learnings article pages.
 */
(function () {
  'use strict';

  var SERIES = {
    blogs: [
      { file: '01-tokens.html', title: 'Tokens' },
      { file: '02-parameters.html', title: 'Parameters' },
      { file: '03-prompt-engineering-patterns.html', title: 'Prompt Patterns' },
      { file: '04-system-prompt-design-enterprise-apps.html', title: 'System Prompts' },
      { file: '05-structured-output-json-reliability.html', title: 'Structured Output' },
      { file: '06-function-calling-and-tool-use-patterns.html', title: 'Function Calling' },
      { file: '07-rag-fundamentals-for-production.html', title: 'RAG Fundamentals' },
      { file: '08-chunking-and-embedding-strategies.html', title: 'Chunking & Embeddings' },
      { file: '09-reranking-and-retrieval-quality.html', title: 'Reranking' },
      { file: '10-context-window-management.html', title: 'Context Window' },
      { file: '11-hallucination-mitigation-enterprise-workflows.html', title: 'Hallucination' },
      { file: '12-evaluation-frameworks-offline-and-online.html', title: 'Evaluation' },
      { file: '13-agentic-workflows-multi-step-planning.html', title: 'Agentic Workflows' },
      { file: '14-guardrails-safety-policy-enforcement.html', title: 'Guardrails' },
      { file: '15-latency-optimization-for-llm-apps.html', title: 'Latency' },
      { file: '16-cost-optimization-and-token-budgeting.html', title: 'Cost Optimization' },
      { file: '17-caching-strategies-for-ai-responses.html', title: 'Caching' },
      { file: '18-observability-for-genai-systems.html', title: 'Observability' },
      { file: '19-prompt-injection-and-security-hardening.html', title: 'Prompt Injection' },
      { file: '20-ai-governance-and-responsible-deployment.html', title: 'AI Governance' },
    ],
    mylearnings: [
      { file: 'greeting-vs-real-question-rag-gate.html', title: 'Greeting vs RAG Gate' },
      { file: 'precision-vs-details-vision-pdf-grounding.html', title: 'Vision PDF Precision' },
    ],
  };

  var ARROW_LEFT =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
  var ARROW_RIGHT =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>';

  var file = (location.pathname.split('/').pop() || '').split('?')[0].split('#')[0];
  var items = null;

  Object.keys(SERIES).some(function (key) {
    if (SERIES[key].some(function (p) { return p.file === file; })) {
      items = SERIES[key];
      return true;
    }
    return false;
  });

  if (!items) return;

  var idx = items.findIndex(function (p) { return p.file === file; });
  if (idx < 0) return;

  var prev = idx > 0 ? items[idx - 1] : null;
  var next = idx < items.length - 1 ? items[idx + 1] : null;
  if (!prev && !next) return;

  var nav = document.createElement('nav');
  nav.className = 'post-nav-float';
  nav.setAttribute('aria-label', 'Post navigation');

  function makeBtn(post, dir) {
    var a = document.createElement('a');
    a.className = 'post-nav-float-btn post-nav-float-btn--' + dir;
    a.href = post.file;
    a.innerHTML = dir === 'prev' ? ARROW_LEFT : ARROW_RIGHT;
    a.setAttribute('aria-label', (dir === 'prev' ? 'Previous' : 'Next') + ': ' + post.title);
    a.title = post.title;
    return a;
  }

  if (prev) nav.appendChild(makeBtn(prev, 'prev'));
  if (next) nav.appendChild(makeBtn(next, 'next'));

  document.body.appendChild(nav);

  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;
    if (e.key === 'ArrowLeft' && prev) {
      (window.navigateWithTransition || function (u) { location.href = u; })(prev.file);
    }
    if (e.key === 'ArrowRight' && next) {
      (window.navigateWithTransition || function (u) { location.href = u; })(next.file);
    }
  });
})();
