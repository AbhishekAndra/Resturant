/* Stackly — Admin dashboard: order + menu availability management */
(function () {
  'use strict';

  var session = Auth.getSession();
  if (!session || session.role !== 'admin') {
    window.location.href = 'login.html?redirect=admin-dashboard.html';
    return;
  }

  var AVAILABILITY_KEY = 'src_menu_availability';
  var STATUS_LABELS = {
    pending: 'Order Placed',
    preparing: 'Preparing',
    'out-for-delivery': 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  var STATUS_ORDER = ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];

  function loadOrders() {
    try { return JSON.parse(localStorage.getItem('src_orders') || '[]'); }
    catch (err) { return []; }
  }
  function saveOrders(orders) {
    localStorage.setItem('src_orders', JSON.stringify(orders));
  }

  function loadAvailability() {
    try { return JSON.parse(localStorage.getItem(AVAILABILITY_KEY) || '{}'); }
    catch (err) { return {}; }
  }
  function saveAvailability(map) {
    localStorage.setItem(AVAILABILITY_KEY, JSON.stringify(map));
  }

  /* ---------- Sidebar tabs ---------- */
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

  /* ---------- Overview + Orders ---------- */
  function statusPill(status) {
    return '<span class="status-pill ' + status + '">' + STATUS_LABELS[status] + '</span>';
  }

  function statusSelect(orderId, status) {
    var options = STATUS_ORDER.map(function (s) {
      return '<option value="' + s + '"' + (s === status ? ' selected' : '') + '>' + STATUS_LABELS[s] + '</option>';
    }).join('');
    return '<select class="filter-chip" style="min-height:36px; padding:0.3rem 0.6rem" data-status-select="' + orderId + '">' + options + '</select>';
  }

  function render() {
    var orders = loadOrders();

    document.getElementById('ad-stat-orders').textContent = orders.length;
    document.getElementById('ad-stat-revenue').textContent = formatINR(orders.reduce(function (s, o) { return s + o.total; }, 0));
    document.getElementById('ad-stat-pending').textContent = orders.filter(function (o) { return o.status === 'pending'; }).length;
    document.getElementById('ad-stat-menu').textContent = MENU_ITEMS.length;

    var recentBody = document.getElementById('ad-recent-orders');
    var recentEmpty = document.getElementById('ad-recent-empty');
    var recent = orders.slice(0, 5);
    if (recent.length === 0) {
      recentBody.innerHTML = '';
      recentEmpty.hidden = false;
    } else {
      recentEmpty.hidden = true;
      recentBody.innerHTML = recent.map(function (o) {
        return '<tr><td>' + o.orderId + '</td><td>' + o.address.fullName + '</td><td>' + formatINR(o.total) + '</td><td>' + statusPill(o.status) + '</td></tr>';
      }).join('');
    }

    var body = document.getElementById('ad-orders-body');
    var empty = document.getElementById('ad-orders-empty');
    if (orders.length === 0) {
      body.innerHTML = '';
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    body.innerHTML = orders.map(function (order) {
      var date = new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      return (
        '<tr>' +
          '<td>' + order.orderId + '</td>' +
          '<td>' + order.address.fullName + '<br><span class="field-hint">' + order.customerEmail + '</span></td>' +
          '<td>' + date + '</td>' +
          '<td>' + order.items.reduce(function (s, i) { return s + i.qty; }, 0) + ' items</td>' +
          '<td>' + formatINR(order.total) + '</td>' +
          '<td>' + statusSelect(order.orderId, order.status) + '</td>' +
        '</tr>'
      );
    }).join('');

    body.querySelectorAll('[data-status-select]').forEach(function (select) {
      select.addEventListener('change', function () {
        var orders = loadOrders();
        var order = orders.find(function (o) { return o.orderId === select.getAttribute('data-status-select'); });
        if (order) {
          order.status = select.value;
          saveOrders(orders);
          showToast('Order ' + order.orderId + ' marked as ' + STATUS_LABELS[order.status]);
          render();
        }
      });
    });
  }

  render();

  /* ---------- Menu management ---------- */
  function renderMenu() {
    var availability = loadAvailability();
    var body = document.getElementById('ad-menu-body');
    body.innerHTML = MENU_ITEMS.map(function (item) {
      var available = availability[item.id] !== false;
      return (
        '<tr>' +
          '<td>' + item.emoji + ' ' + item.name + '</td>' +
          '<td style="text-transform:capitalize">' + item.category + '</td>' +
          '<td>' + formatINR(item.price) + '</td>' +
          '<td><span class="status-pill ' + (available ? 'delivered' : 'cancelled') + '">' + (available ? 'Available' : 'Sold Out') + '</span></td>' +
          '<td><button class="btn btn-outline btn-sm" data-toggle-availability="' + item.id + '">' + (available ? 'Mark Sold Out' : 'Mark Available') + '</button></td>' +
        '</tr>'
      );
    }).join('');

    body.querySelectorAll('[data-toggle-availability]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-toggle-availability');
        var availability = loadAvailability();
        availability[id] = availability[id] === false ? true : false;
        saveAvailability(availability);
        renderMenu();
        showToast('Menu availability updated');
      });
    });
  }
  renderMenu();
})();
