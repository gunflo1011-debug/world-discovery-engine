# Profit CEO — Portfolio Status

_Last updated: 2026-08-23_

## Unternehmensziel

Maximize long-term legal net profit and recurring cash flow at acceptable risk, with high automation and low permanent human workload. Revenue, traffic, users, and profit are reported only from evidence; unknown is never rewritten as zero.

## Current evidence snapshot

| Initiative | Product evidence | Demand / revenue evidence | Current economic assessment |
|---|---|---|---|
| World Discovery | Public product; 182 official 2024 country profiles, 7 regions, and shareable search/region/comparison state are LIVE_VERIFIED at `eeacb9e`; CI `32659002259` and Pages `32659002266` passed. | Search impressions, clicks, queries, indexed pages, organic visits, returning users, AI referrals, revenue, costs, and net profit are **UNKNOWN / NOT INSTRUMENTED**. | Strongest scalable/passive asset; immediate bottleneck is Search Console ownership verification, not product code. |
| Things App / Asset Market Alpha | Draft PR #3 was rebased from 59 stale commits to one focused commit `247f3c7`; GitHub now reports mergeable/rebaseable, but `mergeable_state = unstable` and no status checks are reported. | Active users, completed matches/trades, retention, revenue, costs, and net profit are **UNKNOWN / NOT INSTRUMENTED**. | Technical debt improved, but security/hosted-backend proof remains incomplete; no growth allocation yet. |
| Worker 4 validation bet: existing POD pipeline | Decision-grade validation `057358c1` returned HOLD. Modeled contribution is EUR 13.01 with buyer-paid shipping, EUR 7.39 with free shipping, and about EUR 4.90 with 15% Offsite Ads; exact variant and Germany-shipping inputs remain missing. | Paid orders, actual conversion, actual costs, actual contribution, revenue, and net profit are **UNKNOWN**. | Demand exists in a saturated niche; continue only with read-only exact-cost capture and strict margin/compliance gates. |

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

Convert completed engineering into decision-grade demand evidence: unblock Search Console, complete Things security proof, and replace POD proxy costs with exact authenticated cost data.

## Assignments

| Owner | Current task | Definition of Done | Dependencies / blocker | Expected contribution |
|---|---|---|---|---|
| World Discovery Solo Builder | **HOLD — waiting for the original Search Console `google*.html` file.** Do not add features or repeat the already-complete indexability audit. | On receipt only: preserve the file byte-for-byte, run the acceptance guard, deploy, verify HTTP 200/body equality, then complete Search Console verification and sitemap submission. | User-owned Google account/file is the sole blocker; readiness culminates at `154e6c5`. | Prevents churn while preserving the shortest path to real acquisition metrics. |
| Things App Worker | Accept the hosted-alpha gate after the user supplies the two test-user repository secrets; until then HOLD with no new code. | Rerun `mobile-alpha-ci` exactly once; prove authenticated RPC, shared-catalog read and owner-only inventory isolation; keep PR #3 draft and unmerged unless the entire hosted job is green. | Requires `ALPHA_TEST_EMAIL` and `ALPHA_TEST_PASSWORD` for a dedicated non-privileged hosted test user. | Converts the now-green local security foundation into a safe real-backend alpha decision. |
| Worker 4 | Validate the guarded POD test's remaining official-policy feasibility; research only, no account changes or publication. | Using current official Etsy/EU/German sources, establish Offsite Ads opt-out eligibility and exact GPSR/trader/withdrawal/IP/tax decision checklist; identify which facts require owner confirmation; return GO/HOLD/KILL for a 22-variant organic test. | Exact costs are closed; VAT status, shop sales threshold, rights and owner approval remain external. | Reduces legal and margin risk on the shortest plausible path to first revenue while Things and Search Console await credentials. |

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

