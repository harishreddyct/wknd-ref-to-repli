/*
 * Authoring shape: one row per Q&A — [question] [answer] cells. Rebuilt as a
 * native <details>/<summary> per row so the collapse/expand needs no JS (see
 * the reference's accordion, which uses a scripted aria button+panel; a
 * <details> reproduces the same behavior with zero script). Div-row/div-cell
 * shape is required for the wrapper class to survive the DA authoring
 * round-trip — same constraint as blocks/breadcrumbs/breadcrumbs.js.
 *
 * Questions become <h2> (not the reference's <h3>): the FAQ page's only
 * other heading is the <h1>, so <h2> keeps the heading order gap-free in
 * place, rather than relocating page content to satisfy a heading-order
 * audit.
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [question, answer] = [...row.children];

    const details = document.createElement('details');
    details.className = 'accordion-item';

    const summary = document.createElement('summary');
    summary.className = 'accordion-header';
    const heading = document.createElement('h2');
    heading.className = 'accordion-title';
    heading.textContent = question.textContent.trim();
    summary.append(heading);

    const panel = document.createElement('div');
    panel.className = 'accordion-panel';
    if (answer) panel.append(...answer.childNodes);

    details.append(summary, panel);
    row.replaceWith(details);
  });
}
