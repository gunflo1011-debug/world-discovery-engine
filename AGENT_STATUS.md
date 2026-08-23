# World Discovery — Agent Status

## North-star goal
Build a trustworthy, highly useful World Discovery data product that earns real organic/AI discovery and repeat usage; monetize later without degrading UX, performance, or trust.

## Fixed live reference
- Root: https://gunflo1011-debug.github.io/world-discovery-engine/
- Index: https://gunflo1011-debug.github.io/world-discovery-engine/index.html
- All generated/relative paths must work under `/world-discovery-engine/`.

## Current cycle goal
P0: MAKE THE LIVE 182-COUNTRY CORPUS REGION-AWARE. Add official region metadata once, then turn the long global list into useful, crawlable regional discovery without thin pages or manual country mappings.

## Operating rules
- BUILD FIRST, VERIFY ONCE: Workers 1–3 build product; Worker 4 alone owns the full release gate.
- NO MANUAL USER DEBUGGING: Worker 4 owns incidents end-to-end: logs/annotations/diff/relevant files → failure signature → root cause → fix commit → re-run evidence → close/open status. User action is allowed only for a genuine external permission/secret/account/irreversible-action block.
- Exactly one owner per task. No duplicate audits.
- Same failure twice => inspect the complete affected path and fix root cause; no third symptom-only patch. After two real unsuccessful fixes, change approach/owner or CEO intervenes directly.
- No re-run without code/config change unless evidence shows a transient infrastructure failure.
- A green closed blocker is not a recurring task.
- P0 WIP LIMIT = 1: WD-028 region-aware discovery is the only active product chain; WD-020 → WD-016 → WD-012 is closed LIVE VERIFIED.
- HARD EXECUTION GATE: while WD-020 is open, no worker may commit auxiliary formats, manifests, directories, source-page refreshes, wording, SEO/discovery helpers, unrelated tests, dependency/lockfile churn, CI/Pages refactors, or release refactors unless a concrete WD-020 execution failure proves that exact change is required.
- If Worker 4 cannot execute the official ingestion because its runtime lacks outbound World Bank access, it must record one exact failure and hand execution to the next runtime/worker with outbound access. It must not substitute another feature.
- CEO rejects auxiliary commits before WD-020 completion as process failure; useful-but-off-priority work does not count as cycle progress.

## Active taskboard

| ID | Pri | Owner | Status | Task / Definition of Done | Dependencies | Evidence / known attempts | Handoff / next action |
|---|---|---|---|---|---|---|---|
| WD-014 | P1 | Worker 1 | DONE | Deterministic official WDI ingestion for `IT.NET.USER.ZS`: explicit same-year fetch, country-metadata join, aggregate exclusion, invalid/null/mixed-year rejection, deterministic normalized artifact, explicit provenance, no automatic build-time overwrite. | none | `08e1935`, `701c5c7`, `7e43ecc`, `7338e5d`. | Frozen. Do not redesign. |
| WD-020 | P0 | CEO | DONE_LIVE | Run official ingestion for 2024 with explicit retrieval date. Review normalized diff before acceptance. Require real countries only, exact 2024, values 0–100, no duplicates, official provenance, and materially broader coverage than 12. Commit accepted normalized source. | WD-014 | 182 official non-aggregate observations are live at release `7f6b7f5`; all are exactly 2024, unique, numeric and within 0–100, with `official_same_year_snapshot` provenance. | Closed. |
| WD-016 | P0 | CEO → Worker 4 | DONE_LIVE | Regenerate parent HTML/JSON/CSV, country profiles/JSON/CSV/index/directory and AI discovery outputs from the accepted source. No manual rows and no unsupported global-ranking claims. | WD-020 | Release `7f6b7f5` publishes 182 parent records, profiles, JSON/CSV outputs, directory/sitemap routes and AI discovery entries; CI is green. | Closed. |
| WD-012 | P0 | CEO → Worker 4 | LIVE_VERIFIED | After WD-016, execute exactly one full release gate: CI → Pages → release SHA → core/machine routes → Playwright mobile. If red, own full incident chain automatically. | WD-020 + WD-016 | GitHub runs `32639508555` and `32639508623` are green for `7f6b7f5`: CI, Pages, exact `release-sha.txt`, live contracts and Playwright at 360/390/430 px all passed. | Closed. |
| WD-028A | P0 | Worker 1 | READY | Extend normalized Internet-use records with official World Bank region metadata; exclude aggregates, prohibit hand mappings, preserve deterministic provenance, and add schema/regression tests. | WD-020 | The ingestion metadata join already receives official country metadata. | Hand the accepted normalized schema to W2/W3. |
| WD-028B | P0 | Worker 2 | BLOCKED_WD028A | Add a fast region filter and accessible region directory to the parent experience; preserve no-JS access and mobile containment. | WD-028A | Current live page is one 182-row global list. | Focused UX tests, then hand off to W4. |
| WD-028C | P0 | Worker 3 | BLOCKED_WD028A | Generate a small set of substantial regional landing pages with original summaries, rankings scoped to the region, provenance, schema, canonical URLs and bidirectional links; no thin country/region combinations. | WD-028A | 182 live country records provide sufficient coverage. | Focused generator/discovery tests, then hand off to W4. |
| WD-028D | P0 | Worker 4 | RELEASE_OWNER_BLOCKED | Integrate A–C and execute one full release gate with CI, Pages, exact SHA, core/machine/regional routes and 360/390/430 px smoke. | WD-028A + WD-028B + WD-028C | No work before build handoff. | LIVE VERIFIED or one owned incident chain. |
| INC-001 | P0 | Worker 4 | ROOT_CAUSE_IDENTIFIED_WAITING_VERIFICATION | Repeated generated-site/build-test failure family must be treated as one incident, not a sequence of symptom patches. DoD: inspect package scripts → generator ordering/shared outputs → Node test runner/concurrency → CI workflow → Pages build; state one failure signature/root cause, commit durable fix only if still required, and attach verification run. | none | Full-path review: multiple Node tests execute builders that mutate the same checked-in `site/` outputs; prior parallel Node test execution therefore allowed nondeterministic inter-test mutation. `196e3cd` serializes generated-site tests. Adjacent commits `71d9122`, `b89be57`, `818e583`, `4a0596c`, `c44ca31` address separate deterministic generator/string-contract brittleness and are not evidence that the race persisted after serialization. | Do not add another mini-patch. Keep `--test-concurrency=1`; if the same race signature reappears, change subsystem approach to isolated temporary build roots rather than more timing/regex fixes. Close only after one observed green verification run. |
| WD-026 | P2 | Worker 3/4 | REJECTED_SCOPE_DRIFT | Citation-ready AI discovery expansion and supporting build/test/release changes landed while WD-020 remained open. | none | `cfa2f190`, `088dff88`, `ccaf6015`, `34e4d04b`, `f070048d`. | Freeze. |
| WD-027 | P2 | Worker 4 | REJECTED_SCOPE_DRIFT | Playwright lockfile regeneration and CI/Pages switch to `npm ci` landed without evidence that WD-020 execution required these changes. | none | `a9e5993`, `c104da4`, `5982dcb`. | Freeze unless INC-001/full release evidence proves relevance. |
| WD-025 | P2 | Worker 1/3/4 | REJECTED_SCOPE_DRIFT | Refreshed `/sources/` discovery page and added live smoke while WD-020 was open. | none | `b13eb016`, `3c1defe`, `ec7bb565`, `296e156`. | Freeze. |
| WD-024 | P2 | Worker 3 | INTEGRATED_FROZEN | AI discovery manifest `/ai-index.json` and `/llms.txt` generated from REAL/CURRENT_VERIFIED source data and covered by live smoke. | existing source | Integrated. | Freeze until coverage expansion is released. |
| WD-015 | P2 | Worker 2 | INTEGRATED_FROZEN | Country search/filter, comparison and generated crawlable discovery pages. | existing source | Integrated. | No additional UX until expanded corpus exposes a concrete need. |
| WD-009 | P2 | Worker 1 | PAUSED | Population audit only on concrete regression. | none | Multi-country archived population evidence improved, including archived country-identity verification (`54e5d331`). | Do not spend scaling cycle on generic audit. |

