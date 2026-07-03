/* ==========================================================================
   Stackly — Auth helpers
   Wraps the hardcoded DEMO_CREDENTIALS (from data.js) plus an optional
   locally-changed password and locally-registered demo accounts.
   All state lives in localStorage — there is no real backend.
   ========================================================================== */

var Auth = (function () {
  'use strict';

  var PW_OVERRIDE_KEY = 'src_pw_override';
  var REGISTERED_KEY = 'src_registered_users';
  var SESSION_KEY = 'src_session';

  function getOverrides() {
    try { return JSON.parse(localStorage.getItem(PW_OVERRIDE_KEY) || '{}'); }
    catch (err) { return {}; }
  }

  function getStoredPassword(role) {
    var overrides = getOverrides();
    if (overrides[role]) return overrides[role];
    return DEMO_CREDENTIALS[role] ? DEMO_CREDENTIALS[role].password : null;
  }

  function setStoredPassword(role, newPassword) {
    var overrides = getOverrides();
    overrides[role] = newPassword;
    localStorage.setItem(PW_OVERRIDE_KEY, JSON.stringify(overrides));
  }

  function getRegisteredUsers() {
    try { return JSON.parse(localStorage.getItem(REGISTERED_KEY) || '[]'); }
    catch (err) { return []; }
  }

  function registerUser(name, email, password) {
    var users = getRegisteredUsers();
    users.push({ name: name, email: email.toLowerCase(), password: password });
    localStorage.setItem(REGISTERED_KEY, JSON.stringify(users));
  }

  function findRegisteredUser(email) {
    return getRegisteredUsers().find(function (u) { return u.email === email.toLowerCase(); });
  }

  /* Validates an email/password pair against:
     1) the hardcoded demo customer/admin accounts (data.js), honoring
        any password the user changed via the dashboard, then
     2) locally-registered demo signups. */
  function validateLogin(email, password) {
    var normalized = (email || '').trim().toLowerCase();

    for (var role in DEMO_CREDENTIALS) {
      var account = DEMO_CREDENTIALS[role];
      if (account.email.toLowerCase() === normalized) {
        var expected = getStoredPassword(role);
        if (password === expected) {
          return { ok: true, email: account.email, name: account.name, role: account.role };
        }
        return { ok: false, reason: 'password' };
      }
    }

    var registered = findRegisteredUser(normalized);
    if (registered) {
      if (registered.password === password) {
        return { ok: true, email: registered.email, name: registered.name, role: 'customer' };
      }
      return { ok: false, reason: 'password' };
    }

    // No matching demo/registered account — let any email/password pair in,
    // so testers aren't blocked just for not knowing the demo credentials.
    var guestName = normalized.split('@')[0].replace(/[._-]+/g, ' ').trim();
    guestName = guestName.replace(/\b\w/g, function (c) { return c.toUpperCase(); }) || 'Guest';
    return { ok: true, email: normalized, name: guestName, role: 'customer' };
  }

  function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
    catch (err) { return null; }
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  /* Changes the password for the currently signed-in account, whichever
     store it lives in (hardcoded demo account vs. locally registered user).
     Returns { ok: true } or { ok: false, reason }. */
  function changePassword(session, currentPassword, newPassword) {
    var demoRole = null;
    for (var role in DEMO_CREDENTIALS) {
      if (DEMO_CREDENTIALS[role].email.toLowerCase() === session.email.toLowerCase()) demoRole = role;
    }

    if (demoRole) {
      if (getStoredPassword(demoRole) !== currentPassword) return { ok: false, reason: 'password' };
      setStoredPassword(demoRole, newPassword);
      return { ok: true };
    }

    var users = getRegisteredUsers();
    var user = users.find(function (u) { return u.email === session.email.toLowerCase(); });
    if (!user) return { ok: false, reason: 'not-found' };
    if (user.password !== currentPassword) return { ok: false, reason: 'password' };
    user.password = newPassword;
    localStorage.setItem(REGISTERED_KEY, JSON.stringify(users));
    return { ok: true };
  }

  /* Redirects to login.html when the required role isn't authenticated.
     Returns the session object so callers can bail out early. */
  function requireAuth(role) {
    var session = getSession();
    if (!session || (role && session.role !== role)) {
      window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname.split('/').pop());
      return null;
    }
    return session;
  }

  return {
    getStoredPassword: getStoredPassword,
    setStoredPassword: setStoredPassword,
    registerUser: registerUser,
    findRegisteredUser: findRegisteredUser,
    validateLogin: validateLogin,
    changePassword: changePassword,
    setSession: setSession,
    getSession: getSession,
    clearSession: clearSession,
    requireAuth: requireAuth
  };
})();
