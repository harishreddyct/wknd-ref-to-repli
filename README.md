# WKND Adventures

A mock Edge Delivery Services (EDS) site built as a structural/visual replication of [wknd.site](https://wknd.site/), Adobe's public demo travel & adventure site. All copy, images, and traveler/adventure details in this project are **original placeholder content** — nothing is copied from the live reference. See `docs/page-registry.md` for what was mocked and why.

## Install

```
npm install
```

## Serve locally

No build step — this is a plain static site (vanilla JS/CSS, EDS block conventions). Serve the repo root with any static server:

```
npm run serve
```

Then open `http://localhost:8000/`.

## Lint

```
npm run lint
```

## Lighthouse

```
npm run lighthouse
```

Runs Lighthouse against a running local server and writes reports to `tools/lighthouse/output/` (gitignored).

## Visual diff

```
npm run visual-diff
```

Screenshots the local pages at the project's breakpoints (375/768/960/1200) via Playwright and writes them to `tools/visual-validation/output/` (gitignored) for side-by-side review.

## Project structure

See `AGENTS.md` for the full structural/conventions reference, and `docs/component-registry.md` / `docs/page-registry.md` for what's been built and where it's used.
