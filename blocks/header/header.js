import { decorateIcons } from '../../scripts/aem.js';

const NAV_PATH = '/nav.plain.html';

function setMenuExpanded(nav, navToggle, expanded) {
  nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  navToggle.setAttribute('aria-label', expanded ? 'Close menu' : 'Open menu');
  document.body.style.overflowY = expanded ? 'hidden' : '';
}

export default async function decorate(block) {
  const resp = await fetch(NAV_PATH);
  const html = await resp.text();
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.innerHTML = html;
  nav.setAttribute('aria-expanded', 'false');

  const brand = nav.querySelector('.nav-brand');
  const sections = nav.querySelector('.nav-sections');
  const tools = nav.querySelector('.nav-tools');
  if (brand) brand.className = 'nav-brand';
  if (sections) sections.className = 'nav-sections';
  if (tools) tools.className = 'nav-tools';

  const navToggle = document.createElement('button');
  navToggle.className = 'nav-hamburger';
  navToggle.setAttribute('aria-controls', 'nav');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open menu');
  navToggle.innerHTML = '<span class="icon icon-menu"></span>';
  navToggle.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    setMenuExpanded(nav, navToggle, !expanded);
  });
  nav.prepend(navToggle);

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && nav.getAttribute('aria-expanded') === 'true') {
      setMenuExpanded(nav, navToggle, false);
    }
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  block.append(wrapper);
  await decorateIcons(block);
}
