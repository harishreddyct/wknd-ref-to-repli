/*
 * Category filter buttons for the adventures grid. Authoring shape: one
 * row per category, each holding a div cell with its label — not plain
 * comma-separated text, because the DA authoring round-trip only
 * preserves a block's wrapper class when its rows are div-cell shaped
 * (see blocks/breadcrumbs/breadcrumbs.js for the same constraint).
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
  const categories = [...block.children].map((row) => row.textContent.trim()).filter(Boolean);
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
