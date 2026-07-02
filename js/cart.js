/* ==========================================================================
   Stackly — Cart engine (shared across menu/cart/checkout pages)
   Cart is persisted to localStorage as [{ id, qty }]; item details (name,
   price, emoji) are always resolved live from MENU_ITEMS in data.js.
   ========================================================================== */

var CartAPI = (function () {
  'use strict';

  var CART_KEY = 'src_cart';
  var TAX_RATE = 0.05;
  var FREE_DELIVERY_THRESHOLD = 499;
  var DELIVERY_FEE = 49;

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch (err) { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    if (window.updateCartBadge) window.updateCartBadge();
  }

  function addToCart(id, qty) {
    qty = qty || 1;
    var cart = getCart();
    var existing = cart.find(function (item) { return item.id === id; });
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: id, qty: qty });
    }
    saveCart(cart);
  }

  function removeFromCart(id) {
    var cart = getCart().filter(function (item) { return item.id !== id; });
    saveCart(cart);
  }

  function setQty(id, qty) {
    var cart = getCart();
    if (qty <= 0) {
      cart = cart.filter(function (item) { return item.id !== id; });
    } else {
      var existing = cart.find(function (item) { return item.id === id; });
      if (existing) existing.qty = qty;
    }
    saveCart(cart);
  }

  function clearCart() {
    saveCart([]);
  }

  function getCartDetails() {
    var cart = getCart();
    return cart.map(function (item) {
      var product = MENU_ITEMS.find(function (m) { return m.id === item.id; });
      if (!product) return null;
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        emoji: product.emoji,
        qty: item.qty,
        lineTotal: product.price * item.qty
      };
    }).filter(Boolean);
  }

  function getTotals() {
    var items = getCartDetails();
    var subtotal = items.reduce(function (sum, item) { return sum + item.lineTotal; }, 0);
    var tax = Math.round(subtotal * TAX_RATE);
    var deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    var total = subtotal + tax + deliveryFee;
    return {
      itemCount: items.reduce(function (sum, item) { return sum + item.qty; }, 0),
      subtotal: subtotal,
      tax: tax,
      deliveryFee: deliveryFee,
      total: total,
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD
    };
  }

  return {
    getCart: getCart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    setQty: setQty,
    clearCart: clearCart,
    getCartDetails: getCartDetails,
    getTotals: getTotals
  };
})();

function formatINR(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}
