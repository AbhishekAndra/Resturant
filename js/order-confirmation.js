/* Stackly — Order confirmation: details + mock delivery countdown */
(function () {
  'use strict';

  var DELIVERY_MINUTES = 35;
  var params = new URLSearchParams(window.location.search);
  var orderId = params.get('order');

  var orders = [];
  try { orders = JSON.parse(localStorage.getItem('src_orders') || '[]'); } catch (err) { orders = []; }
  var order = orders.find(function (o) { return o.orderId === orderId; });

  if (!order) {
    document.getElementById('oc-missing').hidden = false;
    document.getElementById('oc-content').hidden = true;
    return;
  }
  document.getElementById('oc-missing').hidden = true;
  document.getElementById('oc-content').hidden = false;

  document.getElementById('oc-order-id').textContent = order.orderId;
  var session = Auth.getSession();
  document.getElementById('oc-name-suffix').textContent = session ? ', ' + session.name.split(' ')[0] : '';

  document.getElementById('oc-address-name').textContent = order.address.fullName;
  document.getElementById('oc-address-line').textContent = order.address.address + ', ' + order.address.city + ' – ' + order.address.pincode;
  document.getElementById('oc-address-phone').textContent = 'Phone: ' + order.address.phone;

  document.getElementById('oc-item-list').innerHTML = order.items.map(function (item) {
    return '<li><span class="ci-name">' + item.emoji + ' ' + item.name + '</span><span class="ci-qty">x' + item.qty + '</span><span>' + formatINR(item.lineTotal) + '</span></li>';
  }).join('');
  document.getElementById('oc-subtotal').textContent = formatINR(order.subtotal);
  document.getElementById('oc-tax').textContent = formatINR(order.tax);
  document.getElementById('oc-delivery').textContent = order.deliveryFee === 0 ? 'Free' : formatINR(order.deliveryFee);
  document.getElementById('oc-total').textContent = formatINR(order.total);
  var paymentLabels = { card: 'Credit / Debit Card', upi: 'UPI', cod: 'Cash on Delivery' };
  document.getElementById('oc-payment').textContent = paymentLabels[order.payment] || order.payment;

  var countdownEl = document.getElementById('oc-countdown');
  var countdownLabel = document.getElementById('oc-countdown-label');
  var timelineItems = document.querySelectorAll('#oc-timeline li');
  var placedAt = new Date(order.placedAt).getTime();
  var targetTime = placedAt + DELIVERY_MINUTES * 60 * 1000;

  function stageForProgress(progress) {
    if (progress >= 1) return 'delivered';
    if (progress >= 0.9) return 'out-for-delivery';
    if (progress >= 0.1) return 'preparing';
    return 'pending';
  }

  function tick() {
    var now = Date.now();
    var remainingMs = Math.max(0, targetTime - now);
    var totalMs = DELIVERY_MINUTES * 60 * 1000;
    var progress = Math.min(1, (totalMs - remainingMs) / totalMs);
    var stage = stageForProgress(progress);

    var minutes = Math.floor(remainingMs / 60000);
    var seconds = Math.floor((remainingMs % 60000) / 1000);
    countdownEl.textContent = (remainingMs <= 0) ? 'Delivered' : (String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0'));
    countdownLabel.textContent = remainingMs <= 0 ? 'Your order has arrived — enjoy your meal!' : 'Estimated delivery time remaining';

    var stageOrder = ['pending', 'preparing', 'out-for-delivery', 'delivered'];
    var currentIndex = stageOrder.indexOf(stage);
    timelineItems.forEach(function (li) {
      var stepIndex = stageOrder.indexOf(li.getAttribute('data-step'));
      li.classList.toggle('is-complete', stepIndex < currentIndex);
      li.classList.toggle('is-current', stepIndex === currentIndex);
    });

    if (remainingMs <= 0) clearInterval(intervalId);
  }

  tick();
  var intervalId = setInterval(tick, 1000);
})();
