/* =====================================================
   HOME.JS — Home page specific interactions
   ===================================================== */

// ── Testimonial Slider ──
(function initSlider() {
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsContainer = document.getElementById('sliderDots');

  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const totalCards = cards.length;
  let current = 0;
  let cardsVisible = window.innerWidth < 640 ? 1 : 2;

  // Build dots
  const maxIndex = totalCards - cardsVisible;
  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement('div');
    dot.className = 'slider-dot-item' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.slider-dot-item').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function getCardWidth() {
    if (cards.length === 0) return 0;
    const cardEl = cards[0];
    const style = getComputedStyle(cardEl);
    return cardEl.offsetWidth + parseInt(style.marginRight || 24);
  }

  function goTo(index) {
    const maxIdx = totalCards - cardsVisible;
    current = Math.max(0, Math.min(index, maxIdx));
    track.style.transform = `translateX(-${current * getCardWidth()}px)`;
    updateDots();
  }

  prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-advance
  let autoInterval = setInterval(() => goTo(current + 1 > totalCards - cardsVisible ? 0 : current + 1), 5000);

  track.addEventListener('mouseenter', () => clearInterval(autoInterval));
  track.addEventListener('mouseleave', () => {
    autoInterval = setInterval(() => goTo(current + 1 > totalCards - cardsVisible ? 0 : current + 1), 5000);
  });

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  window.addEventListener('resize', () => {
    cardsVisible = window.innerWidth < 640 ? 1 : 2;
    goTo(0);
  });
})();

// ── Hero Parallax (subtle) ──
(function initParallax() {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroImg.style.transform = `scale(1) translateY(${scrollY * 0.06}px)`;
    }
  }, { passive: true });
})();
