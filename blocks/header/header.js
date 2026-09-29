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
  const utility = document.createElement('div');
  utility.className = 'nav-utility';

  let sawList = false;
  children.forEach((child) => {
    if (child.tagName === 'UL') {
      sawList = true;
      sections.append(child);
    } else if (sawList) {
      utility.append(child);
    } else {
      brand.append(child);
    }
  });

  // Authoring round-trips (DA) don't preserve custom classes on <a>/<div>
  // (only recognized block-name classes and "icon icon-x" spans survive),
  // so the region/sign-in styling hooks are assigned by position instead.
  const utilityLinks = [...utility.querySelectorAll('a')];
  if (utilityLinks[0]) utilityLinks[0].classList.add('nav-signin');
  if (utilityLinks[1]) utilityLinks[1].classList.add('nav-region');

  sections.querySelectorAll('a').forEach((a) => {
    const linkPath = new URL(a.href, window.location.href).pathname;
    const current = window.location.pathname;
    const isActive = linkPath === '/' ? current === '/' : current.startsWith(linkPath);
    if (isActive) a.setAttribute('aria-current', 'page');
  });

  const search = document.createElement('div');
  search.className = 'nav-search';
  search.innerHTML = '<span class="icon icon-search"></span><input type="search" placeholder="Search" aria-label="Search">';

  const utilityBar = document.createElement('div');
  utilityBar.className = 'nav-utility-bar';
  utilityBar.append(utility);

  const mainBar = document.createElement('div');
  mainBar.className = 'nav-main-bar';
  mainBar.append(brand, sections, search);

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');

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
  mainBar.prepend(navToggle);

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && nav.getAttribute('aria-expanded') === 'true') {
      setMenuExpanded(nav, navToggle, false);
    }
  });

  nav.append(utilityBar, mainBar);

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  block.append(wrapper);
  await decorateIcons(block);

  // shrink the header on scroll (reference collapses 194px -> 114px at
  // desktop): toggle a class past a small threshold and let CSS animate it.
  // Hysteresis (different enter/exit thresholds) plus rAF-throttling keeps
  // the class from flapping when scroll position hovers near one number,
  // which was re-triggering the height transition and causing visible shake.
  const headerEl = block.closest('header') || document.querySelector('header');
  if (headerEl) {
    let ticking = false;
    const updateScrolled = () => {
      const threshold = headerEl.classList.contains('nav-scrolled') ? 24 : 48;
      headerEl.classList.toggle('nav-scrolled', window.scrollY > threshold);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateScrolled);
      }
    };
    updateScrolled();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // decorateIcons() defaults every icon to alt="" (right for decorative
  // icons, wrong for the logo, which is the only content inside its link)
  const logo = brand.querySelector('img[data-icon-name^="wknd-logo"]');
  if (logo) logo.alt = 'WKND';
}
