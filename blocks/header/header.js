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
  nav.setAttribute('aria-expanded', 'false');

  // The fetched fragment is authoring content (a flat <div>: brand <p>, a
  // <ul> of primary links, then trailing <p> tool links) rather than
  // pre-classed markup — DA's authoring round-trip does not preserve
  // custom-class wrapper divs, so structure is rebuilt here by content
  // shape instead of by class name.
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const children = [...(temp.firstElementChild || temp).children];

  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const sections = document.createElement('div');
  sections.className = 'nav-sections';
  const tools = document.createElement('div');
  tools.className = 'nav-tools';

  let sawList = false;
  children.forEach((child) => {
    if (child.tagName === 'UL') {
      sawList = true;
      sections.append(child);
    } else if (sawList) {
      tools.append(child);
    } else {
      brand.append(child);
    }
  });

  // Authoring round-trips (DA) don't preserve custom classes on <a>/<div>
  // (only recognized block-name classes and "icon icon-x" spans survive),
  // so the region/sign-in styling hooks are assigned by position instead.
  const toolLinks = [...tools.querySelectorAll('a')];
  if (toolLinks[0]) toolLinks[0].classList.add('nav-region');
  if (toolLinks[1]) toolLinks[1].classList.add('nav-signin');

  nav.append(brand, sections, tools);

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
