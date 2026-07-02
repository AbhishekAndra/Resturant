/* Stackly — Sign In / Create Account page logic */
(function () {
  'use strict';

  var existingSession = Auth.getSession();
  if (existingSession) {
    window.location.href = existingSession.role === 'admin' ? 'admin-dashboard.html' : 'customer-dashboard.html';
    return;
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ---- Tab switching ---- */
  var tabs = document.querySelectorAll('.role-tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      document.querySelectorAll('[data-panel]').forEach(function (panel) {
        panel.hidden = panel.getAttribute('data-panel') !== tab.getAttribute('data-tab');
      });
    });
  });

  /* ---- Sign In form (validates against hardcoded demo credentials) ---- */
  var signinForm = document.getElementById('signin-form');
  var signinStatus = document.getElementById('signin-status');
  signinForm.addEventListener('submit', function (e) {
    e.preventDefault();
    signinStatus.innerHTML = '';
    var emailEl = document.getElementById('si-email');
    var passwordEl = document.getElementById('si-password');
    var emailErr = document.getElementById('err-si-email');
    var passwordErr = document.getElementById('err-si-password');
    emailErr.textContent = '';
    passwordErr.textContent = '';

    var email = emailEl.value.trim();
    var password = passwordEl.value;
    var valid = true;
    if (!email || !EMAIL_RE.test(email)) { emailErr.textContent = 'Please enter a valid email address.'; valid = false; }
    if (!password) { passwordErr.textContent = 'Please enter your password.'; valid = false; }
    if (!valid) return;

    var result = Auth.validateLogin(email, password);
    if (!result.ok) {
      var message = result.reason === 'password' ? 'Incorrect password. Please try again.' : 'No account found with that email. Try the Create Account tab.';
      signinStatus.innerHTML = '<div class="form-banner-error" role="alert">' + message + '</div>';
      return;
    }

    Auth.setSession({ email: result.email, name: result.name, role: result.role });
    if (window.refreshAuthNav) refreshAuthNav();
    showToast('Signed in as ' + result.name.split(' ')[0]);
    setTimeout(function () {
      window.location.href = result.role === 'admin' ? 'admin-dashboard.html' : 'customer-dashboard.html';
    }, 500);
  });

  /* ---- Create Account form (local demo registration) ---- */
  var signupForm = document.getElementById('signup-form');
  var signupStatus = document.getElementById('signup-status');
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    signupStatus.innerHTML = '';

    var nameEl = document.getElementById('su-name');
    var emailEl = document.getElementById('su-email');
    var passwordEl = document.getElementById('su-password');
    var confirmEl = document.getElementById('su-confirm');
    var errs = {
      name: document.getElementById('err-su-name'),
      email: document.getElementById('err-su-email'),
      password: document.getElementById('err-su-password'),
      confirm: document.getElementById('err-su-confirm')
    };
    Object.keys(errs).forEach(function (k) { errs[k].textContent = ''; });

    var valid = true;
    if (!nameEl.value.trim()) { errs.name.textContent = 'Please enter your name.'; valid = false; }

    var email = emailEl.value.trim();
    if (!email || !EMAIL_RE.test(email)) { errs.email.textContent = 'Please enter a valid email address.'; valid = false; }
    else if (email.toLowerCase() === DEMO_CREDENTIALS.customer.email.toLowerCase() || email.toLowerCase() === DEMO_CREDENTIALS.admin.email.toLowerCase() || Auth.findRegisteredUser(email)) {
      errs.email.textContent = 'An account with this email already exists. Try signing in instead.';
      valid = false;
    }

    if (!passwordEl.value || passwordEl.value.length < 6) { errs.password.textContent = 'Password must be at least 6 characters.'; valid = false; }
    if (confirmEl.value !== passwordEl.value || !confirmEl.value) { errs.confirm.textContent = 'Passwords do not match.'; valid = false; }

    if (!valid) return;

    Auth.registerUser(nameEl.value.trim(), email, passwordEl.value);
    Auth.setSession({ email: email.toLowerCase(), name: nameEl.value.trim(), role: 'customer' });
    if (window.refreshAuthNav) refreshAuthNav();
    showToast('Account created — welcome!');
    setTimeout(function () { window.location.href = 'customer-dashboard.html'; }, 500);
  });
})();
