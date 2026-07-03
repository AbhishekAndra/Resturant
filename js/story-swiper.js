/* Stackly — About page story swiper: single-image slide carousel with autoplay */
(function () {
  'use strict';

  var root = document.getElementById('story-swiper');
  if (!root) return;

  var track = root.querySelector('.story-swiper-track');
  var slides = Array.prototype.slice.call(track.children);
  var prevBtn = root.querySelector('.story-swiper-prev');
  var nextBtn = root.querySelector('.story-swiper-next');
  var dotsWrap = root.querySelector('.story-swiper-dots');
  var index = 0;
  var AUTOPLAY_MS = 4500;
  var timer = null;

  slides.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', function () { goTo(i); restart(); });
    dotsWrap.appendChild(dot);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function render() {
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
    dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === index); });
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function start() {
    stop();
    timer = window.setInterval(next, AUTOPLAY_MS);
  }
  function stop() {
    if (timer) { window.clearInterval(timer); timer = null; }
  }
  function restart() { start(); }

  prevBtn.addEventListener('click', function () { prev(); restart(); });
  nextBtn.addEventListener('click', function () { next(); restart(); });
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);

  render();
  start();
})();
