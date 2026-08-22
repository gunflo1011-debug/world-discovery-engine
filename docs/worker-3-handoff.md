# Worker 3 handoff — Search, GEO and AI discovery hardening

## Handoff chain consumed

Worker 1 (`cbfa901b158970ff36c7566532e8d338405ad4e5`) established that `NY.GDP.MKTP.KD` exists in both screened 2025 WDI archives but release-specific base-year/valuation comparability cannot be inferred from code identity/current metadata. Worker 2 built the transparent `/indicators/real-gdp/` screening page and kept real GDP revision publication fail-closed. Do not reopen that screened pair by inference; only genuinely new release-specific authoritative evidence should reopen it.

Worker 2 also nominated `IT.NET.USER.ZS` (Individuals using the Internet, % of population) as a future current/latest-value vertical. Treat that as a GO only for current/latest verified observations with ITU/WDI attribution, observation year, retrieval provenance, unit and license; it is NOT a GO for archive-revision claims.

Earlier CI uncertainty was partially resolved by direct user evidence: GitHub Pages workflow #77 was green for `3bc47f4...` and #78 green for `aced4b6...`. Do not generalize those runs to later commits without fresh evidence.

## Worker 3 implementation completed

1. Sitemap/index hardening: nonexistent static routes and demo/noindex evidence are excluded from preferred discovery.
2. `/indicators/real-gdp/status.json` is machine-readable status/provenance only; no unverified GDP revision values or REAL CSV.
3. GDP screening page uses `WebPage`, not misleading `Dataset` schema.
4. README was aligned to the real population evidence and decisive GDP fail-closed decision.
5. Germany population REAL evidence has source-faithful Dataset JSON-LD plus JSON/CSV distributions.
6. Machine discovery index is schema 1.2 and includes only REAL, discovery-ready evidence with indicator/entity/reference-year/vintage/methodology/license metadata.
7. Build-time discovery validation requires both `evidence.json` and `evidence.csv`, valid source URLs and complete core provenance. `build.json` counts `discoveryIncompleteExcluded`.
8. Regression tests require emitted machine records to be REAL, discovery-ready, JSON/CSV-backed and provenance-complete.
9. Pages `verify-live` now enumerates every advertised machine record, fetches JSON+CSV, requires REAL/discovery-ready, and semantically cross-checks indicator/entity/reference year for both formats.
10. Live mobile browser coverage was expanded in `f7fe0d7c49f6ab6b3c1f285ed1b8b5796b9ecc42`: 360/390/430px now cover Home, Indicators, Real GDP and Germany REAL evidence, with horizontal-overflow, nav visibility, console/page-error, absolute canonical, title and meta-description assertions.

## Reproducible evidence / concrete defects

- Germany REAL payload contains `SP.POP.TOTL`, DEU/Germany, reference year 2023, methodology version, both official WDI archive URLs, methodology note and license; JSON and CSV exist.
- Build-time machine discovery fails closed when REAL evidence lacks required provenance or JSON/CSV files.
- Current `.github/workflows/pages.yml` contains all-record JSON+CSV live semantic verification and commit-exact release identity.
- Before `f7fe0d7...`, the Playwright live mobile smoke covered only Home and Germany evidence. Worker 2 had explicitly requested mobile validation of the indicator/GDP screening UX, so the actual methodology-blocked GDP page was not under browser-CI coverage. That gap is now closed.
- GDP screening remains status-only/fail-closed. Do not add revision values, Dataset schema or CSV for the screened pair absent new authoritative release-specific comparability evidence.

## Verification / failures

- Direct user evidence previously proved Pages #77/#78 green for `3bc47f4...` and `aced4b6...`.
- Current workflow has commit-exact `release-sha.txt`, critical live route checks, GDP fail-closed verification, canonical/robots/sitemap checks, all-record semantic machine verification, and Playwright mobile smoke.
- Fresh Actions/Pages result for `f7fe0d7...` has not yet been observed. Do not claim the expanded browser assertions green/live until deploy + verify-live completes for that SHA or a descendant containing it.
- No local clone/test was run from this automation runtime; GitHub connector writes succeeded.

## HANDOFF AN WORKER 4

### Success
- Verified population evidence has canonical human pages plus source-backed JSON/CSV.
- Germany has validated Dataset JSON-LD.
- Machine collection index fails closed on incomplete provenance or missing JSON/CSV.
- Demo/noindex/nonexistent/discovery-incomplete evidence is not preferred via sitemap/machine index.
- GDP screening is transparently status-only and the screened 2025 pair remains methodology-blocked.
- README is aligned with repo evidence/product decision.
- Pages workflow contains all-record live distribution verification plus semantic identity checks for JSON and CSV.
- Mobile browser CI now directly covers the Indicators hub and Real-GDP screening page at 360/390/430px, including canonical/title/description checks.

### Failure / unverified
- Fresh CI/Pages result for `f7fe0d7...` has not yet been observed.
- Connector/runtime did not provide a local clone execution path in this run, so browser results must come from Actions.

### Open checks / fixes
1. Observe the Pages run containing `f7fe0d7...`; require deploy + `verify-live` success and commit-exact `release-sha.txt` convergence.
2. If mobile smoke fails, use the uploaded browser-smoke artifact/screenshots to fix the concrete route/viewport defect; do not relax assertions just to green CI.
3. Audit additional REAL population human pages for canonical/meta/human-visible provenance consistency; fix concrete defects only.
4. Consider adding keyboard focus traversal assertions to the browser smoke if the current nav markup supports stable focus expectations.
5. For future `IT.NET.USER.ZS`, require exact WDI/ITU source attribution, observation year vs retrieval date distinction, `% of population` unit, applicable license/citation requirements, JSON/CSV from the same normalized record, and no archive-revision language.
6. Do not reopen GDP by inference.

### Recommended additional task
After `f7fe0d7...` is green, extend the live browser smoke to one representative non-Germany REAL evidence page and assert its machine-readable JSON/CSV links are visible and navigable from the human page. That would test human→machine crawlability, not merely endpoint availability.
