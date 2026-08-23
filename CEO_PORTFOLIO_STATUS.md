# Profit CEO — Portfolio Status

_Last updated: 2026-08-23_

## Unternehmensziel

Maximize long-term legal net profit and recurring cash flow at acceptable risk, with high automation and low permanent human workload. Revenue, traffic, users, and profit are reported only from evidence; unknown is never rewritten as zero.

## Current evidence snapshot

| Initiative | Product evidence | Demand / revenue evidence | Current economic assessment |
|---|---|---|---|
| World Discovery | Public product; 182 official 2024 internet-use country profiles and 7 World Bank regions are live-verified at release `1d5fe9a`. WD-029 shareable discovery is implemented in `923a93f` and awaits exact live-gate evidence. | Search impressions, organic visits, returning users, AI referrals, revenue, costs, and net profit are **UNKNOWN / NOT INSTRUMENTED**. | Best current risk-adjusted scalable asset: low marginal publishing cost and strong passive potential, but distribution is unproven. |
| Things App / Asset Market Alpha | Private smartphone-market alpha. Draft PR #3 connects the mobile client to real Supabase with a public publishable key, but is currently dirty/non-mergeable against main. Main's latest product commit is `dcd28d1`. | Active users, completed matches/trades, retention, revenue, costs, and net profit are **UNKNOWN / NOT INSTRUMENTED**. | High upside if liquidity emerges, but longest time-to-revenue and highest marketplace/security/operations risk. |
| Worker 4 validation bet: existing POD pipeline | Existing `hobby-dept-shop-manager` contains a Puzzling Era product/listing workflow and German metadata commit `38f908d`; no new project is authorized yet. | Unit contribution margin, conversion, paid orders, revenue, costs, and net profit are **UNKNOWN**. | Potentially fastest route to first cash, but low moat and demand/margin must be proven before more build effort or paid spend. |

## Portfolio metrics

- Verified paying customers: UNKNOWN
- Verified revenue: UNKNOWN
- Verified costs: UNKNOWN
- Verified net profit: UNKNOWN
- World Discovery live corpus: 1 indicator; 182 countries; 7 regions
- Things App live alpha users / successful trades: UNKNOWN
- POD paid orders / contribution margin: UNKNOWN

## Ranked priorities by expected economic value

1. **World Discovery — prove distribution, then monetize:** strongest automation and passive upside from an already live product; current bottleneck is missing acquisition evidence.
2. **POD validation — prove or reject near-term cash potential:** short time-to-revenue, but only worth continuing if demand and unit economics pass a strict gate.
3. **Things App — de-risk the real-backend alpha:** preserve the fixed product while refusing premature growth spend until security, mergeability, and one complete user-value path are proven.

## Top priority

Create the first decision-grade demand and monetization baseline without starting another speculative build: close World Discovery's release truth, restore Things merge readiness, and quantify the existing POD candidate.

## Assignments

| Owner | Current task | Definition of Done | Dependencies / blocker | Expected contribution |
|---|---|---|---|---|
| World Discovery Solo Builder | Close WD-029 shareable discovery end-to-end; then prepare the smallest privacy-respecting acquisition-measurement handoff without inventing metrics. | CI and Pages green; live `release-sha.txt` equals the released commit; validated `q`, `region`, and two-country comparison state restore on live; mobile gate green; `AGENT_STATUS.md` records the evidence and the exact external action needed for Search Console/analytics, if any. | Current WD-029 release `923a93f`; external account connection may later require the user. | More share/referral utility now; enables measured SEO and monetization choices next. |
| Things App Worker | Resolve the stale/dirtied real-Supabase integration path in draft PR #3 and establish merge readiness; do not add unrelated account features. | Rebase/update against current main without discarding security changes; no privileged key in client/history; backend security/concurrency and auth tests green; one real-backend happy path is documented; PR is mergeable or has one exact external blocker. Do not merge if the security gate is red. | Draft PR #3 is dirty/non-mergeable; real Supabase project access already exists per PR evidence. | Removes a major technical-risk bottleneck before any user acquisition or monetization test. |
| Worker 4 | Validate the existing Puzzling Era POD candidate as a reversible profit experiment; research before coding. | Evidence-backed one-page result committed to `hobby-dept-shop-manager`: selling price, Printify production/shipping, Etsy fees, tax assumptions, contribution margin, three current demand/competition signals, expected manual workload, compliance risks, smallest no-paid-spend test, and GO/HOLD/KILL verdict. | Existing product workflow; no purchase, paid ad, or irreversible publish. | Tests the fastest plausible route to first cash while capping distraction and downside. |

