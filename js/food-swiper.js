/* Stackly — Popular Dishes swiper (menu page): arrow + dot controlled scroll-snap gallery */
(function () {
  'use strict';

  var track = document.getElementById('food-swiper-track');
  if (!track) return;

  var prevBtn = document.querySelector('.swiper-arrow-prev');
  var nextBtn = document.querySelector('.swiper-arrow-next');
  var dotsWrap = document.getElementById('food-swiper-dots');
  var slides = Array.prototype.slice.call(track.children);

  slides.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', function () {
      slides[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    });
    dotsWrap.appendChild(dot);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function step() {
    var slide = slides[0];
    return slide ? slide.getBoundingClientRect().width + 20 : track.clientWidth * 0.8;
  }

  prevBtn.addEventListener('click', function () {
    track.scrollBy({ left: -step(), behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', function () {
    track.scrollBy({ left: step(), behavior: 'smooth' });
  });

  var ticking = false;
  track.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var trackLeft = track.getBoundingClientRect().left;
      var closest = 0;
      var closestDist = Infinity;
      slides.forEach(function (slide, i) {
        var dist = Math.abs(slide.getBoundingClientRect().left - trackLeft);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === closest); });
      ticking = false;
    });
  });
})();
