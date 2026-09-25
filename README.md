# WKND Adventures

A mock Edge Delivery Services (EDS) site built as a structural/visual replication of [wknd.site](https://wknd.site/), Adobe's public demo travel & adventure site. All copy, images, and traveler/adventure details are **original placeholder content** — nothing is copied from the live reference. See `docs/page-registry.md` for what was mocked and why.

## Where the content lives

**This repository holds code only** — blocks, scripts, styles, icons, and default/placeholder imagery. Actual page content isn't stored as files in this git repo. In an AEM Edge Delivery Services site, pages are authored in Document Authoring (DA) and served through the `*.aem.page` (preview) / `*.aem.live` (production) backend:

- **Content authoring**: https://da.live/#/harishreddyct/wknd-ref-to-repli
- **Preview**: https://main--wknd-ref-to-repli--harishreddyct.aem.page/
- **Live**: https://main--wknd-ref-to-repli--harishreddyct.aem.live/

See `AGENTS.md` for the full structure and, importantly, the DA authoring round-trip constraint that governs how any new block's content must be shaped.

## Install

```
npm install
```

## Serve locally

```
npm run serve
```

Runs `aem up`, the real AEM CLI dev server: it serves this repo's code (blocks/scripts/styles) from local disk while proxying page content from the deployed preview above, so local code changes are visible immediately against real content. Opens `http://localhost:3000/`.

## Lint

```
npm run lint
```

## Lighthouse

```
npm run lighthouse
```

Runs Lighthouse against the deployed preview site (override with `BASE_URL`) and writes reports to `tools/lighthouse/output/` (gitignored).

## Visual diff

```
npm run visual-diff
```

Screenshots the deployed site's pages at the project's breakpoints (375/768/960/1200) via Playwright and writes them to `tools/visual-validation/output/` (gitignored) for side-by-side review.

## Project structure

See `AGENTS.md` for the full structural/conventions reference, and `docs/component-registry.md` / `docs/page-registry.md` for what's been built and where it's used.
