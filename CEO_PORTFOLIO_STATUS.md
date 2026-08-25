# Profit CEO — Portfolio Status

_Last updated: 2026-08-25 11:31 Europe/Berlin_

## Unternehmensziel
Maximize long-term legal net profit and recurring cash flow at acceptable risk, high automation and low permanent human workload. Unknown business outcomes stay UNKNOWN.

## Current evidence snapshot
- **World Discovery — Rank #1 / PRIMARY DISTRIBUTION-DATA ASSET.** Public/indexable distribution asset. Traffic, users, revenue, costs and net profit remain UNKNOWN.
- **Things / Asset Market Alpha — Rank #2 / HIGH-UPSIDE CONSUMER ASSET.** FREE-FIRST / POPULARITY-FIRST. Core target: capture -> inventory -> value -> total value -> sell -> inventory/value update.
- **Worker 1:** real authenticated inventory already renders truthful unknown-value + explicit sale-start via `2243040`. This cycle added an executable App-level regression and CI wiring (`3108b55`, `a8c40e4`, `b1bd743`) proving the visible sale-start contract remains connected and does not coerce unknown value to €0. GitHub workflow lookup immediately after `b1bd743` returned zero runs; green CI is NOT claimed.
- **Worker 2:** owner-safe market/sold lifecycle is implemented repository-side (`4bbeef4`, `2e908b3`, `0cc01dd`, regressions/CI wiring). Hosted Supabase migration remains an approval-gated production blocker.
- **Worker 3:** local privacy-minimal activation collector and CI gate exist (`51e8935`, `cffba0d`, `0463c75`, `badaea8`). Real app action hooks remain the missing evidence bridge.
- **Worker 4:** World Discovery now has a trust-gated cross-entity comparison primitive + regression (`b99d687`, `dc784b2`) and handoff `32e2aca`. Different entities are allowed only for same indicator/period/unit/methodology with provenance. Green CI is not assumed without evidence.
- **Verified revenue / costs / net profit:** UNKNOWN / UNKNOWN / UNKNOWN.

## Active allocation — 3 Things / 1 World Discovery

### CEO Worker 1 → Things: complete the visible owned-item value/sell loop (P0)
**Goal:** turn the existing truthful value/sell-start integration into one coherent authenticated inventory interaction without inventing valuation data.
**Execution chain:** inspect current `App.tsx` + inventory adapter after `2243040` -> ensure each owned item renders truthful value state (`unknown` when absent) -> make sell-start reachable from the item with explicit user intent and no auto-publish -> add/extend regression -> run mobile checks -> commit.
**Definition of Done:** a real signed-in inventory item can move from owned-item view to explicit sale-start UI; missing value stays visibly unknown; no automatic listing/sale; regression is wired into existing checks; new product commit exists.
**Worker 1 status:** DONE repository-side for this slice. App already meets the visible interaction contract; new `check-sale-start-app-integration.mjs` now guards the real `App.tsx` wiring, is registered in npm, and is part of `mobile-alpha-ci.yml`. CI completion remains unverified.
**Economic reason:** directly strengthens the core Things promise `own -> know value -> sell`, improving activation/retention potential without monetization friction.
**Handoff:** Worker 3 consumes the exact real UI transition names for activation evidence; Worker 2 owns sold-state truth after sale completion.

### CEO Worker 2 → Things: make SOLD lifecycle production-ready without performing hosted write (P0)
**Goal:** eliminate all remaining repository-side ambiguity before requesting the single approval-gated hosted schema change.
**Execution chain:** inspect owner-safe market-state read + SOLD exclusion -> verify migration SQL/idempotency/RLS impact and rollback path -> add a deterministic preflight/contract test proving old schema fails closed and migrated schema supports owner-safe sold state -> document exact hosted change and rollback -> commit. Do NOT execute hosted migration.
**Definition of Done:** repository contains one executable migration preflight/contract, exact migration/rollback instructions, and passing local regression; no hosted mutation occurs.
**Economic reason:** truthful ownership/value is essential to trust and retention; preparing the change minimizes user effort and production risk.
**Handoff:** CEO can later present one precise approval action; Worker 1/3 may rely only on repository contract until hosted migration is approved.

### CEO Worker 3 → Things: connect privacy-minimal activation evidence to real actions (P0)
**Goal:** convert the existing local collector from harness evidence into truthful product evidence without PII or third-party analytics.
**Execution chain:** inspect actual successful capture, inventory render, value render and sell-start callbacks -> emit only the existing coarse local events at those real transitions -> ensure no item names/IDs/prices/user IDs leave the process-local contract -> add regression simulating real action sequence -> wire mobile checks -> commit.
**Definition of Done:** successful real app transitions emit CAPTURE_SUCCESS/INVENTORY_VISIBLE/VALUE_VISIBLE/SELL_INITIATED (or existing canonical equivalents), test proves ordering/deduplication, payload contains no PII/object identifiers, and no network analytics dependency is introduced.
**Economic reason:** real activation evidence is now the highest-leverage missing input for deciding whether Things deserves more capital/workers.
**Handoff:** Worker 1 confirms the real sale-start UI markers are `sale.valueLabel`, `sale.actionLabel`, toggle of `saleIntentItemId`, and `sale.privacyNotice`; Worker 3 can hook evidence there without changing sale semantics.

### CEO Worker 4 → World Discovery: ship exactly one real 2024 cross-country comparison surface (P0)
**Goal:** convert the new trust primitive into user-visible utility using only real compatible snapshot records.
**Execution chain:** inspect existing 2024 Internet Use country records -> select one pair only if indicator/year/unit/methodology/provenance pass comparison contract -> integrate a compact comparison into one existing country surface -> show both entities, values, delta, year, unit and source/provenance -> fail closed / render nothing when compatibility is absent -> regression -> full project checks -> commit.
**Definition of Done:** one existing generated country page exposes a truthful cross-country comparison backed by real repository snapshot data, with trust metadata visible and deterministic non-render on incompatibility; new product commit exists. If no compatible real pair exists, commit deterministic non-render + machine-readable blocker rather than inventing a comparison.
**Economic reason:** turns World Discovery data into differentiated decision utility rather than more static tables, improving SEO usefulness and future data/API monetization potential.

## Why 3 Things / 1 World Discovery
Things has three distinct near-term bottlenecks that can be worked without collision: visible core-loop convergence, sold-state production readiness, and truthful activation evidence. World Discovery needs one concrete product integration before a second worker has higher marginal value.

## Profit horizons
- **Short:** coherent Things own/value/sell experience + production-ready sold-state contract + real local activation evidence; one truthful World Discovery comparison surface.
- **Medium:** use real Things activation/retention/sell usage and World Discovery Search/traffic evidence to reallocate workers; validate low-friction commerce/affiliate/data paths only after usage exists.
- **Long:** Things as a popular free consumer ownership/commerce/data asset; World Discovery as automated search/data/API asset. Monetization must preserve trust and privacy.

## Next capital / priority decision
**0 EUR new spend.** No paid acquisition, ads, billing, commercial analytics or data purchases until real product usage/demand evidence improves. Next likely approval is only the narrowly scoped hosted SOLD-state migration once Worker 2 has made it preflightable and reversible.

## Controls / blockers
- No payments, ad activation, contracts, hosted schema writes, participant outreach or irreversible external actions without explicit approval.
- Unknown values stay unknown; no automatic sale/listing.
- Do not claim real activation/retention rates from tests; only real transitions may generate product evidence.
- Do not claim CI green without completed workflow evidence.

**Nutzeraktion: Keine in diesem Zyklus.**
