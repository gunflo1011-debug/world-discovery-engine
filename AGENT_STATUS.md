# World Discovery — Agent Status

## North-star goal
Build a trustworthy, highly useful World Discovery data product that earns real organic/AI discovery and repeat usage; monetize later without degrading UX, performance, or trust.

## Fixed live reference
- Root: https://gunflo1011-debug.github.io/world-discovery-engine/
- Index: https://gunflo1011-debug.github.io/world-discovery-engine/index.html
- All generated/relative paths must work under `/world-discovery-engine/`.

## Current cycle goal
Scale Internet use (`IT.NET.USER.ZS`) from the verified launch slice into a reproducible official-data pipeline and broader same-year product. Do not manually grow rows. Preserve same-year semantics, provenance and machine/human identity. Country discovery pages must scale automatically with the dataset.

## Operating rules
- BUILD FIRST, VERIFY ONCE: Workers 1–3 build product; Worker 4 alone owns the full release gate.
- Workers 1–3 run only checks directly relevant to their own changes.
- Exactly one owner per task. No duplicate audits.
- DONE requires implementation + directly relevant checks + integration; Worker 4 supplies release/live evidence once per changed release.
- Live vocabulary: `LIVE VERIFIED | DEPLOY PENDING | LIVE CHECK INFRA BLOCKED | LIVE FAILED`.
- Same failure twice => inspect the complete affected path and fix root cause; no third symptom-only patch.
- A green closed blocker is not a recurring task.

## Active taskboard

| ID | Pri | Owner | Status | Task / Definition of Done | Dependencies | Evidence / known attempts | Handoff / next action |
|---|---|---|---|---|---|---|---|
| WD-014 | P0 | Worker 1 | READY | Build deterministic official WDI ingestion for `IT.NET.USER.ZS`: fetch/normalize same-year observations, reject aggregates/mixed years/invalid values, preserve retrieval/source metadata, and produce a reviewable normalized artifact without silently overwriting verified production data. | current verified source artifact | Existing builder validates normalized production data but does not ingest official observations. | Implement ingestion + focused fixtures/tests; hand normalized contract to W3. |
| WD-018 | P0 | Worker 4 | READY | Remove the hard-coded `index.countries.length !== 12` release assertion before dataset expansion. Release verification must compare generated country-index count against generated source/build metadata, not a launch-slice constant; retain duplicate/code/sitemap/profile checks. | current Pages workflow | CEO found the scaling trap in current `.github/workflows/pages.yml`; otherwise WD-016 would intentionally break the release gate as soon as coverage exceeds 12. | Fix once before/with the next release-relevant change; do not perform an extra live cycle solely to re-check old green infrastructure. |
| WD-016 | P0 | Worker 3 | BLOCKED | Use deterministic ingestion to expand official same-year 2024 coverage substantially beyond 12 countries; one source → HTML/JSON/CSV/country profiles; counts and wording dynamic; no manual row expansion. | WD-014 + WD-018 | Country pages are now generated automatically and discovery outputs include them, but official ingestion is still missing and Pages currently hard-codes count 12. | Wait for ingestion contract and scalable release assertion, then expand reproducibly. |
| WD-015 | P1 | Worker 2 | INTEGRATED | Country search/filter and accessible two-country comparison plus generated crawlable country discovery pages. | generated page builder | Commits `7b34a9b`, `f8fa094`, `d9a7e41`, `74492a4`, `8001c5c`, `10acd4b` show lookup UX, generated profiles, discovery outputs and release-gate coverage. | Do not add more UI until coverage scales; then improve comparison only from observed user/product need. |
| WD-012 | P0 | Worker 4 | WAITING_FOR_CHANGES | Integrate changed product and execute one full release gate: CI → Pages → release SHA → core/machine routes → Playwright mobile. | release-relevant W1–W3 changes | Previous Internet-use deployment was directly evidenced green. New country-profile release checks are on main. | Combine WD-018 with next release cycle; verify once after substantive changes land. |
| WD-009 | P2 | Worker 1 | PAUSED | Audit REAL population pages only when a concrete inconsistency/regression is reported. | none | No current blocker. | Do not spend scaling cycle on generic audit. |

## Completed / condensed evidence
- WD-003 DONE: Internet-use production slice exists with `CURRENT_VERIFIED`, `IT.NET.USER.ZS`, same-year semantics, Human/JSON/CSV, provenance, canonical, Dataset JSON-LD and discovery.
- WD-017 DONE: deterministic builder validates normalized Internet-use JSON and generates HTML/CSV from one source.
- Country discovery generation is integrated: `74492a4` builds crawlable per-country profiles; `8001c5c` adds them to site build; `9bfe178` adds discovery outputs; `10acd4b` adds Pages release gating.
- WD-013 DONE: population revision comparison mobile density improved.
- WD-011 DONE: homepage coverage/evidence semantics corrected.
- WD-008 DONE: Node/Playwright release-chain root causes fixed; do not reopen without a new regression.
- WD-010 DONE: Internet-use UX/data semantics contract established.
- `site/release-sha.txt` provides commit-exact release identity.

## Current product evidence / release state
- RELEASE INFRA: prior release green/closed. New scaling-specific issue is known before it becomes a failure: Pages country-profile verification hard-codes 12 and must become data-driven before WD-016 expansion.
- DATA: launch dataset still needs official deterministic ingestion; this is the main scaling bottleneck.
- UX/DISCOVERY: lookup/comparison plus generated crawlable country pages now exist; each generated country route carries canonical/structured context and links back to source distributions.
- NEXT VALUE: official ingestion → data-driven release-count assertion → broader same-year coverage → one W4 release verification.

## CEO process note
The prior CI/debug loop remains closed. This cycle builds the machine that scales World Discovery. The CEO proactively identified a future scaling failure in the new release gate rather than waiting for WD-016 to trigger a red deployment. W4 owns the one-time correction as part of the next substantive release; no standalone re-check loop.