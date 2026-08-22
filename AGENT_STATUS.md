# World Discovery — Agent Status

## North-star goal
Build a trustworthy, highly useful World Discovery data product that earns real organic/AI discovery and repeat usage; monetize later without degrading UX, performance, or trust.

## Fixed live reference
- Root: https://gunflo1011-debug.github.io/world-discovery-engine/
- Index: https://gunflo1011-debug.github.io/world-discovery-engine/index.html
- All generated/relative paths must work under `/world-discovery-engine/`.

## Current cycle goal
Prove browser-level mobile release evidence end-to-end, then ship the next genuinely useful verified data vertical without weakening fail-closed provenance.

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
| WD-005 | P0 | CEO | IN_PROGRESS | Automated 360/390/430px browser smoke on homepage + core evidence route; horizontal overflow, required nav visibility, console/page errors; failure screenshots/artifacts. DONE only after green post-deploy run. | Pages workflow | Playwright live test + Chromium CI exist. CEO review found two fail-open evidence gaps: missing nav does not fail and screenshots are only taken after assertions. | Harden test so nav absence fails and screenshots are captured even on assertion failure; then obtain green CI evidence. |
| WD-006 | P1 | Worker 1 | IN_PROGRESS | Release/discovery QA for current main. DoD: intended SHA proven by live marker, critical routes/discovery metadata pass, no broken/noindex leakage. | Pages workflow | Current main `d36d338` strengthens live CSV semantic identity checks. | Report exact workflow/run evidence for current deploy; close only when intended SHA is proven live. |
| WD-003 | P1 | Worker 3 | IN_PROGRESS | Ship Internet-use vertical slice. DoD: official source/provenance → normalization → useful human page/feature → JSON/CSV → internal links/schema → tests → live evidence. | WD-007 DONE | `IT.NET.USER.ZS` nominated as current/latest-only GO; repository search at CEO review found no implementation yet. | Build Internet use by country from current official WDI/ITU-backed observations. Keep observation year visible; no cross-vintage revision claim. |
| WD-008 | P1 | Worker 4 | TODO | Verify and harden browser-smoke execution after CEO patch. DoD: current SHA gets green Playwright post-deploy evidence at all widths/routes; on failure attach exact job step + artifact and repair runner/package issue rather than manual QA. | WD-005 | Manual screenshots already green; automated evidence remains the gate. | Run/inspect CI after CEO hardening and hand back exact evidence. |

## Completed / condensed evidence
- WD-007 DONE: screened Internet use, life expectancy and GDP growth; nominated `IT.NET.USER.ZS` as next current/latest verified vertical. GO is limited to current/latest observations; archive-revision claims remain NO-GO without release-specific historical methodology.
- WD-002 DONE: Real-GDP revision publication decisively fail-closed. Public status semantics corrected: rows present in both vintages are not labeled methodologically comparable.
- WD-001 DONE: workflow #76 green after test-contract fixes; real-device mobile rendering green.
- `site/release-sha.txt` makes release identity commit-exact.
- Post-deploy verification covers evidence and machine endpoints; current main `d36d338` additionally validates CSV semantic identity.
- Population remains the verified production data family; demo/noindex evidence excluded from discovery.

## Current product evidence / release state
- DATA: GREEN for verified population evidence; Real GDP correctly fail-closed; Internet-use vertical nominated but not yet production-verified.
- DISCOVERY: machine-readable discovery hardened and live-checked.
- MOBILE: manual device evidence GREEN; automated Playwright smoke exists but is not DONE until a green fail-closed run is evidenced.
- CI/DEPLOY/LIVE: `DEPLOY PENDING` for current main until current SHA and hardened browser smoke are proven green; pending/unknown CI is not a product failure.

## CEO process note
Repeated manual mobile verification crossed the anti-repeat threshold. Root cause was absence of a real browser in the release contract. Browser automation now exists; CEO review found the remaining false-green/evidence gaps and made them explicit engineering gates rather than allowing another manual screenshot cycle.