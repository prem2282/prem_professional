/**
 * Blog hero thumbnail: show only when image loads; remove block if missing (no broken icon).
 */
(function () {
  'use strict';

  document.querySelectorAll('.blog-hero img').forEach(function (img) {
    var figure = img.closest('.blog-hero');
    if (!figure) return;

    function reveal() {
      figure.hidden = false;
      figure.classList.add('is-loaded');
    }

    function removeHero() {
      figure.remove();
    }

    if (img.complete) {
      if (img.naturalWidth > 0) reveal();
      else removeHero();
      return;
    }

    img.addEventListener('load', reveal);
    img.addEventListener('error', removeHero);
  });
})();
