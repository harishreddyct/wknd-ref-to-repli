/*
 * Authoring shape: one row with [author name] [role] cells — see
 * blocks/breadcrumbs/breadcrumbs.js for why this can't be a plain <p>
 * with a custom class.
 */
import { decorateIcons } from '../../scripts/aem.js';

export default async function decorate(block) {
  const [name, role] = [...block.children[0].children].map((c) => c.textContent.trim());
  block.textContent = '';
  const p = document.createElement('p');
  p.innerHTML = `<span class="icon icon-social"></span>By ${name} — ${role}`;
  block.append(p);
  await decorateIcons(block);
}
