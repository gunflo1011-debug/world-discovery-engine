# World Discovery — Agent Status

## North-star goal
Build a trustworthy, highly useful World Discovery data product that earns real organic/AI discovery and repeat usage; monetize later without degrading UX, performance, or trust.

## Current cycle goal
Close release/live evidence gaps first, then ship one source-to-live vertical data improvement with verified provenance and discovery output.

## Operating rules
- Every worker starts by reading this file and syncing to current `main`.
- Exactly one owner per active task. Helpers do not duplicate owner work.
- Status: `TODO | IN_PROGRESS | BLOCKED | DONE`. Priority: `P0 | P1 | P2`.
- `DONE` requires implementation + relevant checks + main integration + live verification where possible.
- After 2 materially failed attempts: change approach/scope/owner or explicitly deprioritize. Do not hourly-loop blocked work without new evidence.
- Update this board after substantive work. Preserve failures and the next reproducible action; compact old DONE history.

## Active taskboard

| ID | Pri | Owner | Status | Task / Definition of Done | Dependencies | Last evidence | Failed approaches / blocker | Handoff / next action |
|---|---|---|---|---|---|---|---|---|
| WD-001 | P0 | Worker 1 | IN_PROGRESS | Verify latest CI + Pages deployment and live critical routes. DoD: evidence for test/build/deploy result plus HTTP/live checks for `/`, `/indicators/`, `/indicators/real-gdp/`, `/indicators/real-gdp/status.json`, `/sitemap.xml`, `/robots.txt`, and one canonical evidence page + machine artifact; failures have concrete logs/root cause. | main release workflow | `e950b7f` Worker-4 handoff: repo/build state integrated but CI/Pages/live remained YELLOW. | Connector previously could not retrieve push-triggered runs; local clone DNS failed; public live fetch unavailable in that run. Do not repeat same method twice without changing approach. | Try independent public/live verification and available Actions evidence; if externally impossible, retain BLOCKED with minimal human check rather than claiming green. |
| WD-002 | P1 | Worker 2 | TODO | Resolve real-GDP methodology comparability or produce a decisive fail-closed research memo. DoD: release-specific base-year/valuation comparability supported by official provenance, OR explicit evidence that it cannot be established and recommendation to replace/deprioritize this indicator. No revision values published until proven. | WD-001 not required | `e950b7f`: `NY.GDP.MKTP.KD` exists in screened archives; `publishableRevisionData:false`, `BLOCKED_METHODOLOGY_COMPARABILITY`. | Existing archive-row presence is insufficient to prove vintage comparability. | Investigate official WDI metadata/release documentation; after two failed evidence paths, propose a better indicator rather than looping. |
| WD-003 | P1 | Worker 3 | TODO | Design and implement the next high-value vertical slice using verified official data. DoD: source/provenance → normalized data → useful human page/feature → machine-readable output/schema → internal links → tests; integrate to main only when fail-closed checks pass. | Prefer WD-001 green; may prepare without claiming live | Existing verified population evidence + indicator registry; discovery hardening in `c5e3b80`, `64c5cf1`, `d4f3c4b`. | Avoid synthetic/demo content and thin page multiplication. | Choose a query-worthy, comparable official-data use case with repeat/discovery value; coordinate route ownership with W4. |
| WD-004 | P1 | Worker 4 | TODO | Improve product UX/discovery around verified content without conflicting with W3 data files. DoD: mobile/accessibility/navigation/internal-link improvement with tests, plus rendered/live evidence once deploy is verified. | Coordinate with WD-003 routes; live evidence via WD-001 | `e950b7f`: responsive CSS/focus states exist but true 360–430px live/browser smoke not independently verified. | Prior run could not render live site. | Own shell/navigation/accessibility/discovery surfaces, not W3 source/data pipeline. Validate keyboard/mobile and canonical/internal linking. |

## Recently completed / condensed evidence
- Deployment workflow now runs install + `npm run check` before Pages upload and watches relevant source/test/build paths (`5a25d60`, `53816e0`).
- Demo/noindex evidence is excluded from discovery outputs; synthetic GDP demo is `noindex`; legacy duplicate population page canonicalized/noindexed (`c5e3b80`, `b922050`, `612af86`).
- Broken population-total registry link removed; critical release smoke tests added (`e1d0503`, `64c5cf1`, `d4f3c4b`).
- Worker-4 integration/release handoff consolidated at `e950b7f`.

## Current product evidence / release state
- DATA: GREEN for verified population evidence; real-GDP revision values remain correctly blocked pending methodology comparability.
- DISCOVERY (repo/build): GREEN for sitemap/noindex/canonical hardening.
- TESTS / DEPLOYMENT / LIVE / rendered mobile UX: YELLOW until independently verified.

## CEO process note
This cycle switches from a serial `W1→W2→W3→W4` queue to bounded parallel ownership: W1 release/live verification; W2 methodology research; W3 next vertical data slice; W4 shell/UX/discovery. Files/routes must be partitioned before implementation to avoid conflicts. W3/W4 may proceed while W1 verifies, but neither may claim live DoD until WD-001 supplies evidence.