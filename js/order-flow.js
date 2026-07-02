/* Stackly — Serving option + Find Location flow
   Persists the chosen serving option (pickup/delivery) to localStorage and
   fills the location card/map from RESTAURANT_INFO (data.js). */
(function () {
  'use strict';

  var STORAGE_KEY = 'stackly_serving_option';

  function getServingOptionFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var type = params.get('type');
    return type === 'pickup' || type === 'delivery' ? type : null;
  }

  /* ---------- find-location.html ---------- */
  var locationPage = document.getElementById('location-card');
  if (locationPage) {
    var option = getServingOptionFromUrl() || localStorage.getItem(STORAGE_KEY) || 'delivery';
    localStorage.setItem(STORAGE_KEY, option);

    document.querySelectorAll('.location-tab').forEach(function (tab) {
      var isActive = tab.getAttribute('data-serving-option') === option;
      tab.classList.toggle('is-active', isActive);
      if (isActive) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
    });

    /* The map iframe's src is set statically in the HTML (not here) so it
       loads immediately regardless of script execution — matches contact.html. */
    var addressEl = document.getElementById('location-address');
    var phoneEl = document.getElementById('location-phone');
    var hoursEl = document.getElementById('location-hours');
    if (addressEl) addressEl.textContent = RESTAURANT_INFO.address;
    if (phoneEl) { phoneEl.textContent = RESTAURANT_INFO.phone; phoneEl.href = 'tel:' + RESTAURANT_INFO.phoneHref; }
    if (hoursEl) hoursEl.textContent = RESTAURANT_INFO.hours;

    var continueBtn = document.getElementById('location-continue');
    if (continueBtn) {
      continueBtn.addEventListener('click', function () {
        window.location.href = 'menu.html?servingOption=' + option;
      });
    }
  }

  /* ---------- serving-options.html ---------- */
  document.querySelectorAll('[data-serving-option-link]').forEach(function (link) {
    link.addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, link.getAttribute('data-serving-option-link'));
    });
  });
})();
