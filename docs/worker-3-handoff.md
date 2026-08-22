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
9. **Live all-record + semantic verification is now actually present on current main in commit `11240cb0f15769f3f2e64af37022ac6cd7cead19`.** The Pages `verify-live` job downloads live `/evidence/index.json`, requires schema 1.2, iterates every advertised record, requires `REAL` + `discoveryReady=true`, fetches every advertised JSON and CSV URL, parses JSON, checks CSV shape, and cross-checks live JSON `indicator.code`, `entity.code` and `referenceYear` against the parent index record. Germany `SP.POP.TOTL`/DEU remains a required sentinel.

Important correction to the previous handoff: it described an earlier all-record live verifier commit (`ddcb3f55...`), but the workflow content fetched at the start of this run did not contain that step. Do not rely on that prior claim. Commit `11240cb0...` is the concrete current-main implementation observed and written in this run.

## Reproducible evidence / concrete defects

- Germany REAL payload contains `SP.POP.TOTL`, DEU/Germany, reference year 2023, methodology version, both official WDI archive URLs, methodology note and license; JSON and CSV exist.
- Build-time machine discovery already fails closed when REAL evidence lacks required provenance or JSON/CSV files.
- At the start of this run, `.github/workflows/pages.yml` verified only critical routes and Germany-specific files; it did not enumerate all records in `/evidence/index.json`. Therefore a non-Germany advertised endpoint, or a valid endpoint serving the wrong indicator/entity/year, could escape live verification.
- Commit `11240cb0...` closes both gaps: every advertised distribution is fetched and each JSON payload is semantically tied back to its index record.
- GDP screening remains status-only/fail-closed. Do not add revision values, Dataset schema or CSV for the screened pair absent new authoritative release-specific comparability evidence.

## Verification / failures

- Direct user evidence previously proved Pages #77/#78 green for `3bc47f4...` and `aced4b6...`.
- Current workflow also has commit-exact `release-sha.txt`, critical live route checks, GDP fail-closed verification, canonical/robots/sitemap checks and a Playwright mobile browser smoke.
- Fresh Actions/Pages result for `11240cb0...` has not yet been observed in this run. Do not claim it green/live until deploy + verify-live completes for that SHA or a descendant containing it.
- No local clone/test was run from this automation runtime; GitHub connector writes succeeded.

## HANDOFF AN WORKER 4

### Success
- Verified population evidence has canonical human pages plus source-backed JSON/CSV.
- Germany has validated Dataset JSON-LD.
- Machine collection index fails closed on incomplete provenance or missing JSON/CSV.
- Demo/noindex/nonexistent/discovery-incomplete evidence is not preferred via sitemap/machine index.
- GDP screening is transparently status-only and the screened 2025 pair remains methodology-blocked.
- README is aligned with repo evidence/product decision.
- Pages workflow now contains concrete all-record live distribution verification plus semantic identity checks for indicator code, entity code and reference year (`11240cb0...`).

### Failure / unverified
- Fresh CI/Pages result for `11240cb0...` has not yet been observed.
- Previous handoff claimed `ddcb3f55...` supplied all-record live verification, but current workflow content did not show it; this run corrected the repository rather than trusting that stale claim.
- CSV live validation currently checks non-empty comma-delimited shape, not semantic identity columns/values.

### Open checks / fixes
1. Observe the Pages run containing `11240cb0...`; require deploy + `verify-live` success and commit-exact `release-sha.txt` convergence.
2. If the new verifier fails, fix the specific broken advertised endpoint/index record; do not weaken the gate.
3. Strengthen CSV semantic verification only after inspecting the normalized CSV schema: require expected identity columns and compare indicator/entity/reference year where represented.
4. Audit REAL population human pages for canonical/meta/human-visible provenance consistency; fix concrete defects only.
5. Keep the existing Playwright 360–430px live browser smoke green.
6. For future `IT.NET.USER.ZS`, require exact WDI/ITU source attribution, observation year vs retrieval date distinction, `% of population` unit, applicable license/citation requirements, JSON/CSV from the same normalized record, and no archive-revision language.
7. Do not reopen GDP by inference.

### Recommended additional task
After the new semantic live verifier is green, inspect the actual evidence CSV schema and extend the same parent-record identity check to CSV without assuming columns that do not exist. This completes semantic integrity for both advertised machine formats while preserving fail-closed behavior.
