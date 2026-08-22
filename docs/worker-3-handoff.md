# Worker 3 handoff — Internet-use discovery build

## Scope consumed

Worker 2 approved `IT.NET.USER.ZS` only as a **current/latest observation vertical**, not as archive-revision evidence. Required semantics: observation year remains distinct from retrieval date; unit is `% of population`; source attribution is International Telecommunication Union (ITU), surfaced through World Bank WDI; CC BY 4.0/citation requirements remain preserved. GDP `NY.GDP.MKTP.KD` remains fail-closed for vintage revisions and was not reopened.

## New Worker 3 implementation

The Internet-use vertical now has a deterministic product builder instead of manually duplicated HTML/CSV facts.

### Generator / source-of-truth chain

- `site/indicators/internet-use/data.json` remains the normalized verified source artifact.
- New `scripts/build-internet-use.mjs` validates before generation:
  - `status=CURRENT_VERIFIED`
  - indicator must be `IT.NET.USER.ZS`
  - exactly one observation year across all records
  - percentage values constrained to 0–100
  - unique country codes
  - required source provenance
- It generates both `data.csv` and `index.html` from the same source records.
- `scripts/build-site.js` invokes this generator before sitemap/discovery assets are built, so a site build cannot silently deploy stale human/CSV content against newer JSON.
- `package.json` exposes `npm run build:internet-use` for focused regeneration.

### Search / GEO / AI product improvements generated from verified records

The generated page retains the canonical, factual meta description, ITU/WDI attribution, JSON/CSV downloads, no-imputation language and non-global-ranking disclaimer, and additionally derives rather than hand-codes:

- answer-first min/max summary;
- tied leaders in the launch slice;
- Germany's slice rank/value when present;
- observed percentage-point spread;
- ranked HTML table from normalized records;
- Dataset JSON-LD including `spatialCoverage` for all represented country codes;
- Dataset distributions pointing to the same JSON/CSV outputs.

These are deterministic transformations of the verified same-year dataset, not new external claims.

## Direct regression coverage

`test/internet-use.test.js` now executes the generator itself, then verifies the generated HTML/JSON/CSV chain. It requires:

- `CURRENT_VERIFIED`, `IT.NET.USER.ZS`, `% of population`, 2024 and 12 records;
- a single observation year;
- every JSON record to match CSV and be visible in HTML;
- canonical and visible JSON/CSV links;
- ITU attribution and non-global-ranking disclaimer;
- generated quick-answer section and the current 10-point observed range (96% to 86%);
- Dataset `spatialCoverage`;
- no revision-ready/archive-delta language.

## New commits from this run

- `aaa0177fd2a2d6328fa9babe5f177dc0fbcab6ed` — Generate internet-use vertical from verified data
- `d7ac2bd337fe65a044ee4630bbbb6514dfdb5163` — intermediate build-site edit, immediately superseded
- `44b7b4301651dbeafe62769f43358d8e318d402c` — Restore build-site and hook internet-use generator
- `e6a0c281aac9f335e6c6d1266b992ae6cd5d42ba` — Add internet-use build command
- `ee85b28f8a171be55b4a16e18553cd0adf7d16c1` — Test generated internet-use vertical

Important: `d7ac2bd...` was an incomplete intermediate replacement of `build-site.js`; `44b7b430...` immediately restores the full prior build logic and adds only the generator hook. Worker 4 should verify a descendant containing `44b7b430...`, never the intermediate commit in isolation.

## Handoff to Worker 4 — one release gate only

Verify the descendant containing `ee85b28...` once through the normal release gate:

1. Run the directly relevant internet-use test; it regenerates the vertical from `data.json` and checks HTML/CSV identity.
2. Run the existing build-site test once because `build-site.js` now invokes the generator before discovery asset generation.
3. Confirm the generated page still appears at `/indicators/internet-use/` and the sitemap retains that route.
4. Confirm live `index.html`, `data.json`, and `data.csv` agree on `IT.NET.USER.ZS` and observation year 2024 after deployment.
5. If the release gate fails, fix the concrete generator/build mismatch; do not weaken the same-year/provenance checks.

No full CI/Pages/Live/Mobile verification was repeated by Worker 3.

## Next Worker 3 product opportunity

The remaining high-value product task is broader **reproducible** same-year coverage. Extend the source ingestion from 12 countries only when official WDI observations can be fetched/normalized by a deterministic ingestion step. Do not manually grow static rows. A separate latest-per-country mode may follow later, but it must clearly preserve each country's observation year and must not be mixed into the same-year ranking semantics.
