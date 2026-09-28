# World Discovery Revenue Agent Board

_Last CEO evidence update: 2026-09-28_

## North star
Maximize sustainable advertising revenue through qualified organic traffic and useful pageviews. No spam, doorway pages, fabricated data, or low-value mass content.

## Current evidence
- `/explore/` Qlik-style Visual Analytics is live with exact-year historical comparisons; public crawl on 2026-09-23 shows the complete filter/selection + X/Y/Bubble + Scatter/Ranking/KPI/Insight shell.
- PRs #233–#236 remain merged; exact-year/no-backfill QA, latest-first loading and stale hydration guards are complete. Do not reopen without new evidence.
- Worker 1 completed the narrow Explorer UX/accessibility assignment with exactly two reversible treatments: #237 adds programmatic control labels/accessibility names plus polite Quick Insight announcements; #239 keeps the full filter workflow available at <=980px. #239 head `7cc27acb` passed CI #1605 before merge. Main after #239 is `f92e79c89a6b4c5fb4a5ae1c50a6871c3838b600`.
- Worker 2's contextual GDP-per-capita → Explorer handoff #238 is merged; keep broader Explorer distribution evidence-led and isolated from existing SEO experiments.
- PR #208 taxonomy remains DRAFT/HOLD; do not mix it into Explorer work.
- Public search evidence on 2026-09-25 now returns `/explore/` itself (`Explore world data — World Discovery`) and the live GDP-per-capita page exposes the contextual `Compare GDP per capita with another indicator` handoff. Treat Explorer discoverability as an early positive baseline, not proof of meaningful search demand. Country pages remain a potential second contextual distribution cohort only after #238 has measurable evidence.
- Stabilized GSC through 2026-09-26: site total 15,959 impressions / 18 clicks / 0.113% CTR / avg position 25.52. /data/population-age-0-14/ is the clearest next non-frozen opportunity: 101 impressions / 0 clicks / avg position 6.52, concentrated on country + 2023 + SP.POP.0014.TO.ZS intent. Treat this as a CTR/direct-answer problem, not a mandate for new country doorway pages.
- Internet Use broad-intent treatment remains INCONCLUSIVE; Mexico pilot remains frozen until genuine post-treatment GSC exists.

## CEO strategy
1. Shift the next marginal effort from Historical correctness to distribution and UX: the product is useful, but qualified entry paths remain the revenue bottleneck.
2. Protect SEO attribution: no new broad production SEO experiment while Internet Use and Mexico are measuring.
3. Pilot contextual Explorer entry points only where the user already has comparison intent; avoid sitewide generic links.
4. Keep Explorer UI work narrow and evidence-led: mobile/accessibility/question→selection→insight clarity before new chart types.

## Worker 1 — current assignment
**Explorer duplicate-navigation P2 — ACTIVE.**
- Remove the redundant Explorer-local primary appbar so /explore/ has exactly one primary site navigation.
- Preserve Reset, Clear all and Methodology access in the selection/control surface; do not remove functionality to fix duplication.
- Verify desktop plus 360–430px mobile and keyboard accessibility. Keep official-data semantics, exact-year behavior, SEO metadata and chart functionality unchanged.
- No extra polish or new chart types in this treatment; provide reproducible evidence and a small reversible PR.

## Worker 2 — current assignment
**Population-age-0–14 CTR/direct-answer treatment — ACTIVE.**
- Treat the observed country + 2023 + SP.POP.0014.TO.ZS queries as one intent cluster. Current stabilized baseline: 101 impressions, 0 clicks, avg position 6.52.
- Compare the existing SERP/snippet and above-the-fold answer against direct-answer competitors; specify exactly one small reversible treatment (title/meta OR above-the-fold answer), not several simultaneous changes.
- Do not create mass country landing pages. Preserve source/data accuracy and freeze Mexico, Internet Use, Renewable Energy and ISO3 experiments.
- Record treatment date and measure only stabilized post-treatment GSC before another change.

## Active experiments / holds
- Explorer: **LIVE; HISTORICAL YEAR PRODUCTION READY incl. #236 hydration-race guard.**
- Explorer initial-load performance: **COMPLETE via #234.**
- Explorer historical data QA: **COMPLETE via #235 + #236.**
- Explorer accessibility/mobile UX: **COMPLETE via #237 + #239; hold further treatments pending new evidence.**
- Explorer Google discoverability: **EARLY BASELINE; MONITOR.**
- Explorer internal distribution: **FIRST CONTEXTUAL PILOT LIVE via #238; MEASURE BEFORE EXPANSION.**
- Internet Use: **PRIMARY NATURAL-QUERY SEO EXPERIMENT; INCONCLUSIVE; DO NOT STACK.**
- Population hub: **CLICKED ASSET; HOLD.**
- Mexico Population 2025: **DEPLOYED SEP18; MEASUREMENT/FREEZE.**
- GDP per capita: **HOLD for broad SEO treatment; #238 contextual Explorer handoff only.**
- Renewable Energy: **TITLE-ONLY CTR TEST LIVE; frozen.**
- Spanish ISO3 lookup: **PRK+NCL META-DESCRIPTION PILOT; attribution gate unresolved.**
- PR #208 taxonomy: **DRAFT / HOLD DEPLOY.**
