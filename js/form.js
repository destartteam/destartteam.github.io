/* ==========================================================================
   Lead form: валідація та надсилання заявки
   ========================================================================== */

(function (App) {
  'use strict';

  var config = App.config;

  /* ---------- Валідатори ---------- */
  var validators = {
    required: function (value) {
      return value.trim().length > 0;
    },
    phone: function (value) {
      var digits = value.replace(/\D/g, '');
      return digits.length >= config.phoneDigits.min && digits.length <= config.phoneDigits.max;
    }
  };

  function validateField(input) {
    var rules = (input.dataset.validate || 'required').split(' ');
    var valid = rules.every(function (rule) {
      return validators[rule] ? validators[rule](input.value) : true;
    });
    input.closest('.field').classList.toggle('is-invalid', !valid);
    return valid;
  }

  function validateConsent(checkbox) {
    checkbox.closest('.checkbox').classList.toggle('is-invalid', !checkbox.checked);
    return checkbox.checked;
  }

  /* ---------- Дані форми ---------- */
  function collectData(form) {
    return {
      firstName: form.elements.firstName.value.trim(),
      lastName:  form.elements.lastName.value.trim(),
      phone:     form.elements.phone.value.trim(),
      specialty: form.elements.specialty.value.trim(),
      website:   form.elements.website ? form.elements.website.value : '', // поле-пастка
      page:      window.location.href,
      createdAt: new Date().toISOString()
    };
  }

  function send(data) {
    if (!config.formEndpoint) {
      // Демо-режим: заявка нікуди не надсилається
      console.info('[DE Start] formEndpoint не налаштовано. Дані заявки:', data);
      return Promise.resolve();
    }

    // Google Apps Script не приймає CORS-запити з JSON-заголовком,
    // тому для нього дані надсилаються як простий текст у режимі no-cors.
    if (isGoogleScript(config.formEndpoint)) {
      return fetch(config.formEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      });
    }

    return fetch(config.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
    });
  }

  function isGoogleScript(url) {
    return url.indexOf('script.google.com') !== -1;
  }

  /* ---------- Ініціалізація ---------- */
  function initForm() {
    var form = document.querySelector('[data-lead-form]');
    if (!form) return;

    var inputs = form.querySelectorAll('[data-validate]');
    var consent = form.querySelector('[data-consent]');
    var submitBtn = form.querySelector('[type="submit"]');

    // Прибираємо помилку, щойно користувач почав виправляти
    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        input.closest('.field').classList.remove('is-invalid');
      });
      input.addEventListener('blur', function () {
        if (input.value) validateField(input);
      });
    });

    consent.addEventListener('change', function () { validateConsent(consent); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var valid = true;
      inputs.forEach(function (input) {
        if (!validateField(input)) valid = false;
      });
      if (!validateConsent(consent)) valid = false;

      if (!valid) {
        var firstError = form.querySelector('.is-invalid input');
        if (firstError) firstError.focus();
        return;
      }

      // Поле-пастка заповнене — це бот. Показуємо «успіх», але нічого не надсилаємо.
      if (form.elements.website && form.elements.website.value) {
        form.reset();
        App.modal.showSuccess();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = config.messages.sending;

      send(collectData(form))
        .then(function () {
          form.reset();
          App.modal.showSuccess();
        })
        .catch(function (err) {
          console.error(err);
          alert(config.messages.networkError);
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = config.messages.submit;
        });
    });
  }

  App.initForm = initForm;
})(window.DEStart);