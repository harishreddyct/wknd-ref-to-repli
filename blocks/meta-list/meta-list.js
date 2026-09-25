/*
 * Authoring shape: one row per fact — [label] [value] cells, not a native
 * <ul>, for the same reason as blocks/breadcrumbs/breadcrumbs.js: a bare
 * list doesn't survive the DA authoring round-trip with its wrapper class
 * intact, only a div-row ("table block") shape does.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const ul = document.createElement('ul');
  rows.forEach((row) => {
    const [label, value] = [...row.children];
    const li = document.createElement('li');
    const strong = document.createElement('strong');
    strong.textContent = label.textContent.trim();
    li.append(strong, document.createTextNode(value.textContent.trim()));
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
