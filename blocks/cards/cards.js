/*
 * Authoring shape: one row per card — [image] [title/description/link] and,
 * optionally, a third cell holding a plain-text category used by the
 * adventures-page filter (promoted to data-category, then removed from the
 * visible card). Variants: default (grid), "feature" (single large
 * horizontal card), "locked" (members-only teaser).
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('cards-card');
    const cells = [...row.children];
    cells.forEach((cell, i) => {
      if (cell.querySelector('picture, img')) {
        cell.classList.add('cards-card-image');
      } else if (i === cells.length - 1 && cells.length > 2) {
        row.dataset.category = cell.textContent.trim().toLowerCase();
        cell.remove();
      } else {
        cell.classList.add('cards-card-body');
      }
    });
  });
}
