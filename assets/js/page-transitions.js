/**
 * Fade transitions between blog / my learnings pages (list + articles).
 */
(function () {
  'use strict';

  var DURATION = 300;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var useNativeVT =
    typeof HTMLMetaElement !== 'undefined' &&
    HTMLMetaElement.supports &&
    HTMLMetaElement.supports('view-transition');

  var ROUTE_RE =
    /\/(?:blogs\/(?:\d{2}-[^/]+\.html|[^/]+\.html)|blogs\.html|mylearnings\/[^/]+\.html|mylearnings\.html)$/;

  function navigateWithTransition(url) {
    if (reduced || useNativeVT) {
      location.href = url;
      return;
    }
    document.documentElement.classList.add('page-leaving');
    window.setTimeout(function () {
      location.href = url;
    }, DURATION);
  }

  window.navigateWithTransition = navigateWithTransition;

  function onReady() {
    document.documentElement.classList.remove('page-transition-pending');
    if (reduced || useNativeVT) return;

    document.documentElement.classList.add('page-entering');
    window.requestAnimationFrame(function () {
      document.documentElement.classList.add('page-enter-active');
    });
    window.setTimeout(function () {
      document.documentElement.classList.remove('page-entering', 'page-enter-active');
    }, DURATION + 80);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  function isTransitionLink(anchor, event) {
    if (!anchor || !anchor.getAttribute('href')) return false;
    if (anchor.target === '_blank' || anchor.hasAttribute('download')) return false;
    if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return false;

    var href = anchor.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) {
      return false;
    }

    var url;
    try {
      url = new URL(anchor.href, location.href);
    } catch (err) {
      return false;
    }

    if (url.origin !== location.origin) return false;
    return ROUTE_RE.test(url.pathname);
  }

  if (!useNativeVT) {
    document.addEventListener('click', function (event) {
      var anchor = event.target.closest('a');
      if (!isTransitionLink(anchor, event)) return;
      event.preventDefault();
      navigateWithTransition(anchor.href);
    });
  }
})();
