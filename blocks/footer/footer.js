import { decorateIcons } from '../../scripts/aem.js';

const FOOTER_PATH = '/footer.plain.html';

export default async function decorate(block) {
  const resp = await fetch(FOOTER_PATH);
  const html = await resp.text();

  // Same authoring-round-trip constraint as header.js: rebuild structure
  // from content shape (brand <p>, nav <ul>, "Follow us" <p> + social
  // <ul>, copyright <p>) rather than relying on custom wrapper classes.
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const children = [...(temp.firstElementChild || temp).children];

  const brand = document.createElement('div');
  brand.className = 'footer-brand';
  const sections = document.createElement('div');
  sections.className = 'footer-sections';
  const social = document.createElement('div');
  social.className = 'footer-social';
  const legal = document.createElement('div');
  legal.className = 'footer-legal';

  // State machine over the fixed authoring shape: brand <p>, nav <ul>,
  // "Follow us" <p>, social <ul>, copyright <p>. A label paragraph belongs
  // with the list that *follows* it, not the one before it, so this can't
  // be a simple "how many <ul> seen so far" counter.
  let phase = 'brand';
  children.forEach((child) => {
    if (phase === 'brand') {
      if (child.tagName === 'UL') {
        sections.append(child);
        phase = 'after-nav';
      } else {
        brand.append(child);
      }
    } else if (phase === 'after-nav') {
      social.append(child);
      phase = 'before-social-list';
    } else if (phase === 'before-social-list') {
      social.append(child);
      if (child.tagName === 'UL') phase = 'after-social';
    } else {
      legal.append(child);
    }
  });

  // The DA authoring round-trip strips non-standard attributes (including
  // aria-label) from bare links, not just custom classes — added here
  // instead of relying on it surviving from the authored fragment.
  social.querySelectorAll('ul a').forEach((a) => {
    a.setAttribute('aria-label', 'Follow WKND (placeholder link)');
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'footer-wrapper';
  const row = document.createElement('div');
  row.append(brand, sections, social, legal);
  wrapper.append(row);
  block.append(wrapper);
  await decorateIcons(block);

  // decorateIcons() defaults every icon to alt="" (right for decorative
  // icons, wrong for the logo, which is the only content inside its link)
  const logo = brand.querySelector('img[data-icon-name^="wknd-logo"]');
  if (logo) logo.alt = 'WKND';
}
