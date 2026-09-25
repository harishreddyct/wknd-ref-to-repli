/*
 * Authoring shape: one row per crumb — a cell containing either a link
 * (parent pages) or plain text (current page). Rows, not a native <ol>,
 * because the DA authoring round-trip only preserves a block's wrapper
 * class when its content is div-row shaped (matching the table-block
 * convention) — a bare <ol>/<li> list gets unwrapped and the class
 * discarded. See docs/component-registry.md.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const ol = document.createElement('ol');
  rows.forEach((row, i) => {
    const li = document.createElement('li');
    const isLast = i === rows.length - 1;
    const link = row.querySelector('a');
    if (!isLast && link) {
      // decorateButtons() runs earlier and treats any lone-child link as a
      // CTA button — undo that here, a breadcrumb crumb is never a button.
      link.classList.remove('button', 'primary', 'secondary');
      li.append(link);
    } else {
      li.textContent = row.textContent.trim();
    }
    if (isLast) li.setAttribute('aria-current', 'page');
    ol.append(li);
  });
  block.textContent = '';
  block.append(ol);
}
