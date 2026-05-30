(function () {
  'use strict';

  var SLIDES = {
    cognizant: [
      { src: 'assets/images/story/cognizant/prologue.webp', alt: 'Cognizant — Prologue' },
      { src: 'assets/images/story/cognizant/section-1.webp', alt: 'Cognizant — The Mainframe Cradle' },
      { src: 'assets/images/story/cognizant/section-2.webp', alt: 'Cognizant — Across the Atlantic' },
      { src: 'assets/images/story/cognizant/section-3.webp', alt: 'Cognizant — Home Again, Larger Horizons' },
      { src: 'assets/images/story/cognizant/section-4.webp', alt: 'Cognizant — The Architect\'s Turn' },
      { src: 'assets/images/story/cognizant/section-5.webp', alt: 'Cognizant — Life Sciences' },
      { src: 'assets/images/story/cognizant/epilogue.webp', alt: 'Cognizant — Epilogue' },
    ],
    ecgroup: [
      { src: 'assets/images/story/ecgroup/prologue.webp', alt: 'EC Group — A New Kind of Ascent' },
      { src: 'assets/images/story/ecgroup/section-1.webp', alt: 'EC Group — From Zero to SaaS' },
      { src: 'assets/images/story/ecgroup/section-2.webp', alt: 'EC Group — The GenAI Horizon' },
      { src: 'assets/images/story/ecgroup/section-3.webp', alt: 'EC Group — The Technology Tapestry' },
      { src: 'assets/images/story/ecgroup/section-4.webp', alt: 'EC Group — How We Work' },
      { src: 'assets/images/story/ecgroup/epilogue.webp', alt: 'EC Group — Still Building' },
    ],
  };

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.story-card-slideshow[data-slideshow]').forEach(function (root) {
    var key = root.getAttribute('data-slideshow');
    var slides = SLIDES[key];
    if (!slides || !slides.length) return;

    var interval = parseInt(root.getAttribute('data-interval'), 10) || 3500;

    slides.forEach(function (slide, index) {
      var img = document.createElement('img');
      img.src = slide.src;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      img.loading = index === 0 ? 'eager' : 'lazy';
      img.decoding = 'async';
      if (index === 0) img.classList.add('is-active');
      root.appendChild(img);
    });

    if (reducedMotion || slides.length < 2) return;

    var imgs = root.querySelectorAll('img');
    var current = 0;

    window.setInterval(function () {
      imgs[current].classList.remove('is-active');
      current = (current + 1) % imgs.length;
      imgs[current].classList.add('is-active');
    }, interval);
  });
})();
