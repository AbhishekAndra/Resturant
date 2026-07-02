/* Stackly — Cart page rendering + quantity/remove interactions */
(function () {
  'use strict';

  var emptyState = document.getElementById('cart-empty');
  var content = document.getElementById('cart-content');
  var list = document.getElementById('cart-item-list');
  var checkoutBtn = document.getElementById('checkout-btn');

  function itemRow(item) {
    return (
      '<li class="cart-item-row" data-row="' + item.id + '">' +
        '<img class="cart-item-media" src="images/dishes/' + item.id + '.webp" alt="" width="56" height="56" loading="lazy">' +
        '<div>' +
          '<div class="cart-item-name">' + item.name + '</div>' +
          '<div class="cart-item-unit">' + formatINR(item.price) + ' each</div>' +
          '<div class="qty-stepper" style="margin-top:0.5rem">' +
            '<button type="button" data-cart-step="-1" data-id="' + item.id + '" aria-label="Decrease quantity of ' + item.name + '">−</button>' +
            '<span>' + item.qty + '</span>' +
            '<button type="button" data-cart-step="1" data-id="' + item.id + '" aria-label="Increase quantity of ' + item.name + '">+</button>' +
          '</div>' +
        '</div>' +
        '<button class="cart-item-remove" type="button" data-remove="' + item.id + '" aria-label="Remove ' + item.name + ' from cart">✕</button>' +
        '<div class="cart-item-total">' + formatINR(item.lineTotal) + '</div>' +
      '</li>'
    );
  }

  function render() {
    var items = CartAPI.getCartDetails();
    var totals = CartAPI.getTotals();

    if (items.length === 0) {
      emptyState.hidden = false;
      content.hidden = true;
      return;
    }
    emptyState.hidden = true;
    content.hidden = false;

    list.innerHTML = items.map(itemRow).join('');

    document.getElementById('sum-subtotal').textContent = formatINR(totals.subtotal);
    document.getElementById('sum-tax').textContent = formatINR(totals.tax);
    document.getElementById('sum-delivery').textContent = totals.deliveryFee === 0 ? 'Free' : formatINR(totals.deliveryFee);
    document.getElementById('sum-total').textContent = formatINR(totals.total);

    var hint = document.getElementById('free-delivery-hint');
    if (totals.deliveryFee > 0) {
      var remaining = totals.freeDeliveryThreshold - totals.subtotal;
      hint.textContent = 'Add ' + formatINR(remaining) + ' more for free delivery!';
    } else {
      hint.textContent = '🎉 You\'ve unlocked free delivery.';
    }
  }

  list.addEventListener('click', function (e) {
    var stepBtn = e.target.closest('[data-cart-step]');
    if (stepBtn) {
      var id = stepBtn.getAttribute('data-id');
      var current = CartAPI.getCartDetails().find(function (i) { return i.id === id; });
      var next = (current ? current.qty : 0) + Number(stepBtn.getAttribute('data-cart-step'));
      CartAPI.setQty(id, next);
      render();
      return;
    }
    var removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) {
      CartAPI.removeFromCart(removeBtn.getAttribute('data-remove'));
      render();
      showToast('Item removed');
    }
  });

  document.getElementById('clear-cart-btn').addEventListener('click', function () {
    CartAPI.clearCart();
    render();
    showToast('Cart cleared');
  });

  render();
})();
