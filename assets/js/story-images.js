(function () {
  'use strict';

  document.querySelectorAll('.comic-panel').forEach(function (panel) {
    var img = panel.querySelector('.comic-image');
    var fallback = panel.querySelector('.comic-fallback');
    if (!img || !fallback) return;

    function showImage() {
      img.hidden = false;
      fallback.hidden = true;
    }

    function showFallback() {
      img.hidden = true;
      fallback.hidden = false;
    }

    img.addEventListener('load', showImage);
    img.addEventListener('error', showFallback);

    if (img.complete) {
      if (img.naturalWidth > 0) showImage();
      else showFallback();
    }
  });
})();