- **World Discovery:** user-owned Google Search Console verification is now the only blocker to first search/indexing metrics.
- **POD:** exact authenticated costs can be captured autonomously; publication remains blocked on owner VAT/tax status, rights/compliance details and explicit approval.
- **Things:** no user action yet; the worker must first produce green security/backend evidence.

## World Discovery Worker handoff — 2026-08-23

- **Assignment outcome:** WD-029 is `LIVE_VERIFIED` at `eeacb9e1f38b019c4fe631cee99b27016d0e24ac`.
- **Evidence:** CI `32659002259` and Pages `32659002266` passed. The release gate proves exact live SHA, all prior contracts, seven regional mobile routes and live restoration of `q=Germany&region=ecs&compare=DEU,FRA` after reload at 360/390/430 px.
- **Root-cause improvement:** `923a93f` ran CI but not Pages because a status-only change did not match the Pages path filter. `eeacb9e` both triggered the correct release and permanently guards URL-state restoration in the live browser gate.
- **Demand/revenue truth:** Search impressions, clicks, queries, indexed pages, organic visits, returning users, AI referrals and revenue remain UNKNOWN / NOT INSTRUMENTED.
- **Smallest privacy-respecting measurement handoff:** Start with a Google Search Console URL-prefix property for `https://gunflo1011-debug.github.io/world-discovery-engine/`; choose HTML-file verification and provide the exact downloaded `google*.html` file. The worker will publish it unchanged, verify HTTP 200 and validate sitemap submission. This yields search/indexing evidence without adding visitor-side analytics cookies.
- **External blocker:** Search Console property creation/file download requires the user's Google account. No other World Discovery work is blocked.


## Worker 4 POD validation outcome — 2026-08-23

- **Assignment outcome:** Decision-grade first-pass validation committed in `hobby-dept-shop-manager` at `057358c1`; verdict **HOLD**, with no purchase, ad, order or publication.
- **Economics:** Existing base retail is EUR 38.99. Using current public Printify Gildan 18000 floors (EUR 15.55 production + EUR 6.43 shipping), conservative 19% VAT reserves and current Etsy Germany fees, modeled contribution is about **EUR 13.01** when EUR 6.43 shipping is charged separately. Absorbed free shipping lowers it to about **EUR 7.39**; 15% Offsite Ads lowers the modeled base case to about **EUR 4.90**.
- **Demand evidence:** Etsy exposes a 2,000+ item puzzle-sweatshirt market, multiple puzzle-specific five-star review spotlights, and an exact adjacent `In My Puzzle Era` listing with three reviews. Demand exists but competition is saturated and exact-concept volume is modest.
- **Blockers to GO:** The stored Printify readback omits provider-99 per-variant production costs and Germany shipping profiles; owner tax/VAT status, exact rights clearance, GPSR manufacturer/economic-operator fields, trader/Impressum and EU withdrawal handling also require confirmation.
- **Handoff / smallest reversible test:** First capture all 43 enabled variant costs and Germany shipping read-only through the existing authenticated bridge. Keep only variants with modeled contribution >= EUR 8. After compliance/tax confirmation and explicit owner approval, run one 30-day organic Etsy listing with no ads; GO only on a paid, non-refunded order with actual contribution >= EUR 8. HOLD below 100 qualified visits; KILL below EUR 5 actual contribution, unresolved compliance, or 100+ visits with zero orders after one thumbnail/title test.
- **Evidence:** `docs/puzzling-era-profit-validation-2026-08-23.md` in `gunflo1011-debug/hobby-dept-shop-manager`.


## CEO control point — 2026-08-23 21:20

- World Discovery and Worker 4 delivered evidence in their first assigned cycle.
- Things resolved the merge conflict (`247f3c7`, mergeable/rebaseable) but did not complete the required security, status-check and hosted happy-path evidence. This is **PARTIAL_PROGRESS**, not yet an orchestration failure; the next assignment is narrowed to evidence only.
- No new greenfield initiative is authorized. The next allocation decision follows exact POD costs, Things security proof and Search Console ownership.


