/*
 * Core page-decoration library. Vendored convention shared by every block —
 * avoid changing behavior here; add block-specific logic in the block itself.
 */

const TEMPLATE_META = 'template';

export function sampleRUM() {
  // intentionally a no-op stub: no analytics/tracking is wired into this project
}

export function toClassName(name) {
  return typeof name === 'string'
    ? name
        .toLowerCase()
        .replace(/[^0-9a-z]+/g, '-')
        .replace(/^-+|-+$/g, '')
    : '';
}

export function toCamelCase(name) {
  return toClassName(name).replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

export function readBlockConfig(block) {
  const config = {};
  block.querySelectorAll(':scope > div').forEach((row) => {
    if (row.children.length === 2) {
      const key = toClassName(row.children[0].textContent);
      const valueEl = row.children[1];
      const a = valueEl.querySelector('a');
      config[key] = a ? a.href : valueEl.textContent.trim();
    }
  });
  return config;
}

function decorateButtons(main) {
  main.querySelectorAll('a').forEach((a) => {
    a.title = a.title || a.textContent;
    const up = a.parentElement;
    const twoUp = up.parentElement;
    if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
      const strong = up.querySelector('strong');
      const em = up.querySelector('em');
      let cls = 'button';
      if (strong && em) cls = 'button primary';
      else if (em) cls = 'button secondary';
      a.classList.add(...cls.split(' '));
      up.classList.add('button-wrapper');
    }
    if (
      up.childNodes.length === 1
      && up.tagName === 'STRONG'
      && twoUp.childNodes.length === 1
      && twoUp.tagName === 'P'
    ) {
      a.classList.add('button', 'primary');
      twoUp.classList.add('button-wrapper');
    }
  });
}

export function decorateIcons(element) {
  element.querySelectorAll('span.icon').forEach((span) => {
    const iconName = [...span.classList].find((c) => c.startsWith('icon-'))?.replace('icon-', '');
    if (!iconName) return;
    const img = document.createElement('img');
    img.dataset.iconName = iconName;
    img.src = `/icons/${iconName}.svg`;
    img.loading = 'lazy';
    img.alt = '';
    span.append(img);
  });
}

function buildAutoBlocks() {
  // no auto-block heuristics needed yet; block boundaries are always authored explicitly
}

function decorateSections(main) {
  main.querySelectorAll(':scope > div').forEach((section) => {
    const wrappers = [];
    let defaultContent = false;
    [...section.children].forEach((el) => {
      if (el.tagName === 'DIV' || !defaultContent) {
        const wrapper = document.createElement('div');
        wrappers.push(wrapper);
        defaultContent = el.tagName !== 'DIV';
        if (defaultContent) wrapper.classList.add('default-content-wrapper');
      }
      wrappers[wrappers.length - 1].append(el);
    });
    wrappers.forEach((wrapper) => section.append(wrapper));
    section.classList.add('section');
    section.dataset.sectionStatus = 'initialized';
    section.style.display = 'none';

    const sectionMeta = section.querySelector('div.section-metadata');
    if (sectionMeta) {
      const meta = readBlockConfig(sectionMeta);
      Object.keys(meta).forEach((key) => {
        if (key === 'style') {
          const styles = meta.style
            .split(',')
            .map((s) => toClassName(s.trim()));
          styles.forEach((style) => section.classList.add(style));
        } else {
          section.dataset[toCamelCase(key)] = meta[key];
        }
      });
      sectionMeta.remove();
    }
  });
}

export function updateSectionsStatus(main) {
  const sections = [...main.querySelectorAll(':scope > div.section')];
  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    const status = section.dataset.sectionStatus;
    if (status !== 'loaded') {
      const loadingBlock = section.querySelector('.block[data-block-status="initialized"], .block[data-block-status="loading"]');
      if (loadingBlock) {
        section.dataset.sectionStatus = 'loading';
        break;
      } else {
        section.dataset.sectionStatus = 'loaded';
        section.style.display = null;
      }
    }
  }
}

function decorateBlock(block) {
  const shortBlockName = block.classList[0];
  if (!shortBlockName) return;
  block.dataset.blockName = shortBlockName;
  block.dataset.blockStatus = 'initialized';
  block.classList.add('block');
  const blockWrapper = block.parentElement;
  blockWrapper.classList.add(`${shortBlockName}-wrapper`);
}

export function decorateBlocks(main) {
  main.querySelectorAll('div.section > div > div').forEach(decorateBlock);
}

async function loadCSS(href) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`head > link[href="${href}"]`)) {
      resolve();
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.append(link);
  });
}

async function loadScript(src, attrs = {}) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`head > script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    Object.entries(attrs).forEach(([k, v]) => script.setAttribute(k, v));
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
}

async function loadBlock(block) {
  const status = block.dataset.blockStatus;
  if (status === 'loading' || status === 'loaded') return block;
  block.dataset.blockStatus = 'loading';
  const name = block.dataset.blockName;
  try {
    const cssLoaded = loadCSS(`/blocks/${name}/${name}.css`);
    const jsLoaded = import(`/blocks/${name}/${name}.js`)
      .then(async (mod) => {
        if (mod.default) await mod.default(block);
      })
      .catch(() => {});
    await Promise.all([cssLoaded, jsLoaded]);
  } finally {
    block.dataset.blockStatus = 'loaded';
  }
  return block;
}

export async function loadBlocks(main) {
  const blocks = [...main.querySelectorAll('div.block')];
  for (let i = 0; i < blocks.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await loadBlock(blocks[i]);
  }
}

function getMetadata(name) {
  const el = document.head.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  return el ? el.content : '';
}

function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  if (h1 && picture && h1.parentElement.tagName === 'DIV' && !main.querySelector('.hero')) {
    const section = h1.closest('div');
    if (section && picture.closest('div') === section) {
      const heroBlock = document.createElement('div');
      heroBlock.className = 'hero';
      const row = document.createElement('div');
      row.append(picture, h1);
      heroBlock.append(row);
      section.prepend(heroBlock);
    }
  }
}

export function decorateTemplateAndTheme() {
  const template = getMetadata(TEMPLATE_META);
  if (template) document.body.classList.add(toClassName(template));
}

export function decorateMain(main) {
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

export { getMetadata, loadCSS, loadScript, loadBlock, buildHeroBlock };
