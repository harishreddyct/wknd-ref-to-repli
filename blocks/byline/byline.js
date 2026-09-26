/*
 * Authoring shape: one row with [author name] [role] cells — see
 * blocks/breadcrumbs/breadcrumbs.js for why this can't be a plain <p>
 * with a custom class.
 */
export default async function decorate(block) {
  const [name, role] = [...block.children[0].children].map((c) => c.textContent.trim());
  block.textContent = '';
  const nameEl = document.createElement('p');
  nameEl.className = 'byline-name';
  nameEl.textContent = name;
  const roleEl = document.createElement('p');
  roleEl.className = 'byline-role';
  roleEl.textContent = role;
  block.append(nameEl, roleEl);
}
