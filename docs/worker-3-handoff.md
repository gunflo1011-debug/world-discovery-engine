# Worker 3 handoff — Search, GEO and AI discovery hardening

## Handoff chain consumed

Worker 1 (`cbfa901b158970ff36c7566532e8d338405ad4e5`) established that `NY.GDP.MKTP.KD` exists in both screened 2025 WDI archives but release-specific base-year/valuation comparability cannot be inferred from code identity/current metadata. Worker 2 built the transparent `/indicators/real-gdp/` screening page and kept real GDP revision publication fail-closed. Worker 2 later closed that methodology task decisively: do not spend more cycles inferring comparability for this archive pair; only genuinely new release-specific authoritative evidence should reopen it.

Worker 2 also nominated `IT.NET.USER.ZS` (Individuals using the Internet, % of population) as the next current/latest-value vertical on current main (`7945c1e2...`). That is a GO only for current/latest verified observations with ITU/WDI attribution, observation year, retrieval provenance, unit and license; it is NOT a GO for archive-revision claims.

Earlier CI uncertainty was partially resolved by direct user evidence: GitHub Pages workflow #77 was green for `3bc47f4...` and #78 green for `aced4b6...`. Do not generalize those runs to later commits without fresh evidence.

## Worker 3 implementation completed

1. Sitemap/index hardening (`d0f1f673...`): static routes must exist; nonexistent `/indicators/population-total/` removed; demo evidence excluded from generated sitemap and machine index.
2. Machine-readable GDP screening status (`f80e669c...`): `/indicators/real-gdp/status.json` contains status/provenance only, no unverified revision values or REAL CSV.
3. GDP structured-data correction (`f0d36b2f...`): screening page uses `WebPage`, not misleading `Dataset` schema.
4. README trust refresh (`65352b6b...`): removed stale claim that visible evidence was only demo.
5. Regression/sitemap cleanup (`2551b38a...`, `eadfa238...`): tests reject demo/nonexistent routes; checked-in sitemap corrected.
6. Verified Germany Dataset schema (`08c70474...`, `be5eaa17...`): source-faithful Dataset JSON-LD after validating REAL payload and JSON/CSV distributions.
7. Machine discovery index enrichment (`3bc47f49...`, `aced4b62...`): schema 1.1 added REAL indicator/entity/reference-year/vintage/provenance/methodology/license and stable JSON/CSV paths; non-REAL payloads fail closed. User later showed Pages #77/#78 green for these commits.
8. Fail closed on incomplete machine evidence (`da279cbc...`): REAL evidence may enter sitemap/index only when `evidence.json` + `evidence.csv` exist and required indicator/entity/reference-year/vintage/source/methodology/license fields are complete. Machine index schema is 1.2 with `discoveryReady: true`; `build.json` counts `discoveryIncompleteExcluded`.
9. Regression tests (`55ce36e3...`): every emitted machine record must be REAL, discovery-ready, JSON/CSV-backed and carry methodology/provenance/license plus source vintages.
10. README alignment (`048939b4...`): screened GDP pair is decisively fail-closed; expansion moves to a methodologically verifiable indicator unless new authoritative release-specific evidence appears.
11. **Live distribution verification (`ddcb3f55...`)**: upgraded the Pages `verify-live` job from checking only Germany's advertised JSON/CSV to iterating over **every record emitted by live `/evidence/index.json`**. The job now requires schema 1.2, `status=REAL`, `discoveryReady=true`, both JSON+CSV distributions for every record, HTTP success/non-empty bodies for every advertised URL, parseable JSON object bodies and comma-delimited CSV header shape. Germany `SP.POP.TOTL`/DEU remains an explicit sentinel. This closes the prior gap between build-time file existence and live-time machine-discovery integrity.

## Reproducible evidence / concrete defects

- Germany REAL payload contains `SP.POP.TOTL`, DEU/Germany, reference year 2023, methodology version, both official WDI archive URLs, methodology note and license; JSON and CSV exist.
- The old machine-index implementation advertised JSON/CSV paths by construction; build now validates completeness before exposure.
- Before `ddcb3f55...`, the live workflow fetched only the Germany distributions even though the index can advertise many records. A broken non-Germany machine endpoint could therefore deploy green. The workflow now enumerates all live index records and verifies every advertised distribution.
- GDP screening remains status-only/fail-closed. Do not add revision values, Dataset schema or CSV for the screened pair absent new authoritative release-specific comparability evidence.
- Demo/noindex evidence remains excluded from generated sitemap/index; known Germany GDP-growth fixture is demo/noindex.

## Verification / failures

- Direct user evidence previously proved Pages #77/#78 green for `3bc47f4...` and `aced4b6...`.
- Current `.github/workflows/pages.yml` already had commit-exact `release-sha.txt`, critical live route checks, schema-1.2 validation, homepage canonical, robots/sitemap checks before this run; those were consumed rather than duplicated.
- The new all-record live verification commit `ddcb3f55...` has been pushed but its fresh Actions result has not yet been observed in this run. Do not claim it green until the workflow completes.
- Local clone/test remains unavailable in the automation runtime; GitHub connector writes are working, but no local `npm test`/build was executed here.

## HANDOFF AN WORKER 4

### Success
- Verified population evidence has canonical human pages plus source-backed JSON/CSV.
- Germany has validated Dataset JSON-LD.
- Machine collection index fails closed on incomplete provenance or missing JSON/CSV.
- Demo/noindex/nonexistent/discovery-incomplete evidence is not preferred via sitemap/machine index.
- GDP screening is transparently status-only and the screened 2025 pair is decisively methodology-blocked.
- README is aligned with repo evidence/product decision.
- Pages workflow now verifies every machine-readable distribution advertised by the live index, not just Germany.
- Worker 2's next candidate is `IT.NET.USER.ZS`, but only for current/latest verified observations; preserve the no-revision constraint.

### Failure / unverified
- Fresh CI/Pages result for `ddcb3f55...` has not yet been observed.
- Full 360–430px browser CI remains a Worker-4/WD-005 concern.
- The all-record live check validates JSON parseability and CSV header shape, but does not yet compare each distribution's semantic identity (indicator/entity/year) back to its parent index record.

### Open checks / fixes
1. Observe the Pages run containing `ddcb3f55...`; require deploy + `verify-live` success and commit-exact `release-sha.txt` convergence.
2. Confirm live `/evidence/index.json` schema 1.2 and that all emitted records pass the new all-distribution verifier.
3. If the new verifier fails, fix the specific broken advertised endpoint or index record; do not weaken the gate.
4. Consider strengthening live semantic verification: for each JSON distribution, compare indicator code, entity code and reference year to its index record; for CSV, require expected identity/value columns rather than only comma-delimited shape.
5. Audit any REAL population human page that is machine-complete but lacks canonical/meta/human-visible provenance; fix source/page, not the gate.
6. Continue automated 360–430px browser smoke under WD-005.
7. For `IT.NET.USER.ZS`, require exact WDI/ITU source attribution, observation year vs retrieval date distinction, `% of population` unit, CC BY-4.0/ITU citation requirements, JSON/CSV from the same normalized record, and no archive-revision language.
8. Do not reopen GDP by inference.

### Recommended additional task
When the `IT.NET.USER.ZS` current-state slice is implemented, extend the live machine verifier so each emitted JSON payload is semantically cross-checked against its parent index record (indicator code, entity code, reference year). This will detect a 200/valid-JSON endpoint serving the wrong evidence, completing the chain from source normalization → build-time discovery gate → deployed index → live payload identity.
