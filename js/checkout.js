/* Stackly — Checkout: render summary, validate, place order */
(function () {
  'use strict';

  var ORDERS_KEY = 'src_orders';
  var emptyState = document.getElementById('checkout-empty');
  var form = document.getElementById('checkout-form');
  var items = CartAPI.getCartDetails();

  if (items.length === 0) {
    emptyState.hidden = false;
    form.hidden = true;
    return;
  }
  emptyState.hidden = true;
  form.hidden = false;

  function renderSummary() {
    items = CartAPI.getCartDetails();
    var totals = CartAPI.getTotals();
    document.getElementById('checkout-item-list').innerHTML = items.map(function (item) {
      return '<li><span class="ci-name">' + item.emoji + ' ' + item.name + '</span><span class="ci-qty">x' + item.qty + '</span><span>' + formatINR(item.lineTotal) + '</span></li>';
    }).join('');
    document.getElementById('co-subtotal').textContent = formatINR(totals.subtotal);
    document.getElementById('co-tax').textContent = formatINR(totals.tax);
    document.getElementById('co-delivery').textContent = totals.deliveryFee === 0 ? 'Free' : formatINR(totals.deliveryFee);
    document.getElementById('co-total').textContent = formatINR(totals.total);
  }
  renderSummary();

  // Pre-fill name/phone if a session exists.
  var session = Auth.getSession();
  if (session) {
    document.getElementById('co-name').value = session.name || '';
  }

  var fieldConfig = [
    { id: 'co-name', err: 'err-co-name', validate: function (v) { return v.trim().length > 0; }, message: 'Please enter your full name.' },
    { id: 'co-phone', err: 'err-co-phone', validate: function (v) { return /^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/\s/g, '')); }, message: 'Please enter a valid 10-digit mobile number.' },
    { id: 'co-address', err: 'err-co-address', validate: function (v) { return v.trim().length > 4; }, message: 'Please enter your full delivery address.' },
    { id: 'co-city', err: 'err-co-city', validate: function (v) { return v.trim().length > 0; }, message: 'Please enter your city.' },
    { id: 'co-pincode', err: 'err-co-pincode', validate: function (v) { return /^\d{6}$/.test(v.trim()); }, message: 'Please enter a valid 6-digit pincode.' }
  ];

  function validateField(cfg) {
    var el = document.getElementById(cfg.id);
    var errEl = document.getElementById(cfg.err);
    var valid = cfg.validate(el.value);
    errEl.textContent = valid ? '' : cfg.message;
    el.setAttribute('aria-invalid', valid ? 'false' : 'true');
    return valid;
  }

  fieldConfig.forEach(function (cfg) {
    document.getElementById(cfg.id).addEventListener('blur', function () { validateField(cfg); });
  });

  function generateOrderId() {
    return 'STK' + Math.floor(100000 + Math.random() * 900000);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var allValid = fieldConfig.map(validateField).every(Boolean);
    if (!allValid) {
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      showToast('Please fix the highlighted fields');
      return;
    }

    var totals = CartAPI.getTotals();
    var order = {
      orderId: generateOrderId(),
      customerEmail: session ? session.email : 'guest',
      items: items,
      subtotal: totals.subtotal,
      tax: totals.tax,
      deliveryFee: totals.deliveryFee,
      total: totals.total,
      address: {
        fullName: document.getElementById('co-name').value.trim(),
        phone: document.getElementById('co-phone').value.trim(),
        address: document.getElementById('co-address').value.trim(),
        city: document.getElementById('co-city').value.trim(),
        pincode: document.getElementById('co-pincode').value.trim(),
        notes: document.getElementById('co-notes').value.trim()
      },
      payment: form.querySelector('input[name="payment"]:checked').value,
      placedAt: new Date().toISOString(),
      status: 'pending'
    };

    var orders = [];
    try { orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); } catch (err) { orders = []; }
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    CartAPI.clearCart();
    window.location.href = 'order-confirmation.html?order=' + encodeURIComponent(order.orderId);
  });
})();
