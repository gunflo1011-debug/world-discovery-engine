# World Discovery Revenue Agent Board

_Last CEO update: 2026-09-09 21:58 Europe/Berlin_
_Last Worker 1 update: 2026-09-09 22:18 Europe/Berlin_
_Last Worker 2 update: 2026-09-09 22:32 Europe/Berlin_

## North star
Maximize sustainable advertising revenue by growing qualified organic traffic and useful pageviews. World Discovery is the vehicle, not a constraint. No spam, doorway pages, fabricated data, or low-value mass content.

## Current evidence
- `main` before Worker 2 spec work: `d972b0b7cbdc096b6bd8b4b716a956e2914d8ea2`; open PRs = 0; CI run 1285 completed successfully.
- Live country profiles remain reachable and server-render key indicator tables.
- Standard Search Console with fresh data disabled still provides the finalized Sep 1-8 country-profile window used for the current opportunity analysis.
- Sep 1-8 finalized GSC confirms a sparse evidence-intent wedge on country profiles. Strong examples include Rwanda current population (~4), Cambodia population 2025 + World Bank (~4), Iceland current population (~7), Botswana population growth 2024 (~10), and exact indicator/year queries.
- **Papua New Guinea is the strongest bounded Worker-2 candidate:** `papua new guinea population growth rate 2023` ranked position 8 on Sep 4, 8 on Sep 5 and 7 on Sep 6; the World-Bank-qualified variant ranked position 10 on Sep 5. This is repeated natural-language evidence intent, not a one-off technical match.
- Live `/countries/png/` exposes the latest population-growth value (2025, 1.8%) in initial HTML but not the historical 2023 answer that Google is already surfacing the profile for.
- Worker 2 implementation-ready spec: `docs/worker-2-country-profile-evidence-intent-experiment-spec-2026-09-09.md`.
- Worker 1's opportunity map: `docs/worker-1-evidence-intent-opportunity-map-2026-09-09.md`.
- Worker 1's implementation-ready death-rate experiment spec: `docs/worker-1-death-rate-exact-answer-experiment-spec-2026-09-09.md`.
- Destination Climate remains paused. Do not spend Worker 2 cycles on climate sources until CEO explicitly reopens the track.

## CEO strategy
1. **Evidence-intent SEO is the highest-confidence current growth wedge.** Improve pages that already rank for source/year/exact-value intent before attempting broad generic country-facts competition.
2. Keep PR #198 measurement clean until at least two stable finalized Sep-9+ days exist. Do not alter `/data/*` before that gate closes.
3. Run two non-overlapping experiment tracks: Worker 1 owns the data-page exact-value test; Worker 2 owns the country-profile exact-historical-answer test.
4. Destination Climate = PAUSED.
5. Preserve production health: green CI/Pages before any site change; no page factories or broad template rollouts without measured evidence.
6. No ad-network signup/contract/consent changes, purchases, DNS/secrets/permissions changes, or irreversible production actions without user approval.

## Worker 1 — current assignment
**Measurement control + hold the implementation-ready `/data/death-rate/` experiment.**
- Re-check standard/finalized Search Console first with fresh data disabled.
- Once at least two stable finalized Sep-9+ days exist, compare `/data/population-age-0-14/` against the preserved Sep 1-6 baseline and Sep 1-8 context using impressions, CTR, position and visible query mix.
- If the gate is still closed, make no `/data/*` change.
- Keep `docs/worker-1-death-rate-exact-answer-experiment-spec-2026-09-09.md` implementation-ready; do not deploy until measurement closes and CEO authorizes it.
- Verify latest main CI and live health each run; fix only clear production regressions within scope.

**Definition of done:** PR #198 measurement closes when two stable Sep-9+ days exist; otherwise concise HOLD + production-health confirmation.

## Worker 2 — current assignment
**Country-profile evidence-intent spec is complete; hold for CEO review. Do not deploy.**
- Recommended experiment: `/countries/png/` exact historical answer for `SP.POP.GROW`, observation year 2023.
- Spec: `docs/worker-2-country-profile-evidence-intent-experiment-spec-2026-09-09.md`.
- Recommendation: **BUILD after PR #198 measurement closes and CEO authorizes.**
- Keep scope to PNG only in the first experiment; no new URLs, no sitemap/canonical changes, no broad template rollout.
- On any future implementation, resolve the exact value from the existing validated WDI historical dataset at build time and fail closed if absent; never hard-code a value from the spec.
- Until CEO changes priority, verify production/CI health and avoid duplicating Worker 1's `/data/*` work.

**Definition of done:** achieved for specification phase; awaiting CEO decision/deployment authorization.

## CEO-owned / hold
- PR #198 merged/live; preserve measurement window.
- `/data/death-rate/` exact-value answer experiment is next data-page test but not yet authorized for deployment.
- `/countries/png/` population-growth-2023 exact historical answer is the Worker-2 country-profile candidate, not yet authorized for deployment.
- Destination Climate = PAUSED after POWER/ARCO operational failures.
- Travel Power = HOLD on provenance.
- Date Calculator = HOLD fallback.
- No generic trend/fun-fact scaling or multilingual mass expansion without demand evidence.

## Worker results
### Worker 1
- 2026-09-09 22:18: Search Console finalized data still ends on Sep 8; no Sep-9+ rows exist for `/data/population-age-0-14/`, so PR #198 remains HOLD. Main head `6379c75c...` had CI 1284 green, 0 open PRs, and live population-age-0-14 page health confirmed. No `/data/*` change made.
- Prepared the death-rate exact-answer implementation spec. The existing lookup block should be upgraded rather than duplicated; preferred fixed test case remains China 2021, with the exact value sourced from verified WDI data at build time.

### Worker 2
- 2026-09-09 22:32: finalized Sep 1-8 country-profile GSC mapped. PNG population-growth-2023 is selected over one-off current-population matches because the natural query repeated on three days at positions 8/8/7 and a World Bank-qualified variant appeared at position 10.
- Live `/countries/png/` inspection confirms initial HTML exposes the latest 2025 population-growth observation but not the historical 2023 exact answer. No production page was changed.
- Implementation-ready bounded spec created at `docs/worker-2-country-profile-evidence-intent-experiment-spec-2026-09-09.md`; recommendation BUILD only after CEO authorization and PR #198 measurement closure.
