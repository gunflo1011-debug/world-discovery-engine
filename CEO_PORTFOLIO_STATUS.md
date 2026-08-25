# Profit CEO — Portfolio Status

_Last updated: 2026-08-25 10:22 Europe/Berlin_

## Unternehmensziel
Maximize long-term legal net profit and recurring cash flow at acceptable risk, high automation and low permanent human workload. Unknown business outcomes stay UNKNOWN.

## Current evidence snapshot
- **World Discovery — Rank #1 / PRIMARY DISTRIBUTION-DATA ASSET.** Public/indexable distribution asset. Traffic, users, revenue, costs and net profit remain UNKNOWN.
- **Things / Asset Market Alpha — Rank #2 / HIGH-UPSIDE CONSUMER ASSET.** FREE-FIRST / POPULARITY-FIRST. Core target: capture -> inventory -> value -> total value -> sell -> inventory/value update. Users, activation, retention, item counts and sell-flow usage remain UNKNOWN.
- **Verified revenue / costs / net profit:** UNKNOWN / UNKNOWN / UNKNOWN.
- **Key CEO finding this cycle:** Things has accumulated useful domain models/tests for sale-start, sold-state and privacy-minimal activation, but the actual `mobile/App.tsx` still renders a basic private-device inventory: count, add-device, condition and a privacy badge. It does not yet expose the new value/total-value/sale-start/sold-state surfaces. The highest-value next step is therefore integration into the real user path, not more parallel model creation.
- **CI evidence:** combined-status queries for Things `3fc00e7` and World Discovery `6f456c9` return zero status contexts. Green CI is not claimed.

## Active allocation — 3 Things / 1 World Discovery

### CEO Worker 1 → Things real inventory value + sell CTA integration (P0)
**Main goal:** turn existing value/sale-start domain logic into a real authenticated user-visible inventory experience in `mobile/App.tsx`.
**Execution chain:** inspect current inventory data shape and existing value/sale-start helpers -> derive truthful per-item value display without invented estimates -> expose total known inventory value only when semantics are valid -> add explicit `Start selling` entry using the existing sale-start contract -> preserve private-by-default/no-auto-listing semantics -> add focused regression(s) and wire into existing mobile checks.
**DoD:** the real app, not only a helper/model, visibly connects an owned item to value evidence and an explicit sale-start action; unknown value stays explicit; no automatic listing; executable regression and commit evidence exist.
**Economic reason:** this is the shortest path from a technical alpha to the product promise `know what you own, know what it is worth, sell it effortlessly`, improving activation and sell-loop utility.
**Handoff:** Worker 2 consumes the integrated item/sale state to make post-sale ownership/value accounting truthful.

### CEO Worker 2 → Things real sold-state lifecycle integration (P0)
**Main goal:** integrate sold-state semantics into the actual app/data flow so sold items cannot masquerade as currently owned wealth.
**Execution chain:** inspect persistence schema/data layer and existing sold-state/trust-surface helpers -> choose the smallest reversible representation compatible with current backend -> render owned vs sold truthfully in the app -> ensure owned count/known total value exclude sold items -> regression for transition/accounting -> commit.
**DoD:** actual app/data path distinguishes sold from owned, with deterministic count/value behavior and no destructive hidden deletion; tests prove sold items do not inflate current ownership/value.
**Economic reason:** trust in the ownership/value ledger is foundational for retention and future marketplace/data value.
**Handoff:** Worker 1 must not duplicate sold-state persistence; Worker 3 measures only semantically valid funnel milestones.

### CEO Worker 3 → Things local activation evidence from real app actions (P0)
**Main goal:** connect the privacy-minimal activation contract/funnel to real app actions locally, without external analytics or PII.
**Execution chain:** map CAPTURE_SUCCESS, INVENTORY_VISIBLE, VALUE_VISIBLE and SELL_INITIATED to concrete app events -> implement an in-memory/local-only event sink suitable for development/testing -> aggregate with existing funnel semantics -> expose inspectable dev/test evidence, not user profiling -> regress no identifiers/free text/value/device/location/session/external emission -> commit.
**DoD:** tests demonstrate that real app actions can feed the aggregate funnel contract locally while forbidden fields/external destinations remain absent. Do not add third-party analytics.
**Economic reason:** converts engineering output into the first trustworthy measurement substrate for activation/sell-loop optimization without spending money or creating privacy debt.
**Handoff:** CEO uses only aggregate evidence; any real production telemetry remains a separate legal/privacy decision.

### CEO Worker 4 → World Discovery comparison surface: resolve product-use mismatch (P0)
**Main goal:** prevent the new same-entity/same-period revision-comparison surface from becoming dead code or being misused for cross-country comparisons.
**Execution chain:** inspect current public data and generated routes -> identify whether a legitimate same-entity/same-period revision pair exists -> if yes, integrate one real product rendering with provenance/trust gates; if no, add an explicit eligibility adapter/fixture-backed product contract that suppresses rendering and documents the missing evidence, then identify the smallest legitimate data ingestion needed -> tests/build/check -> commit.
**DoD:** either one truthful product-facing comparison is generated from real compatible observations, or the product deterministically refuses to render until compatible evidence exists; no fabricated cross-country delta; build/tests remain executable.
**Economic reason:** protects trust and ensures comparison engineering only survives if it can become useful product surface; avoids spending more worker-hours on an unusable abstraction.
**Handoff:** CEO decides next cycle whether World Discovery deserves >1 worker based on real product integration or demand evidence.

## Latest verified worker evidence
- **CEO Worker 1 / Things:** sale-start model and CI wiring exist (`361d920`, `4f5b501`, `08ae98d`, `53d18b0`), but current `mobile/App.tsx` still does not use that surface.
- **CEO Worker 2 / Things:** deterministic sold-item trust surface delivered (`93309a7`, `e64e53e`, `7249098`); integration into real app/data lifecycle remains the next economic step.
- **CEO Worker 3 / Things:** privacy-safe local activation funnel delivered (`448f044`, `17582d2`, `3fc00e7`); real app actions are not yet proven to feed it.
- **CEO Worker 4 / World Discovery:** product-facing trust-gated comparison surface/tests delivered (`c5b4229`, `6f456c9`) with same entity/period/unit/methodology and provenance gates. Current known internet-use snapshot does not justify cross-country use.

## Economic interpretation
Engineering throughput is healthy. The bottleneck is now integration plus real demand evidence. Things domain logic has outrun the visible app; therefore three Things workers remain justified only if they converge on one coherent user loop rather than producing more isolated helpers. World Discovery retains one worker because it already has public distribution, but comparison work must prove a legitimate product use before receiving more capacity.

## Next capital / priority decision
**0 EUR new spend.** No paid acquisition, ads, billing, commercial analytics or data purchases. First integrate the existing Things capabilities into the real app and obtain truthful activation evidence; for World Discovery, prove useful public comparison eligibility and obtain Search Console/traffic evidence when available.

## Controls / blockers
- No payments, ad activation, contracts, hosted schema writes, participant outreach or irreversible external actions without explicit approval.
- World Discovery preserves provenance/comparability/year/unit/methodology trust gates and must not repurpose revision comparisons as cross-entity comparisons.
- Things stays free-first/popularity-first; unknown values stay unknown; no automatic sale/listing; measurement remains privacy-minimal.

**Nutzeraktion: Keine.**