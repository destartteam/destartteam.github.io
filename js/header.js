
(function (App) {
  'use strict';

  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;

    var burger = header.querySelector('[data-burger]');
    var nav = header.querySelector('[data-nav]');

    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Мобільне меню
    function setMenu(open) {
      header.classList.toggle('is-menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
    }

    burger.addEventListener('click', function () {
      setMenu(!header.classList.contains('is-menu-open'));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  App.initHeader = initHeader;
})(window.DEStart);
