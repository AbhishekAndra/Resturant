/* Stackly — Menu page: render, filter, add to cart */
(function () {
  'use strict';

  var CATEGORIES = [
    { id: 'starters', label: 'Starters' },
    { id: 'mains', label: 'Main Course' },
    { id: 'breads', label: 'Breads & Rice' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'drinks', label: 'Beverages' }
  ];

  var container = document.getElementById('menu-sections');
  var qtyState = {}; // per-item pending quantity, before "Add"

  function getAvailability() {
    try { return JSON.parse(localStorage.getItem('src_menu_availability') || '{}'); }
    catch (err) { return {}; }
  }

  function dishCard(item) {
    var qty = qtyState[item.id] || 1;
    var available = getAvailability()[item.id] !== false;
    return (
      '<article class="dish-card" data-veg="' + item.veg + '" data-category="' + item.category + '">' +
        '<div class="dish-media">' +
          (item.veg ? '<span class="badge">🟢 Veg</span>' : '<span class="badge" style="background:#e8542e;color:#fff">🔴 Non-Veg</span>') +
          '<img src="images/dishes/' + item.id + '.webp" alt="' + item.name + '" width="400" height="400" loading="lazy">' +
        '</div>' +
        '<div class="dish-body">' +
          '<h3>' + item.name + (available ? '' : ' <span class="badge badge-outline" style="font-size:0.65rem">Sold Out</span>') + '</h3>' +
          '<p>' + item.desc + '</p>' +
          '<div class="rating" aria-label="' + item.rating + ' out of 5">' + '★'.repeat(Math.round(item.rating)) + '<span style="color:var(--color-border)">' + '★'.repeat(5 - Math.round(item.rating)) + '</span></div>' +
          '<div class="dish-foot">' +
            '<span class="dish-price">' + formatINR(item.price) + '</span>' +
            '<div class="qty-stepper">' +
              '<button type="button" data-step="-1" data-id="' + item.id + '" aria-label="Decrease quantity" ' + (available ? '' : 'disabled') + '>−</button>' +
              '<span data-qty-display="' + item.id + '">' + qty + '</span>' +
              '<button type="button" data-step="1" data-id="' + item.id + '" aria-label="Increase quantity" ' + (available ? '' : 'disabled') + '>+</button>' +
            '</div>' +
          '</div>' +
          '<button class="btn btn-primary btn-sm btn-block" data-add-to-cart="' + item.id + '" ' + (available ? '' : 'disabled') + '>' + (available ? 'Add to Cart' : 'Sold Out') + '</button>' +
        '</div>' +
      '</article>'
    );
  }

  function render() {
    container.innerHTML = CATEGORIES.map(function (cat) {
      var items = MENU_ITEMS.filter(function (m) { return m.category === cat.id; });
      return (
        '<div class="menu-category" id="' + cat.id + '" data-category-section="' + cat.id + '">' +
          '<h2>' + cat.label + '</h2>' +
          '<div class="dish-grid">' + items.map(dishCard).join('') + '</div>' +
        '</div>'
      );
    }).join('');
  }

  function applyFilters() {
    var activeCategory = document.querySelector('.filter-chip.is-active').getAttribute('data-filter');
    var vegOnly = document.getElementById('veg-only').checked;
    var anyVisible = {};

    document.querySelectorAll('.menu-category').forEach(function (section) {
      var sectionCategory = section.getAttribute('data-category-section');
      var sectionMatches = activeCategory === 'all' || activeCategory === sectionCategory;
      var visibleCount = 0;

      section.querySelectorAll('.dish-card').forEach(function (card) {
        var vegMatches = !vegOnly || card.getAttribute('data-veg') === 'true';
        var visible = sectionMatches && vegMatches;
        card.style.display = visible ? '' : 'none';
        if (visible) visibleCount++;
      });

      section.style.display = visibleCount > 0 ? '' : 'none';
      anyVisible[sectionCategory] = visibleCount > 0;
    });

    var noResults = document.getElementById('menu-no-results');
    var hasAny = Object.keys(anyVisible).some(function (k) { return anyVisible[k]; });
    if (!hasAny) {
      if (!noResults) {
        noResults = document.createElement('p');
        noResults.id = 'menu-no-results';
        noResults.className = 'menu-empty';
        noResults.textContent = 'No dishes match this filter yet — try a different category.';
        container.appendChild(noResults);
      }
    } else if (noResults) {
      noResults.remove();
    }
  }

  render();
  applyFilters();

  document.querySelectorAll('.filter-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.filter-chip').forEach(function (c) {
        c.classList.remove('is-active');
        c.setAttribute('aria-selected', 'false');
      });
      chip.classList.add('is-active');
      chip.setAttribute('aria-selected', 'true');
      applyFilters();
    });
  });
  document.getElementById('veg-only').addEventListener('change', applyFilters);

  container.addEventListener('click', function (e) {
    var stepBtn = e.target.closest('[data-step]');
    if (stepBtn) {
      var id = stepBtn.getAttribute('data-id');
      var current = qtyState[id] || 1;
      var next = Math.max(1, Math.min(20, current + Number(stepBtn.getAttribute('data-step'))));
      qtyState[id] = next;
      document.querySelector('[data-qty-display="' + id + '"]').textContent = next;
      return;
    }
    var addBtn = e.target.closest('[data-add-to-cart]');
    if (addBtn) {
      var itemId = addBtn.getAttribute('data-add-to-cart');
      var qty = qtyState[itemId] || 1;
      CartAPI.addToCart(itemId, qty);
      showToast(qty + ' item' + (qty > 1 ? 's' : '') + ' added to cart');
      qtyState[itemId] = 1;
      document.querySelector('[data-qty-display="' + itemId + '"]').textContent = 1;
    }
  });

  // If arriving via a #category anchor, activate the matching filter chip.
  if (window.location.hash) {
    var targetCat = window.location.hash.replace('#', '');
    var matchingChip = document.querySelector('.filter-chip[data-filter="' + targetCat + '"]');
    if (matchingChip) matchingChip.click();
  }

  // If arriving with ?search=, filter cards by name/description match.
  var searchParam = new URLSearchParams(window.location.search).get('search');
  if (searchParam) {
    var query = searchParam.trim().toLowerCase();
    document.querySelectorAll('.dish-card').forEach(function (card) {
      var text = card.textContent.toLowerCase();
      if (!text.includes(query)) card.style.display = 'none';
    });
  }
})();
