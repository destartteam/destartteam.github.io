
(function (App) {
  'use strict';

  document.documentElement.classList.remove('no-js');

  function init() {
    App.initHeader();
    App.initModal();
    App.initForm();
    App.initFaq();
    App.initAnimations();

    var year = document.querySelector('[data-year]');
    if (year) year.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window.DEStart);
