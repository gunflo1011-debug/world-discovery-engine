# Worker 2 — GDP per capita consolidation validation

Validated: 2026-09-11 05:28 Europe/Berlin

## CEO assignment
Validate the existing post-gate GDP-per-capita consolidation path only. Do not deploy or alter production while the GDP-per-capita CTR measurement gate remains open.

## Repo / CI state
- Starting `main`: `365293c064ad54ae108cd5c86bbd4a3ccdf310bc`.
- Open PRs: none.
- CI run 1379 for the starting head completed successfully.

## Implementation evidence
`npm run build` invokes `node scripts/consolidate-legacy-indicators.mjs` near the end of the normal build pipeline.

For `indicators/gdp-per-capita/index.html`, `scripts/consolidate-legacy-indicators.mjs` is configured with:
- canonical: `https://worlddiscoverydata.com/data/gdp-per-capita/`
- maintained link: `../../data/gdp-per-capita/`
- label: `GDP per capita`

The transform:
1. inserts/replaces robots with `<meta name="robots" content="noindex,follow">`;
2. inserts/replaces canonical with the maintained `/data/gdp-per-capita/` URL;
3. replaces the main body with a `data-legacy-indicator-notice` moved surface containing a direct maintained-page link;
4. removes `https://worlddiscoverydata.com/indicators/gdp-per-capita/` from `site/sitemap.xml`.

## Automated test coverage
`test/legacy-indicator-consolidation.test.js` executes the consolidation script and explicitly asserts for GDP per capita:
- `noindex,follow`;
- canonical to `/data/gdp-per-capita/`;
- `data-legacy-indicator-notice` exists;
- legacy GDP-per-capita URL is absent from sitemap;
- maintained `/data/gdp-per-capita/` remains in sitemap.

`test/legacy-indicator-retirement.test.js` additionally asserts the retired GDP-per-capita surface:
- states `This indicator page has moved.`;
- links directly to `../../data/gdp-per-capita/`;
- retains the maintained canonical;
- does not expose stale legacy branding/product-registry copy.

## Green evidence
CI run 1379 on the current starting head completed successfully. The repository's normal `test` command is `node --test --test-concurrency=1 "test/**/*.test.js"`, and the normal `check` command runs build, link checks, the full test suite, then a second build and link check. Therefore the successful CI provides repository-level green evidence for the checked-in consolidation behavior. A separate local clone/test attempt was not possible in this runtime because external DNS resolution for github.com failed; this does not change the GitHub CI result.

## Decision
Implementation mechanics are **VALIDATED / HOLD**. No production/indexation change was made. After the CEO closes the GDP-per-capita CTR measurement gate, the existing scoped consolidation mechanism is ready to be used with the normal build/check pipeline and post-deploy verification.
