/*
 * Runs Lighthouse against the deployed site and writes JSON+HTML reports
 * to output/ (gitignored). Content lives in DA, not in this repo (see
 * AGENTS.md), so there's no local server to spawn — this always targets
 * a real deployment; override BASE_URL for a different branch/preview.
 */
import { mkdirSync } from 'node:fs';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const BASE = process.env.BASE_URL || 'https://main--wknd-ref-to-repli--harishreddyct.aem.page';
const ROUTES = ['/', '/magazine/', '/magazine/western-australia', '/adventures/', '/adventures/bali-surf-camp', '/faqs', '/about-us'];
const OUT_DIR = new URL('./output/', import.meta.url).pathname;
mkdirSync(OUT_DIR, { recursive: true });

async function run() {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new'] });
  for (const route of ROUTES) {
    const url = `${BASE}${route}`;
    // eslint-disable-next-line no-await-in-loop
    const result = await lighthouse(url, { port: chrome.port, output: 'json', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
    const { categories } = result.lhr;
    const scores = Object.fromEntries(Object.entries(categories).map(([k, v]) => [k, Math.round(v.score * 100)]));
    console.log(route, scores);
    const file = `${OUT_DIR}${route === '/' ? 'home' : route.replace(/\//g, '_')}.json`;
    // eslint-disable-next-line no-await-in-loop
    await import('node:fs/promises').then((fs) => fs.writeFile(file, result.report));
  }
  await chrome.kill();
}

run();
