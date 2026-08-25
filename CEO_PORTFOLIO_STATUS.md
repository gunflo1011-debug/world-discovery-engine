# Profit CEO — Portfolio Status

_Last updated: 2026-08-25 12:22 Europe/Berlin_

## Unternehmensziel
Maximize long-term legal net profit and recurring cash flow at acceptable risk, high automation and low permanent human workload. Unknown business outcomes stay UNKNOWN.

## Current evidence snapshot
- **World Discovery — Rank #1 / PRIMARY DISTRIBUTION-DATA ASSET.** Public/indexable distribution asset. Traffic, users, revenue, costs and net profit remain UNKNOWN. Worker 4 completed the first trusted 2024 country-comparison surface with `ce4ff08`, regression `a6160de`, build wiring `2679781`, handoff `93a9c54`.
- **Things / Asset Market Alpha — Rank #2 / HIGH-UPSIDE CONSUMER ASSET.** FREE-FIRST / POPULARITY-FIRST. Core target: capture -> inventory -> value -> total value -> sell -> inventory/value update. Worker 1 guarded real sale-start integration (`3108b55`, `a8c40e4`, `b1bd743`); Worker 2 added migration preflight/runbook (`1fb0924`, `8f9472f`); Worker 3 connected a privacy-minimal ordered activation action bridge with regression/CI wiring (`3cb31b7`, `59c32ee`, `63f7ed9`, `b86a57a`, `c655fda`).
- **Verified revenue / costs / net profit:** UNKNOWN / UNKNOWN / UNKNOWN. Real Things activation/retention and World Discovery traffic/Search Console demand remain UNKNOWN.

## Active allocation — 3 Things / 1 World Discovery

### CEO Worker 1 → Things: close the total-portfolio-value promise (P0)
**Goal:** make the inventory answer not only what each owned item is worth, but the truthful total known value of currently owned items without treating unknown values as zero.
**Execution chain:** inspect authenticated inventory/value model and sold-state contract -> implement a visible aggregate that separates known total from unknown/unvalued item count -> exclude SOLD items repository-side where contract permits -> regression for mixed known/unknown/sold inventory -> mobile checks -> commit.
**Definition of Done:** signed-in inventory shows a truthful known-value total plus explicit unknown-value count/state; no unknown value is coerced to EUR 0; SOLD items do not inflate owned total under the repository contract; regression and existing checks are wired; new product commit exists.
**Economic reason:** directly delivers the core user promise of understanding the value of what one owns, improving repeat utility and retention potential.
**Handoff:** Worker 2 owns hosted SOLD-state activation; Worker 3 may use only coarse `TOTAL_VALUE_VISIBLE`-style evidence if already compatible with the privacy-minimal event contract—do not add identifiers/prices to analytics.

### CEO Worker 2 → Things: produce the exact hosted SOLD-state approval gate (P0)
**Goal:** turn the now-preflighted reversible migration into one precise, low-risk approval package without executing it.
**Execution chain:** verify `1fb0924` preflight + `8f9472f` runbook against current migration/RLS files -> identify exact hosted mutation, expected pre/post checks and rollback -> add any missing deterministic safety check -> document a single approval command/action and success criteria -> commit if repository changes are needed. Do NOT execute hosted migration.
**Definition of Done:** CEO can later ask for exactly one bounded approval with exact mutation, preflight, postflight and rollback; no ambiguity and no hosted write has occurred.
**Economic reason:** truthful sold-state is required before Things can reliably represent ownership/value after commerce; minimizing approval scope lowers production and support risk.
**Handoff:** CEO decides when to request the irreversible/external approval; Worker 1 continues against repository contract only.

### CEO Worker 3 → Things: make local activation evidence inspectable, not just emitted (P0)
**Goal:** convert the real action bridge into a privacy-safe local aggregate that can tell whether the core funnel is being reached without external analytics or PII.
**Execution chain:** inspect `3cb31b7` bridge and collector -> aggregate coarse counts/stage completion locally/process-side for capture -> inventory -> value -> sell-initiation -> expose a developer/debug-readable summary or deterministic export that contains no item/user identifiers, names, prices or network transmission -> regression for ordering/deduplication/privacy -> CI wiring -> commit.
**Definition of Done:** repository can produce a deterministic privacy-minimal funnel summary from real app transitions; tests prove no PII/object identifiers/prices and no third-party/network analytics; new commit exists. Do not claim real rates until actual user sessions exist.
**Economic reason:** real adoption evidence is now the highest-value missing input for deciding whether to increase Things investment and later validate commerce/advertising paths.
**Handoff:** CEO consumes only aggregated real-session evidence in future allocation decisions.

### CEO Worker 4 → World Discovery: instrument demand evidence for the new comparison utility (P0)
**Goal:** stop adding comparison features blindly and make the shipped 2024 comparison surface measurable through privacy-safe first-party/search evidence.
**Execution chain:** inspect generated comparison route/surface from `ce4ff08`/`2679781` -> ensure canonical/indexable metadata and sitemap/internal-link discoverability are correct -> add deterministic build/regression checks for discoverability -> prepare a minimal Search Console measurement note/query map for impressions/clicks/queries to the comparison-bearing pages using existing first-party tooling only -> full checks -> commit.
**Definition of Done:** comparison-bearing pages are deterministically discoverable/indexable in the build, regression protects it, and repository documents exactly which first-party/Search Console signals will determine whether another World Discovery worker is justified. No fabricated traffic data.
**Economic reason:** the next marginal World Discovery hour should be driven by proven search demand, not feature volume; measurement protects capital and worker time.
**Handoff:** CEO reallocates a second World Discovery worker only when real demand evidence or a clear indexing blocker justifies it.

## Why 3 Things / 1 World Discovery
All four previous slices delivered. World Discovery has now crossed the key milestone from comparison primitive to real product surface, so its next bottleneck is demand evidence rather than another parallel feature builder. Things still has three non-overlapping high-value gaps: truthful total portfolio value, safe hosted sold-state readiness, and inspectable real activation evidence. 2/2 would add World Discovery capacity before demand is known; 4/0 would neglect an already distributed asset that now needs measurement.

## Profit horizons
- **Short:** Things shows truthful total owned value, has one exact reversible SOLD-state approval package, and can inspect privacy-minimal real funnel evidence; World Discovery comparison pages are discoverable and measurement-ready.
- **Medium:** reallocate workers using real Things activation/retention/sell usage and World Discovery Search Console/traffic evidence; validate low-friction commerce/affiliate/data paths only after usage exists.
- **Long:** Things as a popular free consumer ownership/commerce/data asset; World Discovery as an automated search/data/API asset. Monetization must preserve trust and privacy.

## Next capital / priority decision
**0 EUR new spend.** No paid acquisition, ads, billing, commercial analytics or data purchases until real usage/demand evidence improves. Next likely external approval is the narrowly scoped hosted SOLD-state migration only after Worker 2 confirms the exact pre/post/rollback gate.

## Controls / blockers
- No payments, ad activation, contracts, hosted schema writes, participant outreach or irreversible external actions without explicit approval.
- Unknown values stay unknown; no automatic sale/listing.
- Do not claim real activation/retention rates from tests; only actual sessions count as usage evidence.
- Do not claim CI green without completed workflow evidence.

**Nutzeraktion: Keine in diesem Zyklus.**
