/* Stackly — Drinks & Desserts page: render curated dish grids, add to cart */
(function () {
  'use strict';

  var JUICE_IDS = ['m53', 'm54', 'm56'];
  var COFFEE_IDS = ['m55', 'm57', 'm58'];
  var DESSERT_IDS = ['m14', 'm15', 'm16', 'm32', 'm35', 'm46'];

  var qtyState = {}; // per-item pending quantity, before "Add"

  function getAvailability() {
    try { return JSON.parse(localStorage.getItem('src_menu_availability') || '{}'); }
    catch (err) { return {}; }
  }

  function dishCard(item) {
    var qty = qtyState[item.id] || 1;
    var available = getAvailability()[item.id] !== false;
    return (
      '<article class="dish-card" data-veg="' + item.veg + '">' +
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

  function renderGrid(gridId, itemIds) {
    var grid = document.getElementById(gridId);
    if (!grid) return;
    var items = itemIds.map(function (id) {
      return MENU_ITEMS.filter(function (m) { return m.id === id; })[0];
    }).filter(Boolean);
    grid.innerHTML = items.map(dishCard).join('');
  }

  renderGrid('juice-grid', JUICE_IDS);
  renderGrid('coffee-grid', COFFEE_IDS);
  renderGrid('dessert-grid', DESSERT_IDS);

  document.querySelectorAll('.drinks-category .dish-grid').forEach(function (grid) {
    grid.addEventListener('click', function (e) {
      var stepBtn = e.target.closest('[data-step]');
      if (stepBtn) {
        var id = stepBtn.getAttribute('data-id');
        var current = qtyState[id] || 1;
        var next = Math.max(1, Math.min(20, current + Number(stepBtn.getAttribute('data-step'))));
        qtyState[id] = next;
        grid.querySelector('[data-qty-display="' + id + '"]').textContent = next;
        return;
      }
      var addBtn = e.target.closest('[data-add-to-cart]');
      if (addBtn) {
        var itemId = addBtn.getAttribute('data-add-to-cart');
        var qty = qtyState[itemId] || 1;
        CartAPI.addToCart(itemId, qty);
        showToast(qty + ' item' + (qty > 1 ? 's' : '') + ' added to cart');
        qtyState[itemId] = 1;
        grid.querySelector('[data-qty-display="' + itemId + '"]').textContent = 1;
      }
    });
  });
})();
