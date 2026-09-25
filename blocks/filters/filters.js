/*
 * Category filter buttons for the adventures grid. Authoring shape: one
 * row of category names as plain text; the block builds buttons from it.
 * Expects a sibling ".cards" block later in the same section to filter.
 */
function applyFilter(section, category) {
  const cards = section.querySelectorAll('.cards-card');
  cards.forEach((card) => {
    const show = category === 'all' || card.dataset.category === category;
    card.hidden = !show;
  });
}

export default function decorate(block) {
  const categories = block.textContent
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
  block.textContent = '';

  const list = document.createElement('div');
  list.className = 'filters-list';
  list.setAttribute('role', 'group');
  list.setAttribute('aria-label', 'Filter adventures by category');

  ['All', ...categories].forEach((label, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filters-button';
    btn.textContent = label;
    btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    btn.addEventListener('click', () => {
      list.querySelectorAll('.filters-button').forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      applyFilter(block.closest('.section'), label.toLowerCase());
    });
    list.append(btn);
  });

  block.append(list);
}
