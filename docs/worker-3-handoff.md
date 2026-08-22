# Worker 3 handoff — Search, GEO and AI discovery hardening

## Handoff chain consumed

Worker 1 (`cbfa901b158970ff36c7566532e8d338405ad4e5`) established that `NY.GDP.MKTP.KD` exists in both screened 2025 WDI archives but that release-specific base-year/valuation comparability cannot be inferred from code identity/current metadata. Worker 2 built the transparent `/indicators/real-gdp/` screening page and kept real GDP revision publication fail-closed.

Worker 2 subsequently closed the methodology task decisively: official World Bank archive guidance/current metadata do not independently prove release-specific comparability for the 2025-01-28 and 2025-07-02 archive pair. The product decision recorded on current main is to stop spending cycles trying to infer comparability for this pair, keep the screening/provenance path transparent, and move expansion to a methodologically simpler independently screened indicator unless a new authoritative release-specific artifact appears.

Worker 2 also documented earlier CI/live uncertainty. That uncertainty was partially resolved later: the user supplied direct GitHub Actions evidence showing Pages workflow #77 green for `3bc47f4...` and #78 green for `aced4b6...`; later release engineering added a commit-exact `release-sha.txt` verification path. Do not generalize those green runs to later commits without fresh CI/deploy evidence.

## Worker 3 implementation already completed

1. **Sitemap/index hardening** — `d0f1f67321872181997833fd2f2c5991b426f48b`
   - Build checks static routes exist before adding them to sitemap.
   - Removed nonexistent `/indicators/population-total/`.
   - Demo evidence is excluded from generated sitemap and machine index.

2. **Machine-readable GDP screening status** — `f80e669c573cff0a71f26038c234c9690fbed30d`
   - Added `/indicators/real-gdp/status.json` containing status/provenance only; no unverified GDP revision values or REAL CSV.

3. **GDP structured-data correctness** — `f0d36b2fe1ab7723bfca4451e972f0780766e9e4`
   - GDP screening page changed from misleading `Dataset` JSON-LD to `WebPage`.

4. **README trust refresh** — `65352b6b33f9f10493124a3afef44e60e7f663aa`
   - Removed stale claim that visible evidence was still only demo.

5. **Regression hardening / sitemap cleanup** — `2551b38a5777f9dd4ae3cabb635df734fb9c31ad`, `eadfa238997283093209f14cb4ac1b8da7e4b76c`
   - Tests reject demo/nonexistent routes; checked-in sitemap corrected.

6. **Verified Germany Dataset schema** — `08c704749f23126dcf88200a7de6bc66f4f84406`, `be5eaa179c14a728b37ceae0980c9a74ab6b9115`
   - Added source-faithful Dataset JSON-LD only after validating the REAL Germany evidence payload and JSON/CSV distributions.

7. **Machine discovery index enrichment** — `3bc47f498a7f3319619a33c69b9e073fd0b22de1`, `aced4b62d50d668275b95d8f9d3c309356333610`
   - `/evidence/index.json` schema 1.1 gained REAL indicator/entity/reference-year/vintage/provenance/methodology/license and stable JSON/CSV paths.
   - Non-REAL payloads fail closed from discovery even when HTML lacks a DEMO marker.
   - Direct GitHub Actions evidence later showed Pages runs #77/#78 green for these commits.

## This run — new concrete discovery hardening

8. **Fail closed on incomplete machine evidence** — `da279cbce6cbe71a06141f5571658804e82f1f6d`
   - Found a latent machine-discovery weakness: the collection index constructed `evidence.json` and `evidence.csv` URLs mechanically for every otherwise-indexable page, without first proving both files exist or that the REAL payload carries complete provenance/methodology fields.
   - `scripts/build-site.js` now validates REAL evidence before it may enter sitemap or `/evidence/index.json`.
   - Required fields: indicator code/name/unit/methodologyVersion; entity code/name/type; integer reference year; first/latest vintage and valid HTTP(S) source URLs; methodology note; license; actual `evidence.json` and `evidence.csv` files.
   - Pages that are neither demo nor noindex but fail this discovery-completeness gate are excluded from preferred machine discovery instead of advertising broken or under-specified endpoints.
   - `/evidence/index.json` schema is now `1.2` and marks emitted records `discoveryReady: true`.
   - `site/build.json` now records `discoveryIncompleteExcluded` for release QA.

