/*
 * Runs Lighthouse against the deployed site and writes JSON reports to
 * output/ (gitignored). Deliberately does NOT depend on a local
 * `lighthouse`/`chrome-launcher` install — it shells out to the Lighthouse
 * CLI via `npx`, which fetches it into npm's shared npx cache on demand and
 * leaves this repo's package.json/node_modules untouched. Content lives in
 * DA, not in this repo (see AGENTS.md), so there's no local server to spawn
 * — this always targets a real deployment; override BASE_URL for a
 * different branch/preview.
 */
import { mkdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const BASE = process.env.BASE_URL || 'https://main--wknd-ref-to-repli--harishreddyct.aem.page';
const ROUTES = ['/', '/magazine/', '/magazine/western-australia', '/adventures/', '/adventures/bali-surf-camp', '/faqs', '/about-us'];
const OUT_DIR = new URL('./output/', import.meta.url).pathname;
mkdirSync(OUT_DIR, { recursive: true });

async function run() {
  for (const route of ROUTES) {
    const url = `${BASE}${route}`;
    const file = `${OUT_DIR}${route === '/' ? 'home' : route.replace(/\//g, '_')}.json`;
    // eslint-disable-next-line no-await-in-loop
    await execFileAsync('npx', [
      '--yes', 'lighthouse', url,
      '--output=json', `--output-path=${file}`,
      '--chrome-flags=--headless=new',
      '--only-categories=performance,accessibility,best-practices,seo',
      '--quiet',
    ]);
    // eslint-disable-next-line no-await-in-loop
    const report = JSON.parse(await readFile(file, 'utf8'));
    const scores = Object.fromEntries(Object.entries(report.categories).map(([k, v]) => [k, Math.round(v.score * 100)]));
    console.log(route, scores);
  }
}

run();
