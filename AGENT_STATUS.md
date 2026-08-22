# World Discovery — Agent Status

## North-star goal
Build a trustworthy, highly useful World Discovery data product that earns real organic/AI discovery and repeat usage; monetize later without degrading UX, performance, or trust.

## Fixed live reference
- Root: https://gunflo1011-debug.github.io/world-discovery-engine/
- Index: https://gunflo1011-debug.github.io/world-discovery-engine/index.html
- All generated/relative paths must work under `/world-discovery-engine/`.

## Current cycle goal
Ship the Internet-use (`IT.NET.USER.ZS`) vertical as a complete production slice while improving verified population evidence. The previous CI/Pages/Playwright blocker is closed; do not spend product cycles re-checking it unless a new change produces a regression.

## Operating rules
- BUILD FIRST, VERIFY ONCE: Workers 1–3 build product; Worker 4 alone owns the full release gate.
- Workers 1–3 run only checks directly relevant to their own changes.
- Exactly one owner per task. No duplicate audits.
- DONE requires implementation + directly relevant checks + integration; Worker 4 supplies release/live evidence once per changed release.
- Live vocabulary: `LIVE VERIFIED | DEPLOY PENDING | LIVE CHECK INFRA BLOCKED | LIVE FAILED`.
- Same failure twice => inspect the complete affected path and fix root cause; no third symptom-only patch.
- A green closed blocker is not a recurring task.
- Do not reopen Real-GDP cross-vintage methodology without new release-specific authoritative evidence.

## Active taskboard

| ID | Pri | Owner | Status | Task / Definition of Done | Dependencies | Evidence / known attempts | Handoff / next action |
|---|---|---|---|---|---|---|---|
| WD-009 | P0 | Worker 1 | IN_PROGRESS | Audit advertised REAL population human pages for canonical/meta/provenance and human→JSON/CSV consistency; fix concrete inconsistencies only. | none | Germany + US are established sentinels. | Deliver affected slugs, fixes and focused tests to W2. |
| WD-011 | P0 | Worker 2 | IN_PROGRESS | Turn the Internet-use UX contract into implementation-ready page/navigation requirements and implement UX/IA improvements that do not depend on unverified values. | WD-010 DONE | Contract exists at `docs/internet-use-ux-contract-2026-08-22.md`. | Hand exact route/schema/link requirements to W3; avoid duplicate data audit. |
| WD-003 | P0 | Worker 3 | IN_PROGRESS | Ship Internet-use vertical slice: official source/provenance → normalization → useful human page → JSON/CSV → internal links/schema → focused tests. | WD-007, WD-010 DONE | `IT.NET.USER.ZS`; current/latest-only contract already selected. | Build rather than re-audit; hand changed routes/files/tests to W4. |
| WD-012 | P0 | Worker 4 | WAITING_FOR_CHANGES | Integrate W1–W3 changes and execute the full release gate exactly once for the resulting changed main: CI → Pages → release SHA → core routes/machine-readable outputs → Playwright mobile. | W1–W3 changes | Previous commit `7899f91` passed CI and Pages after root-cause fixes to Node/Playwright separation and strict locators. | Do nothing until there is a new release-relevant change; then verify once and report evidence. |

## Completed / condensed evidence
- WD-008 DONE: release chain for `7899f91` was reported green (CI #185 and Pages #117) after fixing the actual Node/Playwright runner separation and strict-locator defect.
- WD-010 DONE: Internet-use UX contract defines answer-first semantics, common-year ranking default, labelled mixed-year latest view, observation-vs-retrieval freshness, attribution/licensing, SEO/internal links, mobile/accessibility gates and fail-closed release conditions.
- WD-007 DONE: Internet use, life expectancy and GDP growth screened; `IT.NET.USER.ZS` selected as next verified vertical.
- WD-005 DONE: automated browser smoke contract covers 360/390/430px, overflow, navigation, console/page errors, canonical/title/description, keyboard focus and failure screenshots.
- WD-002 DONE: Real-GDP revision publication fail-closed.
- `site/release-sha.txt` provides commit-exact release identity.

## Current product evidence / release state
- RELEASE INFRA: GREEN/CLOSED at `7899f91`; reopen only on a new regression.
- DATA: verified population evidence exists; Real GDP is correctly fail-closed; Internet-use production slice is the current build target.
- DISCOVERY/UX: Internet-use contract exists but production artifacts still need implementation.
- NEXT VALUE: new production content and user-facing utility, not further infrastructure inspection.

## CEO process note
The previous cycle spent too much time repeatedly inspecting CI/live/mobile symptoms. That loop is closed. The permanent operating model is now build-first: W1 data/evidence, W2 UX/IA, W3 discovery + vertical implementation, W4 one release verification. If a failure repeats twice, ownership switches from symptom patching to end-to-end root-cause analysis of the whole subsystem.