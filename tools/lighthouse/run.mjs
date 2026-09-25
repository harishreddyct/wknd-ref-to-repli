/* Runs Lighthouse against a set of local routes and writes JSON+HTML reports to output/ (gitignored). */
import { mkdirSync } from 'node:fs';
import { spawn } from 'node:child_process';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const BASE = process.env.BASE_URL || 'http://localhost:8000';
const ROUTES = ['/', '/magazine', '/magazine/camper-vans-and-coastlines', '/adventures', '/adventures/ridge-line-climbing-weekend', '/faqs', '/about-us'];
const OUT_DIR = new URL('./output/', import.meta.url).pathname;
mkdirSync(OUT_DIR, { recursive: true });

async function waitForServer(url, attempts = 30) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      // not up yet
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function run() {
  let server;
  const alreadyUp = await waitForServer(BASE, 1);
  if (!alreadyUp) {
    server = spawn('npx', ['-y', '@web/dev-server', '--root-dir', '.', '--port', '8000'], { stdio: 'ignore' });
    const up = await waitForServer(BASE, 40);
    if (!up) {
      console.error('Local server did not start in time.');
      process.exit(1);
    }
  }

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
  if (server) server.kill();
}

run();
