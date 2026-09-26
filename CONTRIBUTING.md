# Contributing

This is a personal reference-site-replication practice project, not an Adobe or open-source governed project — the Adobe-specific CLA/release process from the upstream `aem-boilerplate` template it started from doesn't apply here. The parts that do still apply:

## Code of Conduct

This project adheres to the [code of conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold it.

## How to Contribute

1. Fork the repository
2. Make some changes on a branch on your fork
3. Create a pull request from your branch, following the [pull request template](.github/pull_request_template.md)

## Coding Styleguide

This project enforces a coding styleguide using `eslint` and `stylelint`. Run `npm run lint` before opening a pull request — the same check runs in CI, so a PR that fails it will be rejected. Some issues can be fixed automatically with `npx eslint . --fix`.
