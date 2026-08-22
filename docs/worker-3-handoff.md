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

7. **Verified evidence schema hardening** — commits `08c704749f23126dcf88200a7de6bc66f4f84406` and `be5eaa179c14a728b37ceae0980c9a74ab6b9115`
   - Added source-faithful `Dataset` JSON-LD to `/evidence/germany-population-revision-2025/` only after verifying its actual `evidence.json` contents.
   - Schema names the exact indicator `SP.POP.TOTL`, Germany spatial coverage, the two WDI archive release URLs, and the crawlable JSON/CSV distributions. It does not add causal or methodological claims beyond the page/evidence payload.
   - Added regression assertions so the verified Germany page must retain Dataset JSON-LD, indicator identity and both machine-readable distribution URLs.

## Reproducible evidence / concrete defects found

- `site/sitemap.xml` advertised `/indicators/population-total/`, but `site/indicators/` contains only `index.html` and `real-gdp/`; direct repository lookup for `site/indicators/population-total/index.html` returned 404. This was a real crawl-quality bug.
- `site/evidence/germany-gdp-growth-revision/index.html` is explicitly marked `DEMO FIXTURE · NOT REAL WDI EVIDENCE`; build logic previously mapped every evidence directory into public routes regardless of `demo` status. The current page also carries `noindex,follow`.
- `site/indicators/real-gdp/index.html` previously declared `@type: Dataset` although its copy explicitly states no GDP revision values are published. It now uses `WebPage` structured data.
- README previously said visible evidence examples were demo fixtures and the next milestone was the first real evidence; repository now contains many real population revision evidence directories, so that status was stale.
- `site/evidence/germany-population-revision-2025/evidence.json` explicitly identifies the record as `REAL`, indicator `SP.POP.TOTL`, Germany/DEU, reference year 2023, both source archive URLs and the revision values. This supports Dataset markup for that page without inventing data.

## Verification / failures

- GitHub workflow lookup for current head commits returned no associated pull-request workflow runs. **CI green is still not claimed.**
- Worker 2's local clone/network failure was not repeated; no local execution environment with the repo checkout was available in this run. The new regression tests are committed but have not been observed running.
- Live GitHub Pages/mobile rendering was not independently verified in this run.
- Latest main already includes subsequent accessibility/mobile work (`2a8447d3c539bec649d8b2f68ca6e3703ab0b8e7`) adding visible focus handling for horizontally scrollable tables; Worker 3 did not undo or duplicate it.

## Open problems / opportunities for Worker 4

1. **Highest priority:** verify CI for current head. Run/confirm `npm test` and `npm run build`. If tests expose expectations around demo evidence counts, generated `build.json`, or new Dataset assertions, fix the actual mismatch rather than weakening crawl guards.
2. Verify GitHub Pages deployment and fetch the live sitemap, `/indicators/real-gdp/`, `/indicators/real-gdp/status.json`, `/evidence/germany-population-revision-2025/`, its `evidence.json` and `evidence.csv`.
3. Audit **all demo/thin pages** for internal crawl exposure. Build excludes demo/noindex records, and the known Germany GDP demo now has `noindex,follow`, but check remaining fixtures such as `real-wdi-population-revision-2025` and any stale discovery/demo pages.
4. Validate the new Germany Dataset JSON-LD against the rendered page and consider generalizing the same source-faithful schema to other verified population evidence pages only if each page has equivalent REAL evidence payload and stable JSON/CSV distributions. Avoid mass-adding schema without evidence checks.
5. Check canonical consistency, internal link crawlability, keyboard navigation and mobile layout on live Pages at ~360–430 px as Worker 2 requested.
6. Do not promote REAL GDP revision data until methodology worker independently resolves release-specific base-year/valuation comparability.

## Recommended Worker 4 extra task

Perform a live crawl-quality smoke test: sitemap URLs return 200, canonicals match final URLs, demo fixtures are not index-preferred, verified Germany population evidence JSON/CSV are reachable and the new Dataset JSON-LD matches them, GDP `status.json` is reachable and contains no revision values, and remaining demo fixtures carry noindex or are removed from crawl paths.
