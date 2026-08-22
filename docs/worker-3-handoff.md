# Worker 3 handoff — Search, GEO and AI discovery hardening

## Handoff chain consumed

Worker 1 (`cbfa901b158970ff36c7566532e8d338405ad4e5`) proved the archived WDI files contain `NY.GDP.MKTP.KD` for screened 2023 rows but failed closed because release-specific base-year/valuation comparability is not independently proven. No public REAL GDP revision values/rankings/CSV should be emitted until methodology evidence resolves that gate.

Worker 2 then built the transparent `/indicators/real-gdp/` screening page, linked it from Indicators, added accessible provenance/table UX, added the route to sitemap generation and documented that CI/Pages/live deployment were unverified because the automation container could not clone GitHub.

## Worker 3 implementation

1. **Sitemap/index hardening** — commit `d0f1f67321872181997833fd2f2c5991b426f48b`
   - `scripts/build-site.js` now checks that static routes actually have an `index.html` before placing them in the sitemap.
   - Removed the nonexistent `/indicators/population-total/` hardcode.
   - Demo evidence (`DEMO` marker) is excluded from generated sitemap and `site/evidence/index.json` so machine discovery does not prefer synthetic fixtures.
   - build metadata now reports `demoPagesExcluded`.

2. **Machine-readable GDP screening status** — commit `f80e669c573cff0a71f26038c234c9690fbed30d`
   - Added `/indicators/real-gdp/status.json`.
   - It exposes only indicator identity, two archive release references and the unresolved methodology gate; it deliberately contains no revision values or REAL CSV.

3. **GDP metadata/structured data correctness** — commit `f0d36b2fe1ab7723bfca4451e972f0780766e9e4`
   - Changed JSON-LD from `Dataset` to `WebPage` because the page is a screening/status page and intentionally does not publish a GDP dataset.
   - Tightened title/meta description so they make only the supported blocked-status claim.
   - Added a crawlable link to `status.json`.

4. **README trust/status refresh** — commit `65352b6b33f9f10493124a3afef44e60e7f663aa`
   - Removed stale statements that all visible evidence was demo and that the first real vintage evidence was still pending.
   - README now states that real population-revision evidence exists, demos remain fixtures, and real GDP is methodology-blocked.

5. **Regression test hardening** — commit `2551b38a5777f9dd4ae3cabb635df734fb9c31ad`
   - `test/build-site.test.js` now requires the GDP route, rejects the nonexistent population-total route, rejects the known `germany-gdp-growth-revision` demo from sitemap, and requires generated evidence JSON to contain no demo records.

6. **Immediate checked-in sitemap correction** — commit `eadfa238997283093209f14cb4ac1b8da7e4b76c`
   - Removed `/indicators/population-total/` immediately from `site/sitemap.xml` and added the real `/archive/` route so current checked-in output is less stale before the next build.

## Reproducible evidence / concrete defects found

- `site/sitemap.xml` advertised `/indicators/population-total/`, but `site/indicators/` contains only `index.html` and `real-gdp/`; direct repository lookup for `site/indicators/population-total/index.html` returned 404. This was a real crawl-quality bug.
- `site/evidence/germany-gdp-growth-revision/index.html` is explicitly marked `DEMO FIXTURE · NOT REAL WDI EVIDENCE`; build logic previously mapped every evidence directory into public routes regardless of `demo` status.
- `site/indicators/real-gdp/index.html` previously declared `@type: Dataset` although its copy explicitly states no GDP revision values are published. It now uses `WebPage` structured data.
- README previously said visible evidence examples were demo fixtures and the next milestone was the first real evidence; repository now contains many real population revision evidence directories, so that status was stale.

## Verification / failures

- Connector access allowed repository reads and commits, but GitHub Actions run status could not be retrieved through the available GitHub fetch surface in this run; **CI green is not claimed**.
- Worker 2's local clone/network failure was not repeated; no local execution environment with the repo checkout was available in this run. The new regression test is committed but has not been observed running.
- Live GitHub Pages/mobile rendering was not independently verified in this run.

## Open problems / opportunities for Worker 4

1. **Highest priority:** verify CI for head `eadfa238...` or later. Run/confirm `npm test` and `npm run build`. If tests expose expectations around demo evidence counts or generated `build.json`, update tests/build consistently rather than re-introducing demo routes.
2. Verify GitHub Pages deployment and fetch the live sitemap, `/indicators/real-gdp/`, `/indicators/real-gdp/status.json`, and at least one verified population evidence JSON/CSV.
3. Audit **all demo/thin pages** for internal crawl exposure. They are now excluded from sitemap/machine evidence index, but known demo HTML pages may still be internally linked and currently lack `noindex`. If these fixtures remain reachable, add `<meta name="robots" content="noindex,follow">` (and equivalent search-engine-safe treatment) to demo fixtures or remove internal links, without blocking verified evidence.
4. Audit one or more verified population evidence pages for structured data. Example `site/evidence/germany-population-revision-2025/index.html` has canonical, concise supported meta description and JSON/CSV links, but no JSON-LD. Consider adding accurate `Dataset` or `WebPage`+distribution structured data only if it maps exactly to the page/evidence exports and provenance.
5. Check canonical consistency, internal link crawlability, keyboard navigation and mobile layout on live Pages at ~360–430 px as Worker 2 requested.
6. Do not promote REAL GDP revision data until methodology worker independently resolves release-specific base-year/valuation comparability.

## Recommended Worker 4 extra task

Perform a live crawl-quality smoke test: sitemap URLs return 200, canonicals match final URLs, demo fixtures are not index-preferred, verified population evidence JSON/CSV are reachable with correct content types/links, GDP `status.json` is reachable and contains no revision values, and at least one verified evidence page gains schema.org markup only if the markup can be made strictly source-faithful.
