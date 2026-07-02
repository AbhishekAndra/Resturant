/* Stackly — Login page logic (validates against Auth / DEMO_CREDENTIALS) */
(function () {
  'use strict';

  var form = document.getElementById('login-form');
  var statusRegion = document.getElementById('login-status');
  var emailInput = document.getElementById('li-email');
  var passwordInput = document.getElementById('li-password');
  var emailErr = document.getElementById('err-li-email');
  var passwordErr = document.getElementById('err-li-password');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Already logged in? Skip straight to the right dashboard.
  var existingSession = Auth.getSession();
  if (existingSession) {
    window.location.href = existingSession.role === 'admin' ? 'admin-dashboard.html' : 'customer-dashboard.html';
    return;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusRegion.innerHTML = '';
    emailErr.textContent = '';
    passwordErr.textContent = '';
    emailInput.setAttribute('aria-invalid', 'false');
    passwordInput.setAttribute('aria-invalid', 'false');

    var email = emailInput.value.trim();
    var password = passwordInput.value;
    var valid = true;

    if (!email || !EMAIL_RE.test(email)) {
      emailErr.textContent = 'Please enter a valid email address.';
      emailInput.setAttribute('aria-invalid', 'true');
      valid = false;
    }
    if (!password) {
      passwordErr.textContent = 'Please enter your password.';
      passwordInput.setAttribute('aria-invalid', 'true');
      valid = false;
    }
    if (!valid) return;

    var result = Auth.validateLogin(email, password);
    if (!result.ok) {
      var message = result.reason === 'password'
        ? 'Incorrect password. Please try again.'
        : 'No account found with that email. Check the demo credentials above or sign up.';
      statusRegion.innerHTML = '<div class="form-banner-error" role="alert">' + message + '</div>';
      return;
    }

    Auth.setSession({ email: result.email, name: result.name, role: result.role });
    if (window.refreshAuthNav) refreshAuthNav();
    showToast('Welcome back, ' + result.name.split(' ')[0] + '!');

    var params = new URLSearchParams(window.location.search);
    var redirect = params.get('redirect');
    var destination = redirect || (result.role === 'admin' ? 'admin-dashboard.html' : 'customer-dashboard.html');
    setTimeout(function () { window.location.href = destination; }, 500);
  });
})();
