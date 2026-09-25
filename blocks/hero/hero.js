/*
 * Authoring shape: one row per slide. A single-row hero renders as a static
 * banner (used on Adventures/Magazine/FAQs); 2+ rows render as a carousel
 * (used on Home and adventure detail pages) — see docs/component-registry.md.
 */

function goToSlide(block, index) {
  const slides = [...block.querySelectorAll('.hero-slide')];
  const dots = [...block.querySelectorAll('.hero-dot')];
  slides.forEach((slide, i) => slide.toggleAttribute('data-active', i === index));
  dots.forEach((dot, i) => dot.setAttribute('aria-current', i === index ? 'true' : 'false'));
  block.dataset.activeSlide = index;
}

export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => row.classList.add('hero-slide'));

  if (rows.length <= 1) {
    block.classList.add('hero-static');
    if (rows[0]) rows[0].setAttribute('data-active', '');
    return;
  }

  block.classList.add('hero-carousel');
  block.dataset.activeSlide = 0;
  rows[0].setAttribute('data-active', '');

  const controls = document.createElement('div');
  controls.className = 'hero-controls';

  const prev = document.createElement('button');
  prev.className = 'hero-arrow hero-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  prev.innerHTML = '<span class="icon icon-chevron-left"></span>';

  const next = document.createElement('button');
  next.className = 'hero-arrow hero-next';
  next.setAttribute('aria-label', 'Next slide');
  next.innerHTML = '<span class="icon icon-chevron-right"></span>';

  const dots = document.createElement('div');
  dots.className = 'hero-dots';
  rows.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => goToSlide(block, i));
    dots.append(dot);
  });

  prev.addEventListener('click', () => {
    const current = Number(block.dataset.activeSlide);
    goToSlide(block, (current - 1 + rows.length) % rows.length);
  });
  next.addEventListener('click', () => {
    const current = Number(block.dataset.activeSlide);
    goToSlide(block, (current + 1) % rows.length);
  });

  controls.append(prev, dots, next);
  block.append(controls);

  import('../../scripts/aem.js').then(({ decorateIcons }) => decorateIcons(controls));
}
