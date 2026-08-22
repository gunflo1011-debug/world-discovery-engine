# Worker 3 handoff — Search, GEO and AI discovery hardening

## Handoff chain consumed

Worker 1 (`cbfa901b158970ff36c7566532e8d338405ad4e5`) established that `NY.GDP.MKTP.KD` exists in both screened 2025 WDI archives but release-specific base-year/valuation comparability cannot be inferred from code identity/current metadata. Worker 2 built the transparent `/indicators/real-gdp/` screening page and kept real GDP revision publication fail-closed. Do not reopen that screened pair by inference; only genuinely new release-specific authoritative evidence should reopen it.

Worker 2 also nominated `IT.NET.USER.ZS` as a future current/latest-value vertical. Treat that as a GO only for current/latest verified observations with ITU/WDI attribution, observation year, retrieval provenance, unit and license; it is NOT a GO for archive-revision claims.

Earlier CI uncertainty was partially resolved by direct user evidence: GitHub Pages workflow #77 was green for `3bc47f4...` and #78 green for `aced4b6...`. Do not generalize those runs to later commits without fresh evidence.

## Worker 3 implementation completed

1. Sitemap/index hardening excludes nonexistent static routes and demo/noindex evidence from preferred discovery.
2. `/indicators/real-gdp/status.json` is machine-readable status/provenance only; no unverified GDP revision values or REAL CSV.
3. GDP screening page uses `WebPage`, not misleading `Dataset` schema.
4. README was aligned to real population evidence and the decisive GDP fail-closed decision.
5. Germany population REAL evidence has source-faithful Dataset JSON-LD plus JSON/CSV distributions.
6. Machine discovery index is schema 1.2 and only emits REAL, discovery-ready evidence with indicator/entity/reference-year/vintage/methodology/license metadata.
7. Build-time discovery validation requires `evidence.json` + `evidence.csv`, valid source URLs and complete core provenance.
8. Pages `verify-live` enumerates every advertised machine record, fetches JSON+CSV, and semantically cross-checks indicator/entity/reference year for both formats.
9. Live mobile browser coverage at 360/390/430px covers Home, Indicators, Real GDP and Germany REAL evidence with overflow/nav/error/canonical/title/description/focus assertions.
10. Commit `4f4c54cd42def2c28f24133dd171358cb2835f52` extends the browser smoke to a representative non-Germany REAL page: United States population revision 2025. On REAL evidence pages the browser test now requires visible `evidence.json` and `evidence.csv` links and follows each via HTTP, proving human-page → machine-evidence crawlability rather than merely checking endpoints independently.

## Reproducible evidence / concrete defects

- Germany REAL payload contains `SP.POP.TOTL`, DEU/Germany, reference year 2023, methodology version, both official WDI archive URLs, methodology note and license; JSON and CSV exist.
- United States REAL human page has an absolute canonical, factual meta description, visible provenance, and explicit relative links to `./evidence.json` and `./evidence.csv`.
- Build-time machine discovery fails closed when REAL evidence lacks required provenance or JSON/CSV files.
- Current `.github/workflows/pages.yml` contains commit-exact release identity, all-record JSON+CSV live semantic verification and Playwright mobile smoke.
- GDP screening remains status-only/fail-closed. Do not add revision values, Dataset schema or CSV for the screened pair absent new authoritative release-specific comparability evidence.

## Verification / failures

- Direct user evidence previously proved Pages #77/#78 green for `3bc47f4...` and `aced4b6...`.
- Fresh Actions/Pages result for `4f4c54cd...` has not yet been observed. Do not claim the new US/human→machine browser assertions green/live until deploy + verify-live completes for that SHA or a descendant containing it.
- No local clone/test was run from this automation runtime; GitHub connector reads/writes succeeded.

## HANDOFF AN WORKER 4

### Success
- Verified population evidence has canonical human pages plus source-backed JSON/CSV.
- Germany has validated Dataset JSON-LD.
- Machine collection index and live workflow fail closed on incomplete/broken machine evidence.
- Demo/noindex/nonexistent/discovery-incomplete evidence is not preferred via sitemap/machine index.
- GDP screening is transparently status-only and the screened 2025 pair remains methodology-blocked.
- README is aligned with repo evidence/product decision.
- Browser CI now includes a second-country REAL page and explicitly tests visible/navigable human→JSON/CSV links.

### Failure / unverified
- Fresh CI/Pages result for `4f4c54cd...` has not yet been observed.
- Connector/runtime did not provide a local clone execution path; browser results must come from Actions.

### Open checks / fixes
1. Observe the Pages run containing `4f4c54cd...`; require deploy + `verify-live` success and commit-exact `release-sha.txt` convergence.
2. If mobile smoke fails, use uploaded screenshots/artifacts to fix the concrete route/viewport/link defect; do not weaken the gate.
3. Audit additional REAL population human pages for canonical/meta/human-visible provenance consistency; fix concrete defects only.
4. Consider checking that human-page machine links resolve to payloads whose indicator/entity/referenceYear match the visible page, not merely HTTP 200; the workflow already performs semantic identity at collection level.
5. For future `IT.NET.USER.ZS`, require exact WDI/ITU source attribution, observation year vs retrieval date distinction, `% of population` unit, applicable license/citation requirements, JSON/CSV from the same normalized record, and no archive-revision language.
6. Do not reopen GDP by inference.

### Recommended additional task
After the new browser run is green, extend source-faithful Dataset JSON-LD from Germany to another REAL population page only if its evidence payload carries the same provenance fields, then add a regression check that JSON-LD distribution URLs correspond to the visible JSON/CSV links.
