/*
 * Screenshots routes at the project's breakpoints, for side-by-side review
 * against the reference. Writes to output/ (gitignored). Deliberately does
 * NOT depend on a local `playwright` install — it shells out to the
 * Playwright CLI's `screenshot` command via `npx`, which fetches it into
 * npm's shared npx cache on demand and leaves this repo's
 * package.json/node_modules untouched. Content lives in DA, not in this
 * repo (see AGENTS.md), so this targets the deployed preview site by
 * default — override BASE_URL to point at a different branch/preview.
 */
import { mkdirSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const BASE = process.env.BASE_URL || 'https://main--wknd-ref-to-repli--harishreddyct.aem.page';
const ROUTES = ['/', '/magazine/', '/magazine/western-australia', '/adventures/', '/adventures/bali-surf-camp', '/faqs', '/about-us'];
const WIDTHS = [375, 768, 960, 1200];
const OUT_DIR = new URL('./output/', import.meta.url).pathname;
mkdirSync(OUT_DIR, { recursive: true });

async function run() {
  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      const url = `${BASE}${route}`;
      const name = `${route === '/' ? 'home' : route.replace(/\//g, '_')}_${width}.png`;
      const file = `${OUT_DIR}${name}`;
      // eslint-disable-next-line no-await-in-loop
      await execFileAsync('npx', [
        '--yes', 'playwright', 'screenshot',
        `--viewport-size=${width},900`,
        '--full-page',
        url, file,
      ]);
      console.log(`saved ${name}`);
    }
  }
}

run();
