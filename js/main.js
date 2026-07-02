/* ==========================================================================
   Stackly — Shared site behaviour
   Loader dismissal, navbar (dropdown + mobile overlay), footer year,
   cart badge sync. Included on every page after data.js / cart.js.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Loader: hide once the page is actually interactive ---------- */
  function hideLoader() {
    var loader = document.getElementById('loader');
    if (!loader) return;
    loader.classList.add('loader-hidden');
    document.body.classList.remove('is-loading');
    window.removeEventListener('load', hideLoader);
  }
  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
    // Safety net: never let the loader outlive ~2s even on slow asset loads.
    setTimeout(hideLoader, 2000);
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Active nav link ---------- */
  var currentPage = (document.body.getAttribute('data-page') || '').toLowerCase();
  document.querySelectorAll('.nav-links a[data-page], .mobile-menu-links a[data-page]').forEach(function (link) {
    if (link.getAttribute('data-page') === currentPage) {
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Desktop dropdown ---------- */
  document.querySelectorAll('.nav-dropdown').forEach(function (dropdown) {
    var toggle = dropdown.querySelector('.nav-dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = dropdown.getAttribute('data-open') === 'true';
      closeAllDropdowns();
      dropdown.setAttribute('data-open', String(!isOpen));
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
  });
  function closeAllDropdowns() {
    document.querySelectorAll('.nav-dropdown').forEach(function (d) {
      d.setAttribute('data-open', 'false');
      var t = d.querySelector('.nav-dropdown-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
  document.addEventListener('click', closeAllDropdowns);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  /* ---------- Mobile overlay menu ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');
  var mobileClose = document.querySelector('.mobile-menu-close');

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    var firstLink = mobileMenu.querySelector('a, button');
    if (firstLink) firstLink.focus();
  }
  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      expanded ? closeMobileMenu() : openMobileMenu();
    });
  }
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  document.querySelectorAll('.mobile-menu-links > a').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
  });

  document.querySelectorAll('.mobile-dropdown').forEach(function (dropdown) {
    var toggle = dropdown.querySelector('.mobile-dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      var isOpen = dropdown.getAttribute('data-open') === 'true';
      dropdown.setAttribute('data-open', String(!isOpen));
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---------- Cart badge sync (every page shows the navbar cart icon) ---------- */
  function updateCartBadge() {
    var badgeEls = document.querySelectorAll('[data-cart-count]');
    if (!badgeEls.length) return;
    var count = 0;
    try {
      var cart = JSON.parse(localStorage.getItem('src_cart') || '[]');
      count = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    } catch (err) { count = 0; }
    badgeEls.forEach(function (el) {
      el.textContent = count;
      // Only the circular navbar pill hides itself at zero; inline
      // "Cart (0)" text in the mobile menu should stay visible.
      if (el.classList.contains('nav-cart-count')) {
        el.style.display = count > 0 ? 'flex' : 'none';
      }
    });
  }
  updateCartBadge();
  window.addEventListener('storage', updateCartBadge);
  window.updateCartBadge = updateCartBadge;

  /* ---------- Auth-aware nav actions ---------- */
  function refreshAuthNav() {
    var session = null;
    try { session = JSON.parse(localStorage.getItem('src_session') || 'null'); } catch (err) { session = null; }
    document.querySelectorAll('[data-auth-guest]').forEach(function (el) {
      el.style.display = session ? 'none' : '';
    });
    document.querySelectorAll('[data-auth-user]').forEach(function (el) {
      el.style.display = session ? '' : 'none';
    });
    document.querySelectorAll('[data-auth-name]').forEach(function (el) {
      if (session) el.textContent = session.name;
    });
    document.querySelectorAll('[data-auth-dashboard-link]').forEach(function (el) {
      if (session) el.setAttribute('href', session.role === 'admin' ? 'admin-dashboard.html' : 'customer-dashboard.html');
    });
  }
  refreshAuthNav();
  window.refreshAuthNav = refreshAuthNav;

  /* ---------- Logout ---------- */
  document.querySelectorAll('#logout-btn, #logout-btn-mobile').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (window.Auth) Auth.clearSession();
      refreshAuthNav();
      if (window.showToast) showToast('You have been logged out');
      setTimeout(function () { window.location.href = 'index.html'; }, 600);
    });
  });

  /* ---------- Generic modal dialogs (Privacy / Terms etc.) ---------- */
  document.querySelectorAll('[data-modal-open]').forEach(function (opener) {
    opener.addEventListener('click', function (e) {
      var dialog = document.getElementById(opener.getAttribute('data-modal-open'));
      if (dialog && typeof dialog.showModal === 'function') {
        e.preventDefault();
        dialog.showModal();
      }
    });
  });
  document.querySelectorAll('[data-modal-close]').forEach(function (closer) {
    closer.addEventListener('click', function () {
      var dialog = closer.closest('dialog');
      if (dialog) dialog.close();
    });
  });

  /* ---------- Password visibility toggles ---------- */
  document.querySelectorAll('[data-toggle-password]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = document.getElementById(btn.getAttribute('data-toggle-password'));
      if (!input) return;
      var isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      btn.textContent = isHidden ? 'Hide' : 'Show';
    });
  });

  /* ---------- Toast helper ---------- */
  window.showToast = function (message) {
    var toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2600);
  };
})();
