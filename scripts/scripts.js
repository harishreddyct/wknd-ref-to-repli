import {
  decorateMain,
  decorateTemplateAndTheme,
  loadBlocks,
  loadCSS,
  updateSectionsStatus,
  sampleRUM,
} from './aem.js';

/**
 * Marks the LCP-candidate image (if any) as high priority and waits for it
 * to be in the DOM before unhiding the first section, so nothing shifts in
 * after the largest paint has already happened.
 */
async function waitForLCP(main) {
  const lcpBlock = main.querySelector('.hero, .cards');
  if (lcpBlock) {
    const img = lcpBlock.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.fetchPriority = 'high';
      if (!img.complete) {
        await new Promise((resolve) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve);
        });
      }
    }
  }
}

function addSkipLink(doc) {
  const link = document.createElement('a');
  link.className = 'skip-link';
  link.href = '#main';
  link.textContent = 'Skip to content';
  doc.body.prepend(link);
  const main = doc.querySelector('main');
  if (main && !main.id) main.id = 'main';
}

async function loadEager(doc) {
  document.documentElement.lang = document.documentElement.lang || 'en';
  decorateTemplateAndTheme();
  addSkipLink(doc);

  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(main);
  }
}

async function loadHeader(headerBlock) {
  headerBlock.textContent = '';
  const header = document.createElement('div');
  header.className = 'header';
  headerBlock.append(header);
  const [mod] = await Promise.all([
    import('/blocks/header/header.js'),
    loadCSS('/blocks/header/header.css'),
  ]);
  await mod.default(header);
}

async function loadFooter(footerBlock) {
  footerBlock.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer';
  footerBlock.append(footer);
  const [mod] = await Promise.all([
    import('/blocks/footer/footer.js'),
    loadCSS('/blocks/footer/footer.css'),
  ]);
  await mod.default(footer);
}

async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : null;
  if (hash && element) element.scrollIntoView();

  await Promise.all([
    loadHeader(doc.querySelector('header')),
    loadFooter(doc.querySelector('footer')),
  ]);

  loadCSS('/styles/lazy-styles.css');
  updateSectionsStatus(main);
  sampleRUM();
}

function loadDelayed() {
  window.setTimeout(() => import('./delayed.js'), 3000);
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