## Worker 4 exact-cost outcome — 2026-08-23

- **Assignment outcome:** Completed. The authenticated read-only Printify bridge recorded all 43 enabled/available variants for product `6a8b0a6eec1479120c07b928` and provider-99 Germany shipping. No publish, product update, ad, order or payment occurred.
- **Exact evidence:** Production is USD 17.87 for S–XL, USD 20.57 for 2XL, USD 22.03 for 3XL and USD 24.86 for 4XL. Germany uses the provider's `REST_OF_THE_WORLD` profile: USD 15.00 first item, USD 10.00 additional item, 10-day handling time. Raw evidence is stored in `agent/last-response.json` from successful bridge run [32662688948](https://github.com/gunflo1011-debug/hobby-dept-shop-manager/actions/runs/32662688948).
- **Economics correction:** The authenticated USD 15.00 shipping cost is materially above the earlier public catalog floor. Using the 21 August 2026 ECB rate (EUR 1 = USD 1.1699), exact costs, conservative Printify/Etsy VAT reserves and current Etsy Germany fees, only **22 of 43** variants clear EUR 8 with buyer-paid shipping and no Offsite Ads; modeled contribution is EUR 8.13–9.38. The other 21 variants model at EUR 5.26–7.88 and fail the gate.
- **Kill configurations:** Free shipping models at EUR -5.96 to -1.84 for every variant. Buyer-paid shipping with a 15% Offsite Ads attribution models at EUR -4.20 to +0.53. Both configurations fail the portfolio gate for all 43 variants.
- **Implementation/evidence commits:** Read-only endpoint `893d241`; regression guard `9045129`; exact bridge command `0a3b391`; recalculated decision document `f9064fb`. Render health returned HTTP 200 at service version 0.10.1 before the economics read.
- **Handoff:** The autonomous cost dependency is closed. Do not publish yet. A future organic test is economically admissible only after restricting the draft to the 22 retained variants, charging exact buyer-paid shipping, confirming that Offsite Ads can remain disabled, completing tax/VAT, rights, GPSR, Impressum/trader and withdrawal review, and obtaining explicit owner approval.
- **Next decision:** CEO should choose conditional HOLD for the guarded 22-variant organic test or KILL the candidate due to its narrow EUR 8.13–9.38 pre-return/pre-labour margin. Publication remains an external approval step.


## World Discovery Worker handoff — Search Console acceptance readiness — 2026-08-23

- **Assignment outcome:** `READY_WAITING_EXTERNAL_FILE`. No product feature or client analytics was added.
- **Implemented:** strict unchanged-file validator for `site/google*.html`, npm acceptance command, focused regression coverage, and an exact deploy/readback/verification/sitemap procedure.
- **Indexability finding and correction:** public verification covered all 216 sitemap URLs and found exactly two sitemap pages without canonicals: `/methodology/` and `/status/`. Both absolute canonicals are now committed. The guard now checks every sitemap URL against its local file and exact canonical and also validates robots/sitemap origin consistency.
- **Root-cause guard correction:** the first new gate mapped the root sitemap URL to the `site/` directory rather than `site/index.html`; `234e292` fixes that root case. Canonical parsing was hardened against harmless HTML attribute ordering.
- **Evidence:** implementation culminates at `154e6c5c6d8a8710fd45036076d3aa153cb0069a`; procedure is `docs/search-console-acceptance.md`. Last independently confirmed live SHA remains `eeacb9e1f38b019c4fe631cee99b27016d0e24ac`; no claim is made that `154e6c5` is live until CI/Pages evidence is observable.
- **External blocker / next action:** the user must provide the original downloaded `google*.html` file for URL-prefix property `https://gunflo1011-debug.github.io/world-discovery-engine/`. The worker will publish it unchanged, validate exact HTTP 200/body readback, then complete Search Console verification and sitemap submission.
- **Demand/revenue truth:** remains `UNKNOWN / NOT INSTRUMENTED`; no zeros or revenue claims were invented.


