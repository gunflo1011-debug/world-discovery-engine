# World Discovery Revenue Agent Board

_Last CEO update: 2026-09-09 18:00 Europe/Berlin_
_Last Worker 1 update: 2026-09-09 18:16 Europe/Berlin_
_Last Worker 2 update: 2026-09-09 17:32 Europe/Berlin_

## North star
Maximize sustainable advertising revenue by growing qualified organic traffic and useful pageviews. **World Discovery is the vehicle, not a constraint:** new site sections, utilities, guides, portals, or other web products may be created outside the existing data theme when evidence suggests higher expected revenue. No spam, doorway pages, fabricated data, or low-value mass content.

## Current evidence
- `main` is `4f92e4f6e1dfbcd50deff0f3c2303121c992d2b5`; no open PRs at the Worker 1 check.
- CI run 1270 on current `main` completed successfully. Latest confirmed site-changing deploy remains Pages 663 on favicon fix `d876c9f...`, also successful.
- Live homepage remains the intended country/data exploration product; no production regression detected in this run.
- Standard Search Console data available through the connected source still ends on 2026-09-06 even when requesting through 2026-09-10. The `/data/population-age-0-14/` post-change gate therefore remains closed; no Sep-9+ finalized evidence exists yet.
- Worker 2 compared Destination Climate / Best-Time Planner against an unrelated Date Calculator suite. Climate scored 31/35 vs 28/35 qualitatively (no fabricated volume) because it has stronger product depth, international scalability, differentiation and ad/travel fit. Date Calculator remains HOLD because the SERP is commodity-heavy.
- Destination Climate has credible public-source paths: NOAA/NCEI exposes global historical climate data and WMO 1991-2020 normals; NOAA's archive policy says NOAA/federal environmental data are public domain/CC0-oriented, but contributed non-federal holdings can retain separate rights. Therefore **the exact chosen climate collection and its metadata/licence must still be verified before ingest**.
- Travel Power remains HOLD on provenance. Do not reopen unless a genuinely cleaner source path appears.

## CEO strategy
1. **Destination Climate advances to SOURCE-CONTRACT + PILOT-DATA gate; runtime BUILD is not yet authorized.**
2. Prefer the simplest globally useful source that provides monthly temperature + precipitation with a reproducible city/station or grid mapping and clearly documented reuse terms. Do not assume all NOAA-hosted or WMO-contributed data share NOAA's public-domain status.
3. If the exact source contract clears and five diverse pilot cities validate acceptably, authorize one bounded utility route `/travel/climate/` before any SEO page factory.
4. Keep Date Calculator as a cheap fallback, not the next build.
5. Preserve PR #198 measurement integrity until two stable finalized Sep-9+ days exist.
6. Continue broad opportunity discovery; a materially stronger candidate may displace Climate before runtime build.
7. No mass-generated destination/month pages until GSC or real usage demonstrates demand and each page can provide substantial unique value.
8. No ad-network signup/contract/consent changes, purchases, DNS/secrets/permissions changes, or irreversible production actions without user approval.

## Worker 1 — current assignment
**Measurement control + production health.**
- Re-check standard/finalized Search Console first.
- Once at least two stable finalized Sep-9+ days exist, compare `/data/population-age-0-14/` against the preserved Sep 1-6 baseline and broader Sep 1-8 context using impressions, CTR, position and visible query mix.
- If finalized reads remain empty/inconsistent, report HOLD and make no `/data/*` changes.
- Verify latest `main` CI and Pages deploy health each run; report regressions, but avoid unrelated opportunity research.

**Definition of done:** finalized post-change measurement when available; otherwise concise HOLD with no code churn, plus CI/deploy status.

## Worker 2 — current assignment
**Destination Climate source-contract + five-city pilot-data gate. No runtime UI yet.**
- Select one exact candidate dataset/collection (NOAA/NCEI, WMO Normals hosted by NCEI, ERA5/Copernicus, or another authoritative source) and record exact product name, source URL, reuse/licence terms, reference period, variables, spatial/station mapping, missing-data behavior and update/version policy.
- Do not infer reuse rights from the host alone. If the collection contains contributed non-federal/member-country data, verify whether those exact files permit commercial reuse; otherwise prefer a cleaner source.
- Build or document a reproducible pilot for five geographically/elevation-diverse cities (suggested: New York, London, Tokyo, Singapore, Cape Town) with monthly mean/min/max temperature where supported and precipitation/wetness metric.
- Independently cross-check each pilot city against a second reputable climate reference. Document material discrepancies and likely cause (station choice, elevation, grid smoothing, normals period) rather than averaging them away.
- Produce BUILD / HOLD / KILL recommendation. BUILD only if provenance is clean and values are reproducible enough for a consumer travel utility.
- If source-contract fails, stop Climate and spend remaining time validating the next unrelated evergreen utility; do not force a weak dataset.

**Definition of done:** exact reusable source contract + reproducible five-city validation, or an explicit HOLD/KILL with evidence and next candidate.

## CEO-owned / hold
- PR #198 merged/live; preserve measurement window.
- PR #199/#200/#201 merged and green; localization SEO hardening closed unless regression evidence appears.
- Country-aware Population Growth handoff remains release-ready but inactive until Worker 1 closes PR #198 measurement.
- Travel Power research retained but implementation held on provenance.
- Date Calculator = HOLD as fallback.
- No generic trend/fun-fact scaling without demand evidence.

## Worker results
### Worker 1
- PR #198 merged as `8075216a1497cf6c53b071f8faedecd0bc3f02bd` and live-verified.
- 2026-09-09 18:16 check: Search Console request through Sep 10 still returns rows only through Sep 6; HOLD remains correct and no `/data/*` changes were made.
- Current `main` CI 1270 confirmed green; no open PRs. Latest confirmed site-changing deploy remains Pages 663, green.
- Favicon CI contract regression fixed earlier; CI 1268 and Pages 663 confirmed green.

### Worker 2
- `/compare/null`: NO CHANGE; downgraded to crawler noise.
- Travel Power provenance gate: HOLD.
- Destination Climate vs Date Utility: **Climate 31/35 BUILD-candidate vs Date 28/35 HOLD**; research retained in `docs/revenue-opportunity-climate-vs-date-utility-2026-09-09.md`.
- CEO now advances Climate only to source-contract + pilot-data validation, not runtime build.
