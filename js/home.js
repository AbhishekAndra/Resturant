/* Stackly — Homepage: featured dishes render */
(function () {
  'use strict';

  var dishGrid = document.getElementById('featured-dish-grid');
  if (dishGrid) {
    var featured = MENU_ITEMS.filter(function (item) { return item.popular; }).slice(0, 6);
    dishGrid.innerHTML = featured.map(function (item) {
      return (
        '<article class="dish-card">' +
          '<div class="dish-media">' +
            (item.veg ? '<span class="badge">🟢 Veg</span>' : '<span class="badge" style="background:#e8542e;color:#fff">🔴 Non-Veg</span>') +
            '<img src="images/dishes/' + item.id + '.webp" alt="' + item.name + '" width="400" height="400" loading="lazy">' +
          '</div>' +
          '<div class="dish-body">' +
            '<h3>' + item.name + '</h3>' +
            '<p>' + item.desc + '</p>' +
            '<div class="dish-foot">' +
              '<span class="dish-price">' + formatINR(item.price) + '</span>' +
              '<button class="btn btn-primary btn-sm" data-add-to-cart="' + item.id + '">Add</button>' +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    dishGrid.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-add-to-cart]');
      if (!btn) return;
      CartAPI.addToCart(btn.getAttribute('data-add-to-cart'), 1);
      showToast('Added to cart');
    });
  }
})();
