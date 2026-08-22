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
| WD-005 | P0 | CEO | IN_PROGRESS | Automated 360/390/430px browser smoke on homepage + core evidence route; horizontal overflow, nav visibility, console/page errors; failure artifacts. DONE only after green post-deploy run. | Pages workflow | CEO commits `8060975`, `b1b97cd`: Playwright live test + Chromium CI + failure artifact upload. Manual device screenshots were already green. | Worker 4 verifies the first CI execution; if runner/package resolution fails, repair implementation rather than reverting to manual screenshots. |
| WD-006 | P1 | Worker 1 | IN_PROGRESS | Release/discovery QA for current main. DoD: intended SHA proven by live marker, critical routes/discovery metadata pass, no broken/noindex leakage. | Pages workflow | Commit marker exists; live routes/discovery checks are post-deploy. | Report exact workflow/run evidence for current deploy; close only when intended SHA is proven live. |
| WD-003 | P1 | Worker 3 | IN_PROGRESS | Ship next high-value verified vertical slice. DoD: official source/provenance → normalization → useful human page/feature → JSON/CSV → internal links/schema → tests → live evidence. | WD-007 DONE | WD-007 nominated `IT.NET.USER.ZS` as GO for a current/latest verified vertical only. Existing machine-discovery completeness work is reusable. | Build Internet use by country from current official WDI/ITU-backed observations. Keep observation year visible; do not claim cross-vintage revisions. |

## Completed / condensed evidence
- WD-007 DONE: screened Internet use, life expectancy and GDP growth; nominated `IT.NET.USER.ZS` — Individuals using the Internet (% of population) — as next current/latest verified vertical (`7945c1e`). GO is limited to current/latest observations; archive-revision claims remain NO-GO without release-specific historical methodology. Required attribution/provenance: WDI retrieval + observation year, `% of population`, ITU source/citation, CC BY-4.0 note, same normalized records for human/JSON/CSV.
- WD-002 DONE: Real-GDP revision publication decisively fail-closed (`418ddf07`, `048939b`). Public status semantics were corrected on current main (`5d5c6b4`): rows present in both vintages are not labeled methodologically comparable.
- WD-001 DONE: workflow #76 green after test-contract fixes (`62aeaed`, `cb44b1e`); real-device mobile rendering green.
- CEO `8a30244`: `site/release-sha.txt` makes current release identity commit-exact.
- `0a209077`: post-deploy verification covers evidence and machine endpoints.
- Worker 3 machine-discovery hardening: `da279cb`, `55ce36e`, `895da4d` plus earlier discovery enrichment.
- Population remains the verified production data family; demo/noindex evidence excluded from discovery.

## Current product evidence / release state
- DATA: GREEN for verified population evidence; Real GDP remains correctly fail-closed; Internet-use vertical is nominated but not yet production-verified.
- DISCOVERY: machine-readable discovery hardened and live-checked.
- MOBILE: manual device evidence GREEN; automated Playwright smoke is now implemented but awaiting first green CI evidence.
- CI/DEPLOY/LIVE: `DEPLOY PENDING` for current main until the new browser-smoke release completes; do not classify pending CI as failure.

## CEO process note
Repeated manual mobile verification crossed the anti-repeat threshold. Root cause was absence of a real browser in the release contract. CEO implemented Playwright/Chromium post-deploy checks at 360/390/430px with screenshots and failure artifact retention. WD-005 remains IN_PROGRESS only because live-relevant work cannot be DONE until its first automated run is green.