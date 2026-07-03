/* Stackly — About page: spice-level preference slider */
(function () {
  'use strict';

  var slider = document.getElementById('spice-slider');
  if (!slider) return;

  var emoji = document.getElementById('spice-emoji');
  var result = document.getElementById('spice-result');
  var saveBtn = document.getElementById('spice-save');
  var STORAGE_KEY = 'src_spice_preference';

  var LEVELS = [
    { label: 'Mild', emoji: '🌶️', desc: 'Mild — gentle warmth, all flavor with barely any heat.' },
    { label: 'Medium', emoji: '🌶️🌶️', desc: "Medium — a warm, balanced kick that doesn't overpower the spices." },
    { label: 'Hot', emoji: '🌶️🌶️🌶️', desc: 'Hot — a proper fiery kick for those who love real heat.' },
    { label: 'Extra Hot', emoji: '🌶️🌶️🌶️🌶️', desc: "Extra Hot — for true chili lovers. You've been warned!" }
  ];

  function render() {
    var i = Number(slider.value) - 1;
    var level = LEVELS[i];
    var fillPct = (i / (LEVELS.length - 1)) * 100;
    slider.style.setProperty('--spice-value', fillPct + '%');
    emoji.textContent = level.emoji;
    result.textContent = level.desc;
  }

  slider.addEventListener('input', render);

  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    var savedIndex = LEVELS.findIndex(function (l) { return l.label === saved; });
    if (savedIndex !== -1) slider.value = String(savedIndex + 1);
  }
  render();

  saveBtn.addEventListener('click', function () {
    var level = LEVELS[Number(slider.value) - 1];
    localStorage.setItem(STORAGE_KEY, level.label);
    if (window.showToast) showToast('Spice preference saved: ' + level.label + '!');
  });
})();
