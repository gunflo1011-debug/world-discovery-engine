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
9. Live mobile browser coverage at 360/390/430px covers Home, Indicators, Real GDP, Germany and United States REAL evidence with overflow/nav/error/canonical/title/description/focus assertions.
10. REAL evidence browser checks require visible `evidence.json` and `evidence.csv` links and follow both, proving human-page → machine-evidence crawlability.
11. Commit `7b745db569bc98b4550dae9c33df3f8b09b3ddc9` strengthens that browser proof: Germany and United States routes declare expected indicator/entity/reference-year identity, and Playwright verifies linked JSON/CSV against it.
12. Commit `fa27c9c99477d28aa9b1f8f466e60f7e906c53ab` extends the source-faithful Dataset JSON-LD pattern to United States after verifying its REAL payload has the same core provenance fields as Germany. The schema uses only evidenced facts: SP.POP.TOTL, USA, 2023, the two official WDI archive URLs, unit people, and the page's JSON/CSV distributions.
13. Commit `0ed6d5b6147ad6cd551391da1d0fb7cf6ae21f4b` extends build regression coverage so both Germany and United States REAL pages must retain Dataset JSON-LD, SP.POP.TOTL and their own JSON/CSV distribution URLs.

## Reproducible evidence / concrete defects

- Germany REAL payload contains `SP.POP.TOTL`, DEU/Germany, reference year 2023, methodology version, both official WDI archive URLs, methodology note and license; JSON and CSV exist.
- United States REAL payload independently contains `SP.POP.TOTL`, USA/United States, reference year 2023, the same methodology version, both official WDI archive URLs, methodology note and CC BY 4.0 attribution; its human page has an absolute canonical, factual meta description, visible provenance and explicit JSON/CSV links.
- Build-time machine discovery fails closed when REAL evidence lacks required provenance or JSON/CSV files.
- GDP screening remains status-only/fail-closed. Do not add revision values, Dataset schema or CSV for the screened pair absent new authoritative release-specific comparability evidence.

## Verification / failures

- Direct user evidence previously proved Pages #77/#78 green for `3bc47f4...` and `aced4b6...`.
- Fresh Actions/Pages result for the newer browser semantic checks and the new US Dataset commits has not been observed through this connector. Do not claim them green/live until a deploy + verify-live run completes for a descendant containing them.
- Attempt to enumerate Actions runs through generic GitHub fetch was rejected by connector URL restrictions; this is tooling visibility, not a repo failure.

## HANDOFF AN WORKER 4

### Success
- Verified population evidence has canonical human pages plus source-backed JSON/CSV.
- Germany and United States now both have source-faithful Dataset JSON-LD with machine distributions.
- Regression coverage requires both pages to retain Dataset schema, indicator identity and their own JSON/CSV distribution URLs.
- Machine collection index and live workflow fail closed on incomplete/broken machine evidence.
- Demo/noindex/nonexistent/discovery-incomplete evidence is not preferred via sitemap/machine index.
- GDP screening is transparently status-only and the screened 2025 pair remains methodology-blocked.
- README is aligned with repo evidence/product decision.

### Failure / unverified
- Fresh CI/Pages result for `7b745db...`, `fa27c9c...`, `0ed6d5b...` or a descendant has not been observed through this connector.
- Generic Actions-run enumeration was blocked by connector URL policy.

### Open checks / fixes
1. Observe a Pages run containing `0ed6d5b...`; require deploy + verify-live success and commit-exact `release-sha.txt` convergence.
2. If browser/build tests fail, fix the concrete schema/link/viewport defect; do not weaken the evidence gates.
3. Add a semantic JSON-LD regression check that parses the Dataset object rather than relying only on regex and confirms `identifier`, `variableMeasured.propertyID`, `spatialCoverage.name`, `isBasedOn` and each `distribution.contentUrl` agree with the corresponding evidence payload/page.
4. Audit a third REAL population page before expanding Dataset JSON-LD broadly; only roll out where provenance fields are equivalent.
5. For future `IT.NET.USER.ZS`, require exact WDI/ITU attribution, observation year vs retrieval date distinction, `% of population` unit, license/citation requirements, JSON/CSV from the same normalized record, and no archive-revision language.
6. Do not reopen GDP by inference.

### Recommended additional task
Create one reusable source-faithful Dataset-schema generator/test driven from `evidence.json`, so future REAL pages cannot drift between human metadata, JSON-LD and machine evidence through copy/paste. Keep generation fail-closed when required provenance is absent.
