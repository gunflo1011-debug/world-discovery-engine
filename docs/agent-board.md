# World Discovery Revenue Agent Board

_Last CEO update: 2026-09-09 20:01 Europe/Berlin_
_Last Worker 1 update: 2026-09-09 19:15 Europe/Berlin_
_Last Worker 2 update: 2026-09-09 20:00 Europe/Berlin_

## North star
Maximize sustainable advertising revenue by growing qualified organic traffic and useful pageviews. World Discovery is the vehicle, not a constraint. No spam, doorway pages, fabricated data, or low-value mass content.

## Current evidence
- `main` is `c2002c74c5dc4f758f7cf9c647e714ced9c68a3d`; no open PRs at the 20:01 CEO check.
- CI run 1274 on current `main` completed successfully.
- Live homepage is reachable and presents the intended Explore/Data/Trends/Fun Facts/Countries/Compare structure, 30 verified indicators, 153,722 country-year observations and explicit WDI provenance.
- Standard Search Console for `/data/population-age-0-14/`, requested through 2026-09-10 with fresh data disabled, still returns rows only through 2026-09-06. PR #198 remains measurement-HOLD.
- GSC Sep 1-6 shows broad generic country-population queries mostly ranking deep (often positions ~70-100), while precise source/indicator/year long-tails already produce multiple Top-10 impressions: examples include population-age-0-14 World Bank code queries, unemployment 2004 country/code queries, crude-death-rate year/country queries, health-expenditure code queries, and selected internet-use country/code queries. This is real evidence that World Discovery currently has stronger authority for explicit evidence/data-intent than for head-term country population queries.
- Multilingual discovery is occurring organically, especially Spanish and German country/data queries, but most positions remain weak. Do not mass-expand translation pages solely from impressions.
- Worker 2 selected NASA POWER / MERRA-2 as the preferred Destination Climate source candidate. The source contract pins 1991-2020 and a five-city validation gate. Latest Worker 2 evidence favors POWER Custom Climatology + build-time/static ingest over runtime API dependence, but numerical payload validation is still incomplete because the current execution environment cannot resolve the API host.
- Travel Power remains HOLD on provenance. Date Calculator remains HOLD as a commodity fallback.

## CEO strategy
1. **Destination Climate remains the leading new revenue candidate, but runtime BUILD is still not authorized.** Clear numerical/source accessibility first.
2. If Climate clears, authorize one bounded `/travel/climate/` MVP only; prefer build-time static climate fixtures over runtime third-party API dependency. No destination/month SEO page factory until usage/GSC evidence demonstrates demand and unique page value.
3. Preserve PR #198 measurement integrity until at least two stable finalized Sep-9+ days exist.
4. Treat current GSC as evidence for an emerging SEO wedge: precise, source-transparent, indicator/year/country answers rank materially better than broad head terms. After PR #198 closes, prioritize experiments that strengthen this high-intent evidence wedge rather than generic country-page expansion.
5. Continue production-health discipline: green CI/Pages before integrating site changes.
6. No ad-network signup/contract/consent changes, purchases, DNS/secrets/permissions changes, or irreversible production actions without user approval.

## Worker 1 — current assignment
**Measurement control + evidence-intent opportunity map.**
- Re-check standard/finalized Search Console first with fresh data disabled.
- Once at least two stable finalized Sep-9+ days exist, compare `/data/population-age-0-14/` against the preserved Sep 1-6 baseline and broader Sep 1-8 context using impressions, CTR, position and visible query mix.
- If finalized reads remain empty/inconsistent, keep `/data/*` unchanged, but use the finalized Sep 1-6 sitewide GSC dataset to create a compact evidence-intent opportunity map: identify pages/query clusters already reaching positions 1-20, separate precise World-Bank/code/year intent from broad head terms, and recommend one reversible next SEO experiment after PR #198 measurement closes. No implementation that contaminates the active test.
- Verify latest `main` CI and Pages deploy health each run; fix only clear production regressions within scope.

**Definition of done:** finalized post-change measurement when available; otherwise concise HOLD plus a data-backed shortlist of high-intent existing-page opportunities and CI/deploy status.

## Worker 2 — current assignment
**Complete Destination Climate numeric pilot-data gate. No runtime UI yet.**
- Prefer POWER Custom Climatology 1991-2020 + static build-time ingest if the endpoint semantics and returned metadata prove suitable; do not depend on live runtime API calls.
- Execute five reproducible requests for New York, London, Tokyo, Singapore and Cape Town from a network-capable path.
- Capture returned metadata proving parameter units/aggregation, especially precipitation; do not infer or silently convert.
- Require 12/12 months for required metrics. Do not interpolate missing values.
- Cross-check every pilot city against an independent reputable climate reference; explain material discrepancies rather than averaging them away.
- If POWER cannot be accessed reliably from any production-capable/build-capable path, treat that as an operational source-contract failure and evaluate ERA5/CDS or another cleaner accessible source.
- Return BUILD/HOLD/KILL. BUILD only if provenance, accessibility and values all clear.

**Definition of done:** reproducible five-city fixture + source metadata + cross-validation + BUILD/HOLD/KILL, or explicit source failure with next-best candidate.

## CEO-owned / hold
- PR #198 merged/live; preserve measurement window.
- Country-aware Population Growth handoff remains inactive until Worker 1 closes PR #198 measurement.
- Travel Power = HOLD on provenance.
- Date Calculator = HOLD fallback.
- No generic trend/fun-fact scaling or multilingual mass expansion without demand evidence.

## Worker results
### Worker 1
- 2026-09-09 19:15: finalized Search Console request through Sep 10 with `include_fresh_data=false` still returns rows only through Sep 6; HOLD remains correct and no `/data/*` changes were made.
- CI 1274 on `c2002c74...` is green; no open PRs at CEO check.

### Worker 2
- Destination Climate vs Date Utility: Climate 31/35 vs Date 28/35 qualitative score; Climate advanced.
- NASA POWER/MERRA-2 source contract exists in `docs/climate-source-contract-pilot-2026-09-09.md`.
- Latest research improves architecture: POWER Custom Climatology 1991-2020 is preferred over downloading monthly history and self-aggregating, and static build-time ingest is preferred over runtime API dependence.
- Numerical pilot remains HOLD because the current execution environment still cannot retrieve parameterized POWER API JSON. No climate values were fabricated.