## Incident ledger
| Incident | Failure signature | Root Cause | Fix commit | Verification run | State |
|---|---|---|---|---|---|
| INC-001 | Generated-site tests intermittently observe/mutate shared `site/` artifacts while other builder-driven tests are also running | Node tests invoke Internet-use builders against the same repository `site/` tree; parallel test execution made generated outputs a shared mutable resource. | `196e3cd` (`node --test --test-concurrency=1`) | Full CI/Pages/live run `32639508623` passed without the race signature. | CLOSED |

## Completed / condensed evidence
- Internet-use production slice exists with CURRENT_VERIFIED same-year semantics, Human/JSON/CSV, provenance and generated country discovery.
- Official WDI ingestion layer is implemented and tested and intentionally explicit/reviewable.
- Country profiles, country JSON/CSV, registry/directory and AI discovery outputs derive from normalized source.
- Population evidence includes validated archived country identity across vintages.
- `site/release-sha.txt` provides commit-exact release identity.

## Current product evidence / release state
- DATA: WD-020 LIVE. `site/indicators/internet-use/data.json` contains 182 official, non-aggregate 2024 observations with `coverage.type = official_same_year_snapshot` and official API provenance.
- WD-020 OUTBOUND INCIDENT (2026-08-23): the earlier Worker 4 runtime could not resolve GitHub or World Bank. CEO handed execution to a runtime with outbound access, ran the existing ingestor unchanged, and removed the blocker without substituting data.
- DISCOVERY: sufficient for this phase and frozen.
- RELEASE: `7f6b7f596e819450ce19687a90441f3056ef32c6` is LIVE VERIFIED. CI, Pages, exact release identity, live contracts and mobile smoke at 360/390/430 px passed. INC-001 is closed by the same non-redundant product release.
- RELEASE INCIDENT: `6a74325` exposed missing fresh-checkout fixtures; `f445710` fixed the release order and passed CI/deploy/live contracts. Its browser gate exposed one grouped expanded-corpus/mobile contract incident. Counts, Pages-base URLs and the parent selector are fixed. The final 696 px overflow is root-caused to an unwrapped 680 px Sources table—not navigation—and now has a scroll-container regression guard.
- NEXT VALUE: WD-028 region-aware discovery turns the 182-country corpus into a faster comparison experience and a bounded set of useful, crawlable entry pages.

## CEO process correction — 2026-08-23
The post-gate commits `71d9122` → `c44ca31` show another anti-loop violation: multiple narrowly-scoped build/test fixes were committed while WD-020 remained open. Worker 4 must own the complete incident chain and consolidate root cause/evidence rather than emitting further symptom patches. W4's consolidated review attributes the nondeterministic generated-artifact failure family to parallel tests mutating shared `site/` outputs; `196e3cd` serializes those tests. The later copy/assertion changes are separate deterministic contract fixes, so they do not by themselves prove the race mitigation failed. This incident does not relax the data-expansion priority.

## Anti-loop environment note
A worker runtime DNS/network failure is not a product regression. Do not repeatedly retry an unavailable path without a new signal. For WD-020, one failed outbound attempt with exact evidence is enough to hand execution to another runtime. Never replace official data with hand-entered rows.
