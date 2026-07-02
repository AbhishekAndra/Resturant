/* Stackly — Contact form validation (client-side demo, no backend) */
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var statusRegion = document.getElementById('form-status-region');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var MOBILE_RE = /^(\+91[\s-]?)?[6-9]\d{9}$/;

  var fields = {
    name: { el: document.getElementById('cf-name'), err: document.getElementById('err-name') },
    email: { el: document.getElementById('cf-email'), err: document.getElementById('err-email') },
    mobile: { el: document.getElementById('cf-mobile'), err: document.getElementById('err-mobile') },
    subject: { el: document.getElementById('cf-subject'), err: document.getElementById('err-subject') },
    message: { el: document.getElementById('cf-message'), err: document.getElementById('err-message') }
  };

  function setError(key, message) {
    fields[key].err.textContent = message;
    fields[key].el.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validate() {
    var valid = true;

    var name = fields.name.el.value.trim();
    if (!name) { setError('name', 'Please enter your name.'); valid = false; }
    else { setError('name', ''); }

    var email = fields.email.el.value.trim();
    if (!email) { setError('email', 'Please enter your email address.'); valid = false; }
    else if (!EMAIL_RE.test(email)) { setError('email', 'Please enter a valid email address (e.g. name@example.com).'); valid = false; }
    else { setError('email', ''); }

    var mobile = fields.mobile.el.value.trim();
    if (mobile && !MOBILE_RE.test(mobile.replace(/\s/g, ''))) {
      setError('mobile', 'Please enter a valid 10-digit Indian mobile number.');
      valid = false;
    } else {
      setError('mobile', '');
    }

    var subject = fields.subject.el.value.trim();
    if (!subject) { setError('subject', 'Please add a subject.'); valid = false; }
    else { setError('subject', ''); }

    var message = fields.message.el.value.trim();
    if (!message) { setError('message', 'Please write a short message.'); valid = false; }
    else if (message.length < 10) { setError('message', 'Message should be at least 10 characters.'); valid = false; }
    else { setError('message', ''); }

    return valid;
  }

  Object.keys(fields).forEach(function (key) {
    fields[key].el.addEventListener('blur', validate);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusRegion.innerHTML = '';

    if (!validate()) {
      statusRegion.innerHTML = '<div class="form-banner-error" role="alert">Please fix the highlighted fields before sending your message.</div>';
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    statusRegion.innerHTML = '<div class="form-success" role="status">Thanks! Your message has been received — we will get back to you within a few hours.</div>';
    form.reset();
    Object.keys(fields).forEach(function (key) { setError(key, ''); });
  });
})();
