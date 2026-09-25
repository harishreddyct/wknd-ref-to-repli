import { decorateIcons } from '../../scripts/aem.js';

const FOOTER_PATH = '/footer.plain.html';

export default async function decorate(block) {
  const resp = await fetch(FOOTER_PATH);
  const html = await resp.text();
  const wrapper = document.createElement('div');
  wrapper.className = 'footer-wrapper';
  wrapper.innerHTML = html;
  block.append(wrapper);
  await decorateIcons(block);
}
