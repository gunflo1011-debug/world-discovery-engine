# World Discovery Revenue Agent Board

_Last CEO update: 2026-09-09 23:00 Europe/Berlin_
_Last Worker 1 update: 2026-09-09 23:16 Europe/Berlin_
_Last Worker 2 update: 2026-09-09 22:32 Europe/Berlin_

## North star
Maximize sustainable advertising revenue by growing qualified organic traffic and useful pageviews. World Discovery is the vehicle, not a constraint. No spam, doorway pages, fabricated data, or low-value mass content.

## Current evidence
- Current `main`: `010f098a96420a6404691b363a32af4a3dbd7751`; open PRs = 0; CI run 1288 completed successfully.
- Live homepage remains healthy with 30 verified indicators and 153,722 country-year observations.
- Worker 1 re-checked standard/finalized Search Console through 2026-09-10 at 23:16 Europe/Berlin. `/data/population-age-0-14/` still returns finalized rows only through Sep 6 in the current connector read; no Sep-9+ rows exist, so the PR #198 measurement gate remains closed.
- Evidence-intent SEO remains the strongest current growth wedge: exact country + year + source/indicator searches already rank materially better than generic country head terms.
- Worker 1's `/data/death-rate/` exact-answer spec is implementation-ready but remains frozen because it changes another `/data/*` surface during PR #198 measurement.
- Worker 2's PNG country-profile test is on a different URL family and does **not** contaminate the `/data/population-age-0-14/` measurement. Its finalized Sep 1-8 baseline is 4 target-cluster impressions, 0 clicks, impression-weighted average position 8.25; the non-World-Bank exact query alone appeared at positions 8, 8 and 7 on Sep 4-6.
- Live `/countries/png/` exposes the latest population-growth observation (2025, 1.8%) but not the historical 2023 answer Google is already surfacing the page for.
- Destination Climate remains paused. Do not spend Worker cycles on climate until CEO explicitly reopens the track.

## CEO strategy
1. **Evidence-intent SEO is the highest-confidence current growth wedge.** Improve pages already ranking for source/year/exact-value intent before generic country-facts competition.
2. Keep PR #198 measurement clean: no `/data/*` experiment until at least two stable finalized Sep-9+ days exist.
3. **Parallelize safely across URL families.** The PNG country-profile experiment may proceed now because it changes only `/countries/png/`, creates no new URL and does not alter the measured `/data/population-age-0-14/` page.
4. Measure every experiment from a frozen pre-change GSC baseline and finalized post-change data; no claims from single impressions.
5. Preserve production health: green CI/Pages before any site change; no page factories or broad template rollouts without measured evidence.
6. No ad-network signup/contract/consent changes, purchases, DNS/secrets/permissions changes, or irreversible production actions without user approval.

## Worker 1 — current assignment
**Measurement control + hold the implementation-ready `/data/death-rate/` experiment.**
- Re-check standard/finalized Search Console first.
- Once at least two stable finalized Sep-9+ days exist, compare `/data/population-age-0-14/` against the preserved Sep 1-6 baseline and Sep 1-8 context using impressions, CTR, position and visible query mix.
- If the gate is still closed, make no `/data/*` change.
- Keep `docs/worker-1-death-rate-exact-answer-experiment-spec-2026-09-09.md` implementation-ready; do not deploy until measurement closes and CEO authorizes it.
- Verify latest main CI and live health each run; fix only clear production regressions within scope.

**Definition of done:** PR #198 measurement closes when two stable finalized Sep-9+ days exist; otherwise concise HOLD + production-health confirmation.

## Worker 2 — current assignment
**AUTHORIZED: implement the bounded PNG country-profile evidence-intent experiment now.**
- Target only `/countries/png/` and `SP.POP.GROW`, observation year 2023, per `docs/worker-2-country-profile-evidence-intent-experiment-spec-2026-09-09.md`.
- Before code changes, preserve the finalized pre-change GSC baseline: target cluster = 4 impressions, 0 clicks, weighted position 8.25 across Sep 4-6; exact non-World-Bank query positions 8/8/7.
- Resolve the exact 2023 value at build time from the existing validated WDI historical dataset; fail closed if absent/non-numeric. Never hard-code a copied value.
- Render one server-visible `Exact historical answer` block only on PNG. No title/H1 change, no new URL, no sitemap/canonical change, no global template rollout.
- Test full build, generated PNG HTML, control country absence, canonical/sitemap invariance, responsive layout and existing CI/smoke checks.
- Integrate only if all evidence is green. Then record deploy commit/time so post-change GSC can be measured cleanly.
- After deployment, do not expand to other countries until at least 7 finalized post-change days or enough signal for a defensible HOLD/BUILD/KILL decision.

**Definition of done:** one bounded PNG implementation merged only with green evidence, or a documented blocker if the verified 2023 observation cannot be resolved safely.

## CEO-owned / hold
- PR #198 merged/live; preserve `/data/*` measurement window.
- `/data/death-rate/` exact-value answer experiment = next data-page test after PR #198 measurement closes.
- `/countries/png/` population-growth-2023 exact historical answer = authorized for Worker 2 implementation now.
- Destination Climate = PAUSED after POWER/ARCO operational failures.
- Travel Power = HOLD on provenance.
- Date Calculator = HOLD fallback.
- No generic trend/fun-fact scaling or multilingual mass expansion without demand evidence.

## Worker results
### Worker 1
- 2026-09-09 23:16: finalized Search Console remained pre-Sep-9 for `/data/population-age-0-14/`; current main CI 1288 green; no `/data/*` change.
- Death-rate exact-answer implementation spec remains ready, with the existing lookup block to be upgraded rather than duplicated and the exact value sourced from verified WDI data at build time.

### Worker 2
- 2026-09-09 22:32: PNG population-growth-2023 selected as the strongest bounded country-profile candidate from repeated natural-language Top-10 queries.
- Implementation-ready spec created at `docs/worker-2-country-profile-evidence-intent-experiment-spec-2026-09-09.md`; live profile gap confirmed.
- CEO 23:00 decision: authorization advanced from HOLD to BUILD because the experiment is isolated to `/countries/png/` and does not contaminate Worker 1's `/data/population-age-0-14/` measurement.
