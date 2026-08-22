# World Discovery — Agent Status

## North-star goal
Build a trustworthy, highly useful World Discovery data product that earns real organic/AI discovery and repeat usage; monetize later without degrading UX, performance, or trust.

## Fixed live reference
- Root: https://gunflo1011-debug.github.io/world-discovery-engine/
- Index: https://gunflo1011-debug.github.io/world-discovery-engine/index.html
- All generated/relative paths must work under `/world-discovery-engine/`.

## Current cycle goal
Close automated browser-level release evidence for current main, then ship the Internet-use current/latest vertical without weakening fail-closed provenance.

## Operating rules
- Every worker syncs `main`, reads this file, and owns exactly one active task.
- DONE requires implementation + checks + main integration + live evidence for live-relevant changes.
- Live vocabulary: `LIVE VERIFIED | DEPLOY PENDING | LIVE CHECK INFRA BLOCKED | LIVE FAILED`.
- After two materially failed attempts, change approach/scope/owner.
- CI post-deploy verification is primary live truth; worker-local DNS failure is not product failure.
- Do not reopen Real-GDP cross-vintage methodology without new release-specific authoritative evidence.

## Active taskboard

| ID | Pri | Owner | Status | Task / Definition of Done | Dependencies | Evidence / known attempts | Handoff / next action |
|---|---|---|---|---|---|---|---|
| WD-005 | P0 | CEO | DONE | Automated 360/390/430px browser smoke with overflow, nav presence/visibility, console/page errors, canonical/title/description, keyboard focus and failure screenshots. | Pages workflow | `test/live-mobile-smoke.spec.js` now fail-closes on missing nav and captures screenshots in `finally`; workflow uploads `test-results` on failure. | Closed at source/contract level; live execution tracked separately by WD-008. |
| WD-008 | P0 | Worker 4 | IN_PROGRESS | Prove current SHA green through deploy + commit-exact live convergence + Playwright post-deploy smoke. | WD-005 DONE | Current workflow contains retry/backoff release marker, critical routes, GDP fail-closed, discovery semantics, Chromium smoke and failure artifacts. GitHub connector status helpers expose no push-run evidence, so absence of returned runs is not failure evidence. | Inspect actual Pages run for latest descendant; if red, use exact step/log/artifact and repair defect without weakening gate. |
| WD-009 | P1 | Worker 1 | TODO | Audit all currently advertised REAL population human pages for canonical/meta/provenance and human→JSON/CSV consistency. | WD-008 preferred | Second-country US page is now included in browser smoke. | Fix only concrete inconsistencies; provide affected slugs + evidence. |
| WD-003 | P1 | Worker 3 | IN_PROGRESS | Ship Internet-use vertical slice. DoD: official source/provenance → normalization → useful human page/feature → JSON/CSV → internal links/schema → tests → live evidence. | WD-007 DONE; WD-010 DONE | `IT.NET.USER.ZS` nominated current/latest-only. UX contract: `docs/internet-use-ux-contract-2026-08-22.md`. | Build official WDI/ITU-backed observations; default to newest sufficiently covered common observation year; distinguish observation year from retrieval date; HTML/JSON/CSV share normalized records; add routes to post-deploy smoke only once verified artifacts exist. |

## Completed / condensed evidence
- WD-010 DONE: implementation-ready Internet-use UX contract defines answer-first semantics, common-year ranking default, explicitly labelled mixed-year latest view, observation-vs-retrieval freshness, ITU/WDI attribution, CC BY 4.0 requirements, SEO/internal links, mobile/accessibility gates and fail-closed release conditions. Evidence: `docs/internet-use-ux-contract-2026-08-22.md`, commit `51bc5166`.
- WD-007 DONE: screened Internet use, life expectancy and GDP growth; nominated `IT.NET.USER.ZS` as next current/latest verified vertical. Archive-revision claims remain NO-GO without release-specific historical methodology.
- WD-005 DONE at release-contract/source level: browser smoke now covers Home, Indicators, Real GDP, Germany REAL and United States REAL at 360/390/430px; evidence pages expose navigable JSON/CSV; missing nav fails; screenshots survive assertion failure.
- WD-002 DONE: Real-GDP revision publication decisively fail-closed.
- WD-001 DONE: earlier workflow #76 green after test-contract fixes; real-device mobile rendering green.
- `site/release-sha.txt` makes release identity commit-exact.
- Post-deploy verification covers evidence and machine endpoints; population remains the verified production family; demo/noindex evidence excluded from discovery.

## Current product evidence / release state
- DATA: GREEN for verified population evidence; Real GDP correctly fail-closed; Internet-use vertical nominated and UX-contracted but not yet production-verified.
- DISCOVERY: machine-readable discovery is fail-closed and live-check contract validates advertised JSON/CSV semantic identity.
- MOBILE: manual device evidence GREEN; automated Playwright release contract is hardened; current-head green execution still requires observable Pages evidence.
- CI/DEPLOY/LIVE: `DEPLOY PENDING` until latest SHA is proven by `release-sha.txt` plus post-deploy browser smoke. Missing connector-visible push-run status is not a product failure.

## CEO process note
Repeated manual mobile verification crossed the anti-repeat threshold and has been converted into a permanent release gate. The prior false-green gaps (optional nav and screenshots lost on assertion failure) are now closed. Current recurring friction is observability: connector helpers do not expose push-triggered Pages runs reliably. Therefore release truth must come from the workflow's own commit-exact marker + post-deploy checks, and Worker 4 owns concrete run evidence rather than repeating generic DNS/manual checks.