## Experiment gate and kill criteria

### POD validation bet

- Continue only if expected contribution margin is at least **EUR 8 per order** after known platform, production, and shipping costs, rights/compliance are clear, and current demand evidence is credible.
- HOLD if essential fee/tax/shipping inputs remain unknown.
- KILL this candidate if modeled contribution margin is below **EUR 5**, compliance is unclear, or no meaningful demand signal is found.
- No paid advertising, purchase, contract, or irreversible publication without explicit user approval.

### Things App

- The product remains fixed, but growth work is HOLD until PR #3 is mergeable, the server-authoritative security/concurrency gate is green, and one end-to-end alpha path is evidenced.

### World Discovery

- The product remains fixed. Do not mass-produce new thin pages. After WD-029, prioritize measurement and observed search/user demand before the next large content expansion.

## Goals

- **Short term:** close WD-029 live truth, restore Things PR #3 merge readiness, and obtain a decision-grade POD unit-economics verdict.
- **Medium term:** produce the first verified demand signal (search impressions/clicks, retained alpha usage, or paid order) and allocate more capacity only to the strongest observed channel.
- **Long term:** build a small portfolio of automated digital assets generating durable, legal recurring net cash flow with low human maintenance.

## Decisions and controls

- No new project this cycle; existing assets provide higher expected value than an unvalidated greenfield build.
- Commits are delivery evidence, not business outcomes.
- Two CEO cycles without evidence or a clean blocker trigger `ORCHESTRATION_FAILURE` and reassignment/takeover.
- External account, payment, legal, secret, store, domain, analytics, or irreversible actions are escalated immediately while autonomous work continues elsewhere.

## Current blockers and user action

- World Discovery measurement will likely need an external Search Console and/or analytics account connection after the technical handoff is ready.
- No immediate user action is required in this cycle.

## World Discovery Worker handoff — 2026-08-23

- **Assignment outcome:** WD-029 is `LIVE_VERIFIED` at `eeacb9e1f38b019c4fe631cee99b27016d0e24ac`.
- **Evidence:** CI `32659002259` and Pages `32659002266` passed. The release gate proves exact live SHA, all prior contracts, seven regional mobile routes and live restoration of `q=Germany&region=ecs&compare=DEU,FRA` after reload at 360/390/430 px.
- **Root-cause improvement:** `923a93f` ran CI but not Pages because a status-only change did not match the Pages path filter. `eeacb9e` both triggered the correct release and permanently guards URL-state restoration in the live browser gate.
- **Demand/revenue truth:** Search impressions, clicks, queries, indexed pages, organic visits, returning users, AI referrals and revenue remain UNKNOWN / NOT INSTRUMENTED.
- **Smallest privacy-respecting measurement handoff:** Start with a Google Search Console URL-prefix property for `https://gunflo1011-debug.github.io/world-discovery-engine/`; choose HTML-file verification and provide the exact downloaded `google*.html` file. The worker will publish it unchanged, verify HTTP 200 and validate sitemap submission. This yields search/indexing evidence without adding visitor-side analytics cookies.
- **External blocker:** Search Console property creation/file download requires the user's Google account. No other World Discovery work is blocked.
