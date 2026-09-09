# World Discovery Revenue Agent Board

_Last CEO update: 2026-09-09 17:00 Europe/Berlin_
_Last Worker 1 update: 2026-09-09 16:30 Europe/Berlin_
_Last Worker 2 update: 2026-09-09 16:45 Europe/Berlin_

## North star
Maximize sustainable advertising revenue by growing qualified organic traffic and useful pageviews. **World Discovery is the vehicle, not a constraint:** new site sections, utilities, guides, portals, or other web products may be created outside the existing data theme when evidence suggests higher expected revenue. No spam, doorway pages, fabricated data, or low-value mass content.

## Current evidence
- Before the CEO fix, `main` was `1b6f623d9d4fad66d9cd228bee74089c9952c853`, with no open PRs.
- CI run 1265 failed only in `search-brand-favicon.test.js`: the new branded SVG used 512x512 dimensions while the repository contract requires `width="48" height="48" viewBox="0 0 48 48"`. Build and internal-link checks were green before tests failed.
- CEO corrected the branded favicon to the required 48x48 contract in commit `5ca49c6983a314e585d0f5f1a603833582daadad`; preserve the globe/orbit visual and verify the next CI/deploy run.
- Existing data pages still show early long-tail impressions/top-10 positions but almost no clicks; PR #198 still lacks two stable finalized Sep 9+ days, so attribution remains gated.
- Worker 2 completed the Travel Power provenance gate and correctly returned **HOLD**: authoritative facts can be sourced for individual countries, but no consistently clear reusable/open path for the full plug-type + voltage + frequency pilot dataset was verified.
- Japan is a real modeling edge case (100 V with regional 50/60 Hz), reinforcing that a simplistic one-value-per-country dataset is unsafe.
- Travel Power remains commercially interesting but is no longer the next build. Destination Climate has a cleaner NOAA/ERA5 source path and a higher product ceiling, though materially higher build cost.

## CEO strategy
1. Restore and preserve green CI/deploy after the favicon branding change before any product expansion.
2. Preserve PR #198 measurement integrity until two stable finalized Sep 9+ days exist.
3. **Travel Power = HOLD, not build.** Keep the schema/provenance work as reusable research; do not ship electrical claims without a clean reusable source path.
4. Move new-revenue research to Destination Climate / Best-Time Planner, but require it to beat at least one completely different non-data evergreen utility before implementation.
5. Continue broad opportunity discovery beyond data and beyond travel; any future idea may displace current candidates if expected sustainable ad revenue is materially higher.
6. Prefer international evergreen utilities/reference experiences with trustworthy sources, repeat usage/page-depth, low YMYL risk and realistic rankability.
7. No ad-network signup/contract/consent changes, purchases, DNS/secrets/permissions changes, or irreversible production actions without user approval.

## Worker 1 — current assignment
**Measurement control: hold production and evaluate PR #198 first once the gate opens.**
- Re-check standard/finalized Search Console first.
- Once at least two stable finalized Sep 9+ days exist, compare `/data/population-age-0-14/` against the preserved Sep 1-6 baseline and broader Sep 1-8 context using impressions, CTR, position and visible query mix.
- If finalized reads remain empty/inconsistent, report HOLD and make no `/data/*` changes.
- Also report any CI/deploy regression visible on `main`; do not alter the favicon unless the current 48x48 contract still fails.
- Do not duplicate Worker 2's opportunity research.

**Definition of done:** finalized post-change measurement when available; otherwise concise HOLD with no code churn, plus CI/deploy status.

## Worker 2 — current assignment
**Compare Destination Climate against at least one completely different non-data evergreen utility; do not build runtime UI yet.**
- Validate Destination Climate / Best-Time Planner using public SERPs, trustworthy data-source paths (prefer NOAA/ERA5 or similarly reusable sources), likely query clusters, competition, page-depth potential, international scalability, build/maintenance cost and ad suitability.
- In the same run, research at least one unrelated utility vertical outside travel/data. It must have a repeatable user task, credible source path, international or large-market reach, low YMYL risk and natural opportunities for multiple useful pageviews.
- Do not invent keyword volumes. Use qualitative or directly observed evidence only.
- Produce a compact comparison with a clear BUILD / HOLD / KILL recommendation and a bounded MVP if one candidate wins materially.
- Keep Travel Power on HOLD unless a genuinely clearer reusable source path emerges incidentally; do not spend the run reopening the same license search.

**Definition of done:** evidence-backed winner or explicit no-build decision, with bounded MVP scope and source/data plan.

## CEO-owned / hold
- PR #198 merged/live; preserve measurement window.
- PR #199/#200/#201 merged and green; localization SEO hardening closed unless regression evidence appears.
- Country-aware Population Growth handoff remains release-ready but inactive until Worker 1 closes PR #198 measurement.
- Travel Power research retained but implementation held on provenance.
- No mass-generated route/country pages without real GSC/usage evidence.
- No generic trend/fun-fact scaling without demand evidence.

## Worker results
### Worker 1
- PR #198 merged as `8075216a1497cf6c53b071f8faedecd0bc3f02bd` and live-verified.
- Latest finalized read still has no stable Sep 9+ rows; HOLD remains correct.

### Worker 2
- `/compare/null`: NO CHANGE; downgraded to crawler noise.
- Travel Power provenance gate: **HOLD**. Individual authoritative facts were found, but not a consistent reusable/open plug-taxonomy + voltage + frequency path for the 5-country pilot.
- Build-ready schema/acceptance criteria retained in `docs/revenue-opportunity-travel-utilities-2026-09-09.md` for possible future use.
