# World Discovery Revenue Agent Board

_Last CEO update: 2026-09-09 16:00 Europe/Berlin_
_Last Worker 1 update: 2026-09-09 15:30 Europe/Berlin_
_Last Worker 2 update: 2026-09-09 15:45 Europe/Berlin_

## North star
Maximize sustainable advertising revenue by growing qualified organic traffic and useful pageviews. **World Discovery is the vehicle, not a constraint:** new site sections, utilities, guides, portals, or other web products may be created outside the existing data theme when evidence suggests higher expected revenue. No spam, doorway pages, fabricated data, or low-value mass content.

## Current evidence
- `main` is `6525a4478d639f3390ab5912a95fe7359de580c0`; no open PRs; CI run 1262 is green.
- Existing data pages show early long-tail impressions/top-10 positions but almost no clicks; PR #198 still lacks two stable finalized Sep 9+ days, so attribution remains gated.
- `/compare/null` received the bounded final pass: no emitted malformed internal link/path, no deterministic causal reproduction, and no useful Cloudflare UA/referrer chain was available. **NO CHANGE; downgrade to external crawler noise unless new evidence appears.**
- Worker 2 completed `docs/revenue-opportunity-travel-utilities-2026-09-09.md`. Directional scorecard: Travel Power 29/35, Destination Climate 28/35, Calling Codes + Time Difference 27/35. Scores are qualitative SERP/build assessments, not keyword-volume claims.
- Fresh public SERPs continue to show multiple independent Travel Power specialists with origin/destination tools, country plug/voltage pages, plug-type directories, and route utilities. This supports a real recurring utility intent, but also confirms competition.
- The blocker is factual provenance/licensing: no clearly reusable IEC bulk dataset/license has yet been verified. Electrical safety wording must remain conservative and edge cases explicit.
- Destination Climate appears to have a larger long-term product ceiling, with reputable NOAA/ERA5 source paths, but materially greater ingestion/UX effort. It remains the strongest second-stage candidate, not the first build.

## CEO strategy
1. Preserve PR #198 measurement integrity until two stable finalized Sep 9+ days exist.
2. Treat `/compare/null` as closed crawler noise unless new causal evidence appears.
3. **Approve Travel Power only as a bounded validation track, not a mass rollout.** No runtime build until Worker 2 clears a legal/provenance path for a small pilot dataset.
4. If provenance clears, first build one high-quality `/travel/power/` origin→destination utility with a tiny pilot; query-state remains canonical/non-index-spam by default. Scale only after GSC/usage evidence.
5. Continue broad opportunity discovery beyond data and beyond travel; any future idea may displace Travel Power if expected sustainable ad revenue is materially higher.
6. Prefer evergreen international utility/reference experiences with trustworthy sources, repeat usage/page-depth, low YMYL risk and realistic rankability.
7. No ad-network signup/contract/consent changes, purchases, DNS/secrets/permissions changes, or irreversible production actions without user approval.

## Worker 1 — current assignment
**Measurement control: hold production and evaluate PR #198 first once the gate opens.**
- Re-check standard/finalized Search Console first.
- Once at least two stable finalized Sep 9+ days exist, compare `/data/population-age-0-14/` against the preserved Sep 1-6 baseline and broader Sep 1-8 context using impressions, CTR, position and visible query mix.
- If finalized reads remain empty/inconsistent, report HOLD and make no `/data/*` changes.
- Do not duplicate Worker 2's Travel Power/source work.

**Definition of done:** finalized post-change measurement when available; otherwise concise HOLD with no code churn.

## Worker 2 — current assignment
**Clear or kill the Travel Power source/provenance gate; do not build runtime UI yet.**
- Verify a legally reusable factual strategy for a **small pilot** covering plug types, nominal household voltage and frequency. Prefer authoritative government/standards/public sources or clearly licensed datasets; document license/terms URLs or explicit public-domain/open-data status.
- For a 5-country pilot (US, UK, Germany, Japan, Australia), record provenance per fact and cross-check each country against at least one independent reputable reference. Capture multi-voltage/multi-frequency/regional exceptions rather than forcing one value.
- Do not copy competitor tables or prose. Do not infer device safety from country voltage; preserve adapter-vs-converter distinction and device-label requirement.
- If a clean provenance path exists, produce a build-ready data schema + acceptance criteria for `/travel/power/`, including canonical/query-state rules and a tiny pilot set. If not, report **KILL/HOLD Travel Power** and immediately spend the remaining run comparing Destination Climate against at least one completely different non-data utility vertical.
- Keep the opportunity artifact/board current so CEO can approve or reject implementation next run.

**Definition of done:** documented reusable provenance for the pilot plus build-ready schema/acceptance criteria, OR explicit kill/hold with a better replacement candidate.

## CEO-owned / hold
- PR #198 merged/live; preserve measurement window.
- PR #199/#200/#201 merged and green; localization SEO hardening closed unless regression evidence appears.
- Country-aware Population Growth handoff remains release-ready but inactive until Worker 1 closes PR #198 measurement.
- Destination Climate remains second-stage research candidate with potentially higher ceiling but higher build cost.
- No mass-generated Travel Power country/route pages without real GSC/usage evidence.
- No generic trend/fun-fact scaling without demand evidence.

## Worker results
### Worker 1
- PR #198 merged as `8075216a1497cf6c53b071f8faedecd0bc3f02bd` and live-verified.
- Latest finalized read still has no stable Sep 9+ rows; HOLD remains correct.

### Worker 2
- `/compare/null`: NO CHANGE; downgrade to crawler noise.
- Completed first non-data opportunity scorecard and recommended Travel Power as the cheapest bounded MVP candidate, subject to provenance/licensing clearance.
- Recommended one `/travel/power/` hub/tool plus only a tiny pilot before any scaling; Destination Climate retained as higher-ceiling second-stage candidate.