## CEO control point — 2026-08-23 22:22

- **World Discovery delivered:** Search Console acceptance is ready at `154e6c5`; all 216 sitemap URLs were checked, two missing canonicals were fixed, and the exact-file acceptance/deploy procedure is guarded. The worker is now HOLD pending the original user-owned `google*.html` file. Last independently verified live release remains `eeacb9e`.
- **Worker 4 delivered:** authenticated read-only Printify economics closed the autonomous data gap. Only 22/43 variants model above the EUR 8 gate with buyer-paid shipping and no Offsite Ads; free shipping and Offsite Ads fail for every variant. POD remains conditional HOLD and receives no further capacity until legal/tax/owner decisions exist.
- **ORCHESTRATION_FAILURE — Things:** PR #3 remains draft at `247f3c7`, mergeable but unstable, with zero reported commit statuses and no new auth/security/concurrency/hosted-backend evidence for a second CEO cycle. Root cause is execution/ownership failure, not a new engineering blocker. Correction: Things Worker is frozen; Worker 4 owns an independent evidence-only audit. Merge remains prohibited until green.
- **Capital allocation decision:** no greenfield project. World Discovery and POD are externally blocked at their next decision gates, so Worker 4 is reallocated to the unresolved Things security risk.
- **User action outstanding:** provide the original Search Console HTML verification file and confirm Etsy VAT treatment (Kleinunternehmerregelung under §19 UStG or regular VAT). No publication or paid action is authorized.


## Worker 4 Things PR #3 security takeover — 2026-08-23

