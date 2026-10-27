
(function (App) {
  'use strict';

  var modal, lastFocused;

  function open() {
    lastFocused = document.activeElement;
    modal.classList.remove('is-success');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');

    var firstInput = modal.querySelector('input');
    if (firstInput) setTimeout(function () { firstInput.focus(); }, 60);
  }

  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    if (lastFocused) lastFocused.focus();
  }

  function showSuccess() {
    modal.classList.add('is-success');
  }

  function initModal() {
    modal = document.querySelector('[data-modal]');
    if (!modal) return;

    document.querySelectorAll('[data-modal-open]').forEach(function (btn) {
      btn.addEventListener('click', open);
    });

    modal.querySelectorAll('[data-modal-close]').forEach(function (btn) {
      btn.addEventListener('click', close);
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
  }

  App.initModal = initModal;
  App.modal = { open: open, close: close, showSuccess: showSuccess };
})(window.DEStart);
