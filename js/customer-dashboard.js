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

    var navMetaOrders = document.getElementById('nav-meta-orders');
    navMetaOrders.textContent = orders.length ? orders.length + (orders.length === 1 ? ' order placed' : ' orders placed') : 'View your order history';

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

  /* ---------- Favorite dishes ---------- */
  function renderFavorites() {
    var orders = loadOrders();
    var counts = {};
    orders.forEach(function (order) {
      order.items.forEach(function (item) {
        if (!counts[item.id]) counts[item.id] = { id: item.id, name: item.name, emoji: item.emoji, qty: 0 };
        counts[item.id].qty += item.qty;
      });
    });
    var favorites = Object.keys(counts).map(function (id) { return counts[id]; })
      .sort(function (a, b) { return b.qty - a.qty; })
      .slice(0, 6);

    var grid = document.getElementById('cd-favorites-grid');
    var empty = document.getElementById('cd-favorites-empty');
    var navMetaFavorites = document.getElementById('nav-meta-favorites');
    if (favorites.length === 0) {
      grid.innerHTML = '';
      empty.hidden = false;
      navMetaFavorites.textContent = 'Your most-ordered picks';
      return;
    }
    empty.hidden = true;
    navMetaFavorites.textContent = favorites.length + (favorites.length === 1 ? ' dish tracked' : ' dishes tracked');
    grid.innerHTML = favorites.map(function (f) {
      return (
        '<div class="favorite-card">' +
          '<div class="favorite-emoji">' + f.emoji + '</div>' +
          '<div class="favorite-name">' + f.name + '</div>' +
          '<div class="favorite-count">Ordered ' + f.qty + '×</div>' +
        '</div>'
      );
    }).join('');
  }
  renderFavorites();

  /* ---------- Loyalty points ---------- */
  var LOYALTY_TIERS = [
    { name: 'Bronze', min: 0 },
    { name: 'Silver', min: 500 },
    { name: 'Gold', min: 1500 }
  ];

  function renderLoyalty() {
    var orders = loadOrders();
    var totalSpent = orders.reduce(function (s, o) { return s + o.total; }, 0);
    var points = Math.floor(totalSpent / 10);

    var tierIndex = 0;
    for (var i = 0; i < LOYALTY_TIERS.length; i++) {
      if (points >= LOYALTY_TIERS[i].min) tierIndex = i;
    }
    var tier = LOYALTY_TIERS[tierIndex];
    var nextTier = LOYALTY_TIERS[tierIndex + 1];

    document.getElementById('cd-loyalty-points').textContent = points + ' pts';
    document.getElementById('cd-loyalty-tier').textContent = tier.name;
    document.getElementById('nav-meta-loyalty').textContent = points + ' pts · ' + tier.name + ' tier';

    var fill = document.getElementById('cd-loyalty-progress-fill');
    var nextNote = document.getElementById('cd-loyalty-next');
    if (nextTier) {
      var span = nextTier.min - tier.min;
      var progress = Math.min(100, Math.round(((points - tier.min) / span) * 100));
      fill.style.width = progress + '%';
      nextNote.textContent = (nextTier.min - points) + ' more points to reach ' + nextTier.name + '.';
    } else {
      fill.style.width = '100%';
      nextNote.textContent = 'You\'ve reached the highest tier — thank you for being a loyal customer!';
    }
  }
  renderLoyalty();

  /* ---------- Saved addresses ---------- */
  var ADDRESSES_KEY = 'src_addresses';

  function loadAllAddresses() {
    try { return JSON.parse(localStorage.getItem(ADDRESSES_KEY) || '[]'); }
    catch (err) { return []; }
  }
  function loadAddresses() {
    return loadAllAddresses().filter(function (a) { return a.email === session.email; });
  }
  function saveAllAddresses(all) {
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(all));
  }

  function renderAddresses() {
    var addresses = loadAddresses();
    var list = document.getElementById('cd-addresses-list');
    var empty = document.getElementById('cd-addresses-empty');
    var navMetaAddresses = document.getElementById('nav-meta-addresses');
    if (addresses.length === 0) {
      list.innerHTML = '';
      empty.hidden = false;
      navMetaAddresses.textContent = 'For faster checkout';
    } else {
      empty.hidden = true;
      navMetaAddresses.textContent = addresses.length + (addresses.length === 1 ? ' address saved' : ' addresses saved');
      list.innerHTML = addresses.map(function (a) {
        return (
          '<div class="address-card">' +
            '<div>' +
              '<strong>' + a.label + '</strong>' +
              '<p class="field-hint" style="margin-top:0.3rem">' + a.address + ', ' + a.city + ' — ' + a.pincode + '</p>' +
            '</div>' +
            '<button type="button" class="btn btn-outline btn-sm" data-remove-address="' + a.id + '">Remove</button>' +
          '</div>'
        );
      }).join('');

      list.querySelectorAll('[data-remove-address]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var all = loadAllAddresses().filter(function (a) { return a.id !== btn.getAttribute('data-remove-address'); });
          saveAllAddresses(all);
          renderAddresses();
          showToast('Address removed');
        });
      });
    }
  }
  renderAddresses();

  var addrForm = document.getElementById('address-form');
  addrForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var fields = [
      { id: 'addr-label', err: 'err-addr-label', message: 'Please enter a label for this address.' },
      { id: 'addr-line', err: 'err-addr-line', message: 'Please enter the address.' },
      { id: 'addr-city', err: 'err-addr-city', message: 'Please enter a city.' },
      { id: 'addr-pincode', err: 'err-addr-pincode', message: 'Please enter a valid 6-digit pincode.', validate: function (v) { return /^\d{6}$/.test(v.trim()); } }
    ];
    var valid = true;
    var values = {};
    fields.forEach(function (f) {
      var el = document.getElementById(f.id);
      var errEl = document.getElementById(f.err);
      var v = el.value.trim();
      var ok = f.validate ? f.validate(v) : v.length > 0;
      errEl.textContent = ok ? '' : f.message;
      if (!ok) valid = false;
      values[f.id] = v;
    });
    if (!valid) return;

    var all = loadAllAddresses();
    all.push({
      id: 'addr' + Date.now(),
      email: session.email,
      label: values['addr-label'],
      address: values['addr-line'],
      city: values['addr-city'],
      pincode: values['addr-pincode']
    });
    saveAllAddresses(all);
    renderAddresses();
    addrForm.reset();
    showToast('Address saved');
  });

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
