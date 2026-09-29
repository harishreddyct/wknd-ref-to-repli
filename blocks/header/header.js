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

  const mainBarInner = document.createElement('div');
  mainBarInner.className = 'nav-main-bar-inner';
  mainBarInner.append(brand, sections, search);

  const mainBar = document.createElement('div');
  mainBar.className = 'nav-main-bar';
  mainBar.append(mainBarInner);

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
  mainBarInner.prepend(navToggle);

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

  // shrink the header after the user scrolls past a small threshold
  // (reference collapses 194px -> 114px at desktop). Driven by two
  // IntersectionObservers against fixed sentinels rather than a `scroll`
  // listener: window.scrollY is re-sampled on every scroll event and is
  // not guaranteed monotonic during fast wheel/trackpad input (momentum
  // scrolling can report it moving backward for a tick), which flapped
  // the class and re-triggered the height transition mid-animation -
  // that's what read as "shaking". Two sentinels at different offsets
  // (enter once past 64px, exit once back above 16px) give the toggle
  // hysteresis so scroll position drifting within that band can't flap it.
  const headerEl = block.closest('header') || document.querySelector('header');
  if (headerEl && 'IntersectionObserver' in window) {
    const makeSentinel = (top) => {
      const el = document.createElement('div');
      el.setAttribute('aria-hidden', 'true');
      el.style.cssText = `position:absolute; top:${top}px; left:0; width:1px; height:1px; pointer-events:none;`;
      document.body.prepend(el);
      return el;
    };
    const enterSentinel = makeSentinel(64);
    const exitSentinel = makeSentinel(16);
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) headerEl.classList.add('nav-scrolled');
    }).observe(enterSentinel);
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) headerEl.classList.remove('nav-scrolled');
    }).observe(exitSentinel);
  }

  // decorateIcons() defaults every icon to alt="" (right for decorative
  // icons, wrong for the logo, which is the only content inside its link)
  const logo = brand.querySelector('img[data-icon-name^="wknd-logo"]');
  if (logo) logo.alt = 'WKND';
}