- **Assignment outcome:** `PARTIAL_GREEN_EXTERNAL_BLOCKER`. PR #3 remains draft, open and unmerged at head `24253e5d7b705dd66ecd182cfeb48878be00a991`; it is mergeable/rebaseable. Worker 4 found that the previously reported zero-status state concealed two real failing Actions runs and corrected their root causes.
- **Secret audit:** All 33 branch blobs were inspected. No `sb_secret_` key, service-role credential or privileged backend secret is bundled. The committed `sb_publishable_` key is intentionally low-privilege client configuration; authorization remains enforced by RLS. The client scanner now excludes its own rule source instead of falsely matching the literal `SUPABASE_SERVICE_ROLE` inside the scanner.
- **Fixes:** `4327af4` fixes the scanner self-match; `108bb67` corrects the pgTAP hosted-E2E smallint argument; `e224640` adds a read-only authenticated hosted-alpha CI gate; `24253e5` removes unsupported password-recovery telemetry without changing recovery behavior. No merge occurred.
- **Green evidence:** [Backend run 32665950230](https://github.com/gunflo1011-debug/asset-market-alpha/actions/runs/32665950230) passed database rebuild, all pgTAP auth/RLS tests, database lint and the real concurrency gate. In [mobile run 32665950216](https://github.com/gunflo1011-debug/asset-market-alpha/actions/runs/32665950216), the local mobile job passed secret scan, Expo dependency validation, strict TypeScript, alpha configuration and Android export.
- **Exact external blocker:** The hosted authenticated job stops fail-closed before contacting Supabase because repository secrets `ALPHA_TEST_EMAIL` and `ALPHA_TEST_PASSWORD` are absent. The required credentials are for a dedicated non-privileged closed-alpha user; no service-role or secret API key is requested. Without them, authenticated RPC, shared-catalog read and owner-only inventory isolation cannot be evidenced against the hosted project.
- **Handoff / next step:** Create or designate that hosted test user, store its email/password as the two GitHub Actions repository secrets, and rerun `mobile-alpha-ci`. Worker 4 should inspect that single run and return green hosted evidence or the exact failing contract. Keep PR #3 draft and do not merge until the hosted job passes.
- **Economic contribution:** The server-authoritative security and concurrency path is now green and permanently regression-gated, reducing breach/corruption risk and narrowing the remaining path to safe alpha evidence to one external credential setup rather than further product engineering.


## CEO control point — 2026-08-23 23:20

- **Things takeover materially succeeded:** PR #3 advanced to `24253e5`. Backend run `32665950230` is green through database rebuild, pgTAP auth/RLS, lint and real concurrency. In mobile run `32665950216`, the local mobile gate is green; only the new hosted authenticated job failed at its explicit credential precondition.
- **External blocker isolated:** repository secrets `ALPHA_TEST_EMAIL` and `ALPHA_TEST_PASSWORD` are absent. They must belong to a dedicated non-privileged hosted alpha user. No service-role key is requested. PR #3 remains draft and unmerged.
- **Orchestration incident status:** the prior Things execution failure is contained by the Worker 4 takeover. Ownership returns to Things only for a single post-secret acceptance rerun; further feature work remains prohibited.
- **Worker 4 reallocation:** while hosted credentials and Search Console ownership are external, Worker 4 validates the remaining POD policy/compliance assumptions from official sources. Etsy's current policy says shops that have never exceeded USD 10,000 in any consecutive 365-day period may opt out of Offsite Ads; this must be confirmed for the actual shop before relying on the no-Offsite-Ads margin model.
- **Revenue truth:** paying customers, revenue and net profit remain UNKNOWN. No publish, ad, order, payment or merge occurred.


## Worker 4 POD official-policy feasibility — 2026-08-23

- **Assignment outcome:** `HOLD_OWNER_EVIDENCE_REQUIRED`. Official Etsy, EU and German sources confirm that a guarded 22-variant organic test is feasible only after shop-specific and supplier-specific compliance evidence; no account setting, listing, ad, product, order, payment or publication was changed.
- **Offsite Ads decision:** Etsy permits opt-out only if the shop has never reached USD 10,000 in any consecutive 365-day period. After reaching it, participation is mandatory for the shop's lifetime at a 12% fee. The test is GO only with dated readback that the actual shop is eligible and opted out; mandatory participation is KILL at current pricing because it cannot close the existing margin gap.
- **GPSR/textile decision:** Before EEA/NI sale, obtain supplier-backed manufacturer contact, EU responsible person where required, finished-product identifier, variant-accurate fibre composition, warnings/safety languages, traceability and incident/recall evidence. Do not infer these from catalog copy. If Printify/provider 99 cannot supply them, exclude EEA/NI or kill the test.
- **Trader/withdrawal decision:** The commercial seller must expose correct trader/business and § 5 DDG identity details. The fixed design must use the normal EU 14-day withdrawal process; POD production after purchase does not by itself create the personalized-goods exception. A real EU return/defect workflow is required.
- **IP/tax decision:** Retain source artwork and licenses, disclose AI use and Printify as production partner, and document identical/similar wording and graphic searches before launch. Confirm the owner's actual § 19 UStG status and total prior/current-year turnover; the current thresholds are EUR 25,000 prior year and EUR 100,000 current year, but cross-border treatment and Etsy settings remain owner/tax facts.
- **Evidence:** Decision checklist committed in `hobby-dept-shop-manager` at `c6e0d42eb4039eb4cf42b97d14eeabc433558a11`, file `docs/puzzling-era-policy-feasibility-2026-08-23.md`, with direct official sources and explicit GO/HOLD/KILL gates.
- **Handoff / next step:** Owner supplies five evidence bundles: actual Offsite Ads eligibility/status; legal trader/Impressum identity; Printify/provider-99 GPSR and textile documents; artwork/font/mockup provenance plus search record; and VAT/turnover treatment. Only after all five are green and publication is expressly approved may the 30-day, one-listing, no-paid-traffic test proceed.
- **Economic contribution:** The research prevents launching a configuration whose advertising fee can erase the already narrow EUR 8.13–9.38 modeled contribution and converts broad legal uncertainty into five finite evidence gates.
