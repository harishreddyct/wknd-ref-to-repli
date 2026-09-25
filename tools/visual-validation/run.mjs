/* Screenshots local routes at the project's breakpoints via Playwright, for side-by-side review against the reference. Writes to output/ (gitignored). */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:8000';
const ROUTES = ['/', '/magazine', '/magazine/camper-vans-and-coastlines', '/adventures', '/adventures/ridge-line-climbing-weekend', '/faqs', '/about-us'];
const WIDTHS = [375, 768, 960, 1200];
const OUT_DIR = new URL('./output/', import.meta.url).pathname;
mkdirSync(OUT_DIR, { recursive: true });

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      // eslint-disable-next-line no-await-in-loop
      await page.setViewportSize({ width, height: 900 });
      // eslint-disable-next-line no-await-in-loop
      await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
      const name = `${route === '/' ? 'home' : route.replace(/\//g, '_')}_${width}.png`;
      // eslint-disable-next-line no-await-in-loop
      await page.screenshot({ path: `${OUT_DIR}${name}`, fullPage: true });
      console.log(`saved ${name}`);
    }
  }
  await browser.close();
}

run();
