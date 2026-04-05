/* =====================================================
   PRODUCTS.JS — Filter, Sort, and interactions
   ===================================================== */

(function initProducts() {
  const grid = document.getElementById('productsGrid');
  const pills = document.querySelectorAll('.filter-pill');
  const sortSelect = document.getElementById('sortSelect');

  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.prod-card'));
  let activeFilter = 'all';

  // ── Filter ──
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.getAttribute('data-filter');
      applyFilterAndSort();
    });
  });

  // ── Sort ──
  sortSelect && sortSelect.addEventListener('change', applyFilterAndSort);

  function applyFilterAndSort() {
    const sortVal = sortSelect ? sortSelect.value : 'popular';

    // Filter
    let visible = cards.filter(card => {
      const cat = card.getAttribute('data-category');
      return activeFilter === 'all' || cat === activeFilter;
    });

    let hidden = cards.filter(c => !visible.includes(c));

    // Sort
    visible.sort((a, b) => {
      if (sortVal === 'price-asc')  return parseInt(a.dataset.price) - parseInt(b.dataset.price);
      if (sortVal === 'price-desc') return parseInt(b.dataset.price) - parseInt(a.dataset.price);
      if (sortVal === 'protein')    return parseInt(b.dataset.protein) - parseInt(a.dataset.protein);
      return parseInt(b.dataset.popular) - parseInt(a.dataset.popular); // default
    });

    // Reorder DOM with animation
    hidden.forEach(c => {
      c.style.opacity = '0';
      c.style.transform = 'scale(0.92)';
      setTimeout(() => c.classList.add('hidden'), 250);
    });

    visible.forEach((c, i) => {
      c.classList.remove('hidden');
      c.style.transitionDelay = `${i * 60}ms`;
      requestAnimationFrame(() => {
        c.style.opacity = '1';
        c.style.transform = 'scale(1) translateY(0)';
      });
      grid.appendChild(c);
    });

    setTimeout(() => {
      visible.forEach(c => { c.style.transitionDelay = ''; });
    }, visible.length * 60 + 350);
  }

  // ── Wishlist heart micro-interaction ──
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const img = card.querySelector('.prod-img-wrap img');
      if (img) img.style.transform = 'scale(1.07)';
    });
    card.addEventListener('mouseleave', () => {
      const img = card.querySelector('.prod-img-wrap img');
      if (img) img.style.transform = 'scale(1)';
    });
  });
})();
