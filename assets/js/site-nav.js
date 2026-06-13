(function () {
  'use strict';

  var NAV_ITEMS = [
    { id: 'home', label: 'Home', href: 'index.html' },
    { id: 'ascent', label: 'The Ascent', href: 'ascent.html' },
    { id: 'blogs', label: 'Blogs', href: 'blogs.html' },
    { id: 'mylearnings', label: 'My Learnings', href: 'mylearnings.html' },
    { id: 'quizzes', label: 'Quizzes', href: 'quizzes.html' },
    { id: 'learn', label: 'Learn', href: 'learn.html' },
  ];

  var CONTACT = {
    phone: '+918220829666',
    phoneDisplay: '+91 822 082 9666',
    email: 'prem2282@gmail.com',
    linkedIn: 'https://www.linkedin.com/in/prem2282/',
  };

  function linkHref(base, href) {
    return base + href;
  }

  function navLinkClass(id, active, theme) {
    var cls = 'nav-link';
    if (theme === 'light') cls += ' nav-link--light';
    if (id === active) cls += ' active';
    return cls;
  }

  function mobileLinkClass(id, active, theme) {
    var cls = 'mobile-link';
    if (theme === 'light') cls += ' mobile-link--light';
    if (id === active) cls += ' active';
    return cls;
  }

  function buildNavList(base, active, theme, linkClassFn, tag) {
    return NAV_ITEMS.map(function (item) {
      var cls = linkClassFn(item.id, active, theme);
      return '<li><a href="' + linkHref(base, item.href) + '" class="' + cls + '">' + item.label + '</a></li>';
    }).join('');
  }

  function renderNav(root) {
    var base = root.getAttribute('data-base') || '';
    var active = root.getAttribute('data-active') || '';
    var theme = root.getAttribute('data-theme') || 'dark';
    var headerClass = theme === 'light' ? 'site-header site-header--light' : 'site-header';

    root.innerHTML =
      '<header class="' + headerClass + '">' +
        '<nav class="site-nav-inner" aria-label="Main">' +
          '<div class="site-nav-start">' +
            '<a href="' + linkHref(base, 'index.html') + '" class="nav-home" aria-label="Home">' +
              '<img src="' + base + 'Prem_2026.webp" alt="" class="nav-home-avatar" width="40" height="40" decoding="async" />' +
            '</a>' +
            '<div class="nav-connect">' +
              '<button type="button" id="nav-connect-toggle" class="nav-connect-btn" aria-expanded="false" aria-controls="nav-connect-panel">' +
                'Let\'s connect' +
              '</button>' +
              '<div id="nav-connect-panel" class="nav-connect-panel hidden" aria-hidden="true" role="dialog" aria-label="Contact Prem">' +
                '<a href="tel:' + CONTACT.phone + '" class="nav-connect-item">' +
                  '<span class="nav-connect-label">Phone</span>' +
                  '<span class="nav-connect-value">' + CONTACT.phoneDisplay + '</span>' +
                '</a>' +
                '<a href="mailto:' + CONTACT.email + '" class="nav-connect-item">' +
                  '<span class="nav-connect-label">Email</span>' +
                  '<span class="nav-connect-value">' + CONTACT.email + '</span>' +
                '</a>' +
                '<a href="' + CONTACT.linkedIn + '" class="nav-connect-item" target="_blank" rel="noopener noreferrer">' +
                  '<span class="nav-connect-label">LinkedIn</span>' +
                  '<span class="nav-connect-value">prem2282</span>' +
                '</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="site-nav-end">' +
            '<ul id="nav-menu" class="nav-menu">' +
              buildNavList(base, active, theme, navLinkClass) +
            '</ul>' +
            '<button type="button" id="nav-toggle" class="nav-toggle" aria-expanded="false" aria-controls="nav-menu">' +
              '<span class="sr-only">Menu</span>' +
              '<span class="nav-bar"></span>' +
              '<span class="nav-bar"></span>' +
              '<span class="nav-bar"></span>' +
            '</button>' +
          '</div>' +
        '</nav>' +
        '<div id="mobile-menu" class="mobile-menu hidden" aria-hidden="true">' +
          '<ul class="mobile-menu-list">' +
            buildNavList(base, active, theme, mobileLinkClass) +
          '</ul>' +
        '</div>' +
      '</header>';
  }

  function bindNavBehavior(header) {
    if (!header) return;

    var navToggle = document.getElementById('nav-toggle');
    var mobileMenu = document.getElementById('mobile-menu');
    var connectToggle = document.getElementById('nav-connect-toggle');
    var connectPanel = document.getElementById('nav-connect-panel');

    function closeConnectPanel() {
      if (!connectToggle || !connectPanel) return;
      connectToggle.setAttribute('aria-expanded', 'false');
      connectPanel.classList.add('hidden');
      connectPanel.setAttribute('aria-hidden', 'true');
    }

    function closeMobileMenu() {
      if (!navToggle || !mobileMenu) return;
      navToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.add('hidden');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (connectToggle && connectPanel) {
      connectToggle.addEventListener('click', function (event) {
        event.stopPropagation();
        var expanded = connectToggle.getAttribute('aria-expanded') === 'true';
        if (!expanded) closeMobileMenu();
        connectToggle.setAttribute('aria-expanded', String(!expanded));
        connectPanel.classList.toggle('hidden', expanded);
        connectPanel.setAttribute('aria-hidden', String(expanded));
      });

      connectPanel.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          closeConnectPanel();
        });
      });
    }

    document.addEventListener('click', function (event) {
      if (connectPanel && !connectPanel.classList.contains('hidden')) {
        if (!event.target.closest('.nav-connect')) closeConnectPanel();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeConnectPanel();
    });

    if (navToggle && mobileMenu) {
      navToggle.addEventListener('click', function () {
        var expanded = navToggle.getAttribute('aria-expanded') === 'true';
        if (!expanded) closeConnectPanel();
        navToggle.setAttribute('aria-expanded', String(!expanded));
        mobileMenu.classList.toggle('hidden', expanded);
        mobileMenu.setAttribute('aria-hidden', String(expanded));
        document.body.style.overflow = expanded ? '' : 'hidden';
      });

      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          closeMobileMenu();
        });
      });
    }
  }

  var root = document.getElementById('site-nav-root');
  if (root) {
    renderNav(root);
    bindNavBehavior(root.querySelector('.site-header'));
  }
})();