9. **Regression tests for discovery completeness** — `55ce36e39b58a51fb88adaa780091eed9d9603cf`
   - Build tests now require every emitted machine record to be REAL, discovery-ready, backed by JSON/CSV, carry methodology/provenance/license and two source vintages, while preserving existing demo/noindex/nonexistent-route exclusions.

10. **README aligned with closed GDP decision and new discovery rule** — `048939b44aa1ac871287e39622c57056ce76fec4`
   - README no longer frames independent resolution of the screened real-GDP pair as the next product milestone.
   - It now records the decisive fail-closed decision and says expansion should move to the next methodologically verifiable indicator unless new release-specific authoritative evidence appears.
   - Search/AI section now accurately states that demo, noindex, absent and discovery-incomplete evidence are excluded from preferred discovery.

## Reproducible evidence / concrete defects

- Germany REAL payload explicitly contains `SP.POP.TOTL`, DEU/Germany, reference year 2023, methodology version, both official WDI archive URLs, methodology note and license; its JSON and CSV files exist. This is the reference record for the discovery-completeness contract.
- The old machine-index implementation advertised JSON/CSV paths by string construction alone. The new build verifies the files and source metadata before exposing the record.
- GDP screening remains status-only/fail-closed. Do not add revision values, Dataset schema or CSV for the screened pair unless a new authoritative release-specific comparability artifact changes the methodology decision.
- Demo/noindex evidence remains excluded from generated sitemap/index; the known Germany GDP-growth fixture is explicitly demo/noindex.

## Verification / failures

- Local clone/test remains unavailable in this automation runtime because DNS cannot resolve `github.com`; this is an environment failure, not a repository test failure.
- Direct GitHub Actions evidence from the user previously proved Pages #77/#78 green for `3bc47f4...` and `aced4b6...`.
- Fresh combined-status lookup for the newest README commit returned no statuses. Therefore CI/deploy for `da279cb...`, `55ce36e...` and `048939b...` is **not yet claimed green** in this handoff.
- Current main also contains later release/methodology coordination commits including `418ddf07...`; worker 4 should verify the final head rather than an older intermediate SHA.

## HANDOFF AN WORKER 4

### Success
- Verified population evidence has canonical human pages plus source-backed JSON/CSV.
- Germany has validated Dataset JSON-LD.
- Machine collection index is enriched and now fails closed on incomplete provenance or missing JSON/CSV.
- Demo/noindex/nonexistent/discovery-incomplete evidence is not preferred via sitemap/machine index.
- GDP screening is transparently status-only and the 2025 pair is decisively methodology-blocked.
- README is aligned with repository evidence and current product decision.

### Failure / unverified
- Current-head CI and commit-exact Pages deployment have not been observed from this run.
- Automation runtime still cannot clone GitHub, so local `npm test` / `npm run build` could not be executed here.
- Full browser/mobile CI remains owned by Worker 4/WD-005; do not duplicate with speculative manual rendering.

### Open checks / fixes
1. Run/observe CI for a head containing `da279cb...`, `55ce36e...` and `048939b...`; require `npm test` and build success.
2. Verify generated `/evidence/index.json` is schema `1.2`, every record has `discoveryReady: true`, and `build.json.discoveryIncompleteExcluded` is present.
3. Commit-exact live smoke: `release-sha.txt` must equal deployed `GITHUB_SHA`, then verify `robots.txt → sitemap.xml → /evidence/ → /evidence/index.json → Germany evidence → evidence.json/evidence.csv` and `Indicators → Real GDP → status.json` all resolve consistently.
4. Check that all advertised machine-readable JSON/CSV URLs return 200. The new build prevents missing local files, but live deployment still needs release verification.
5. Audit whether any REAL population page lacks canonical/meta or human-visible provenance even though its payload is machine-complete; fix source/page rather than weakening the gate.
6. Continue automated 360–430 px browser smoke under WD-005; preserve Worker 2's mobile/table accessibility work.
7. Do not reopen the GDP pair by inference. Only a genuinely new release-specific authoritative methodology artifact should change that decision.

### Recommended additional task
Add a release-level assertion that fetches every machine-readable URL emitted in `/evidence/index.json` after Pages deploy and requires HTTP 200 plus the expected content type/body shape. This converts the new build-time file-existence guarantee into an end-to-end live discovery guarantee without weakening fail-closed filtering.
