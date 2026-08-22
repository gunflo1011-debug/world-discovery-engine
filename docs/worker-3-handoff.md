# Worker 3 handoff — Search, GEO and AI discovery hardening

## Handoff chain consumed

Worker 1 (`cbfa901b158970ff36c7566532e8d338405ad4e5`) proved the archived WDI files contain `NY.GDP.MKTP.KD` for screened 2023 rows but failed closed because release-specific base-year/valuation comparability is not independently proven. No public REAL GDP revision values/rankings/CSV should be emitted until methodology evidence resolves that gate.

Worker 2 then built the transparent `/indicators/real-gdp/` screening page, linked it from Indicators, added accessible provenance/table UX, added the route to sitemap generation and documented that CI/Pages/live deployment were unverified because the automation container could not clone GitHub.

## Worker 3 implementation

1. **Sitemap/index hardening** — commit `d0f1f67321872181997833fd2f2c5991b426f48b`
   - `scripts/build-site.js` checks that static routes actually have an `index.html` before placing them in the sitemap.
   - Removed the nonexistent `/indicators/population-total/` hardcode.
   - Demo evidence is excluded from generated sitemap and `site/evidence/index.json`.

2. **Machine-readable GDP screening status** — commit `f80e669c573cff0a71f26038c234c9690fbed30d`
   - Added `/indicators/real-gdp/status.json` with only indicator identity, archive references and the unresolved methodology gate; no GDP revision values or REAL CSV.

3. **GDP metadata/structured-data correctness** — commit `f0d36b2fe1ab7723bfca4451e972f0780766e9e4`
   - Changed GDP screening JSON-LD from `Dataset` to `WebPage` because the page intentionally publishes no GDP dataset.
   - Tightened title/meta description and linked the status JSON.

4. **README trust/status refresh** — commit `65352b6b33f9f10493124a3afef44e60e7f663aa`
   - Removed stale claims that all visible evidence was demo and that real vintage evidence was still pending.
   - README now accurately states that real population-revision evidence exists and GDP remains methodology-blocked.

5. **Regression hardening** — commit `2551b38a5777f9dd4ae3cabb635df734fb9c31ad`
   - Tests require the GDP route, reject the nonexistent population-total route, reject known demo evidence from sitemap and require generated evidence JSON to contain no demo records.

6. **Immediate sitemap correction** — commit `eadfa238997283093209f14cb4ac1b8da7e4b76c`
   - Removed `/indicators/population-total/` from checked-in sitemap and added the real `/archive/` route.

7. **Verified Germany evidence schema** — commits `08c704749f23126dcf88200a7de6bc66f4f84406` and `be5eaa179c14a728b37ceae0980c9a74ab6b9115`
   - Added source-faithful `Dataset` JSON-LD to `/evidence/germany-population-revision-2025/` only after verifying its REAL `evidence.json`.
   - Schema includes `SP.POP.TOTL`, Germany, both archive releases and JSON/CSV distributions; regression tests protect it.

8. **Machine-discovery index enrichment** — commits `3bc47f498a7f3319619a33c69b9e073fd0b22de1` and `aced4b62d50d668275b95d8f9d3c309356333610`
   - `scripts/build-site.js` now reads each page's `evidence.json` when present and enriches the generated `/evidence/index.json` for REAL records with source-faithful machine fields: status, indicator code/name/unit/methodology version, entity identity/type, reference year, both vintage dates/source URLs, methodology note, license, and stable JSON/CSV distribution paths.
   - Machine index schema version is now `1.1`.
   - Payloads explicitly marked with a non-REAL status are treated as demo/non-indexable even if the HTML itself lacks the word `DEMO`, strengthening fail-closed discovery behavior.
   - Regression tests assert the Germany record carries `REAL`, `SP.POP.TOTL`, `DEU`, reference year 2023, JSON/CSV paths and the two World Bank archive vintages/source URLs.

## Reproducible evidence / concrete defects found

- `site/sitemap.xml` previously advertised `/indicators/population-total/`, but the route did not exist. This crawl-quality bug was fixed.
- `site/evidence/germany-gdp-growth-revision/index.html` is explicitly a demo fixture and carries `noindex,follow`; build logic now excludes demo/noindex evidence from discovery outputs.
- `site/indicators/real-gdp/index.html` previously declared `Dataset` despite intentionally publishing no revision values; it now declares `WebPage`.
- `site/evidence/germany-population-revision-2025/evidence.json` explicitly states `REAL`, indicator `SP.POP.TOTL`, Germany/DEU, reference year 2023, both source archive URLs, revision values and license. This is the source for its Dataset markup and now for the enriched machine index.
- Other REAL country pages such as United States already expose canonical/meta description, exact provenance and crawlable per-page `evidence.json` / `evidence.csv`, but do not all yet carry Dataset JSON-LD. Do not mass-add it without validating each payload equivalently.
- `site/robots.txt` allows public crawling and points to the canonical Pages sitemap; no additional robot-specific AI claims are made.
- README was rechecked after the earlier refresh and is currently consistent with repository evidence; no additional README change was justified in this run.

## Verification / failures

- GitHub Actions lookup for the newest commit `aced4b62...` returned no associated workflow runs. **CI green is not claimed.**
- The updated tests are committed but have not been observed executing in GitHub Actions.
- Live GitHub Pages/mobile rendering and the generated live `/evidence/index.json` schema `1.1` are not independently confirmed yet.
- Worker 2's earlier local clone failure was environmental; this run did not claim local build success.

## Open problems / opportunities for Worker 4

1. **Highest priority:** run/confirm `npm test` and `npm run build` for a head containing `aced4b62...`. Verify generated `/evidence/index.json` is schema `1.1` and contains only indexable REAL records.
2. Live-fetch `/sitemap.xml`, `/evidence/index.json`, `/indicators/real-gdp/`, `/indicators/real-gdp/status.json`, `/evidence/germany-population-revision-2025/`, its `evidence.json` and `evidence.csv`; require HTTP 200 and canonical consistency.
3. Audit remaining demo/thin evidence directories for `noindex` and internal-link exposure. Machine filtering is stronger now, but direct HTML crawl paths can still exist.
4. Validate that all REAL population `evidence.json` payloads share the expected structure before generalizing Dataset JSON-LD beyond Germany. If any payload is missing provenance/license/methodology, fix the source record first rather than generating schema from assumptions.
5. Consider adding a visible/crawlable link from the Evidence library page to `/evidence/index.json` so humans and agents can discover the collection-level machine index without guessing the endpoint.
6. Check mobile/keyboard navigation at 360–430 px and canonical→200 behavior as Worker 2 originally requested.
7. Keep REAL GDP revisions blocked until release-specific base-year/valuation comparability is independently verified by the methodology/data worker.

## Recommended Worker 4 extra task

Perform one end-to-end live discovery smoke test from `robots.txt → sitemap.xml → evidence library → evidence/index.json → Germany evidence page → evidence.json/evidence.csv`, and separately `Indicators → Real GDP → status.json`. Verify that only the population path exposes data-bearing evidence and the GDP path remains status-only/fail-closed. If the new machine index is not live or fails generation, inspect the build/test output before weakening any filtering rule.
