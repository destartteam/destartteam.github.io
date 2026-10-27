
(function (App) {
  'use strict';

  function initFaq() {
    var items = document.querySelectorAll('[data-faq-item]');

    items.forEach(function (item) {
      var button = item.querySelector('[data-faq-toggle]');

      button.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        items.forEach(function (other) {
          other.classList.remove('is-open');
          other.querySelector('[data-faq-toggle]').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('is-open');
          button.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  App.initFaq = initFaq;
})(window.DEStart);
