/* Stackly — Customer dashboard: orders, account, password */
(function () {
  'use strict';

  var session = Auth.getSession();
  if (!session) {
    window.location.href = 'login.html?redirect=customer-dashboard.html';
    return;
  }
  if (session.role === 'admin') {
    window.location.href = 'admin-dashboard.html';
    return;
  }

  var DELIVERY_MINUTES = 35;
  document.getElementById('cd-first-name').textContent = session.name.split(' ')[0];
  document.getElementById('cd-acc-name').textContent = session.name;
  document.getElementById('cd-acc-email').textContent = session.email;
  document.getElementById('cd-acc-role').textContent = 'Customer';

  /* ---------- Sidebar tab switching ---------- */
  document.querySelectorAll('[data-panel-btn]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-panel-btn]').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var target = btn.getAttribute('data-panel-btn');
      document.querySelectorAll('[data-panel]').forEach(function (panel) {
        panel.classList.toggle('is-active', panel.getAttribute('data-panel') === target);
      });
    });
  });

  /* ---------- Orders ---------- */
  function loadOrders() {
    var all = [];
    try { all = JSON.parse(localStorage.getItem('src_orders') || '[]'); } catch (err) { all = []; }
    return all.filter(function (o) { return o.customerEmail === session.email; });
  }

  function liveStatus(order) {
    if (order.status === 'cancelled') return 'cancelled';
    if (order.status === 'delivered') return 'delivered';
    var placedAt = new Date(order.placedAt).getTime();
    var elapsed = Date.now() - placedAt;
    var progress = elapsed / (DELIVERY_MINUTES * 60 * 1000);
    if (progress >= 1) return 'delivered';
    if (progress >= 0.9) return 'out-for-delivery';
    if (progress >= 0.1) return 'preparing';
    return 'pending';
  }

  var STATUS_LABELS = {
    pending: 'Order Placed',
    preparing: 'Preparing',
    'out-for-delivery': 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };

  function trackTimeline(status) {
    var stages = ['pending', 'preparing', 'out-for-delivery', 'delivered'];
    var currentIndex = stages.indexOf(status);
    return '<ol class="status-timeline" style="margin-top:0">' + stages.map(function (s, i) {
      var cls = i < currentIndex ? 'is-complete' : (i === currentIndex ? 'is-current' : '');
      return '<li class="' + cls + '">' + STATUS_LABELS[s] + '</li>';
    }).join('') + '</ol>';
  }

  function renderOrders() {
    var orders = loadOrders();
    var body = document.getElementById('cd-orders-body');
    var emptyNote = document.getElementById('cd-orders-empty');

    document.getElementById('cd-stat-orders').textContent = orders.length;
    document.getElementById('cd-stat-spent').textContent = formatINR(orders.reduce(function (s, o) { return s + o.total; }, 0));
    document.getElementById('cd-stat-progress').textContent = orders.filter(function (o) { return liveStatus(o) !== 'delivered' && liveStatus(o) !== 'cancelled'; }).length;
    document.getElementById('cd-stat-delivered').textContent = orders.filter(function (o) { return liveStatus(o) === 'delivered'; }).length;

    if (orders.length === 0) {
      body.innerHTML = '';
      emptyNote.hidden = false;
      return;
    }
    emptyNote.hidden = true;

    body.innerHTML = orders.map(function (order) {
      var status = liveStatus(order);
      var date = new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      return (
        '<tr>' +
          '<td>' + order.orderId + '</td>' +
          '<td>' + date + '</td>' +
          '<td>' + order.items.reduce(function (s, i) { return s + i.qty; }, 0) + ' items</td>' +
          '<td>' + formatINR(order.total) + '</td>' +
          '<td><span class="status-pill ' + status + '">' + STATUS_LABELS[status] + '</span></td>' +
          '<td>' +
            '<button class="btn btn-ghost btn-sm" data-track="' + order.orderId + '">Track</button> ' +
            '<a class="btn btn-outline btn-sm" href="404.html">Details</a>' +
          '</td>' +
        '</tr>' +
        '<tr class="order-track-row" data-track-row="' + order.orderId + '"><td colspan="6" class="order-track-cell">' + trackTimeline(status) + '</td></tr>'
      );
    }).join('');

    body.querySelectorAll('[data-track]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var row = body.querySelector('[data-track-row="' + btn.getAttribute('data-track') + '"]');
        if (row) row.classList.toggle('is-open');
      });
    });
  }

  renderOrders();
  setInterval(renderOrders, 15000);

  /* ---------- Change password ---------- */
  var pwForm = document.getElementById('password-form');
  var pwStatus = document.getElementById('pw-status');
  pwForm.addEventListener('submit', function (e) {
    e.preventDefault();
    pwStatus.innerHTML = '';
    var current = document.getElementById('pw-current').value;
    var next = document.getElementById('pw-new').value;
    var confirm = document.getElementById('pw-confirm').value;
    var errCurrent = document.getElementById('err-pw-current');
    var errNew = document.getElementById('err-pw-new');
    var errConfirm = document.getElementById('err-pw-confirm');
    errCurrent.textContent = ''; errNew.textContent = ''; errConfirm.textContent = '';

    var valid = true;
    if (!current) { errCurrent.textContent = 'Enter your current password.'; valid = false; }
    if (!next || next.length < 6) { errNew.textContent = 'New password must be at least 6 characters.'; valid = false; }
    if (confirm !== next || !confirm) { errConfirm.textContent = 'Passwords do not match.'; valid = false; }
    if (!valid) return;

    var result = Auth.changePassword(session, current, next);
    if (!result.ok) {
      errCurrent.textContent = 'Current password is incorrect.';
      pwStatus.innerHTML = '<div class="form-banner-error" role="alert">Could not update password — please check your current password.</div>';
      return;
    }

    pwStatus.innerHTML = '<div class="form-success" role="status">Password updated successfully. Use your new password next time you log in.</div>';
    pwForm.reset();
  });
})();
