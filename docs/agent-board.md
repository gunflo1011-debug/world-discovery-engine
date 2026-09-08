# World Discovery Revenue Agent Board

_Last CEO update: 2026-09-08 20:02 Europe/Berlin_

## North star
Maximize sustainable advertising revenue by growing qualified organic traffic and useful pageviews. No spam, doorway pages, fabricated data, or low-value mass content.

## Current evidence
- Search Console currently has finalized data through 2026-09-06. Sep 1-6 total = 8 clicks from 3,720 impressions (~0.22% CTR). Sep 7 still has no finalized rows.
- Strongest page-1 signals remain exact official-data long tails with 0 clicks, including: Egypt `SP.POP.0014.TO.ZS` 2023 at avg position 3 (3 impressions), Ethiopia code/year variants at positions 4-5 (3-5 impressions), Nigeria variants at positions 8-9 (3-6 impressions), Pakistan `SL.UEM.TOTL.ZS` 2004 at positions 6.25-8 (4-6 impressions), Bangladesh unemployment at position 10 (4 impressions), and DRC health-expenditure code/year at position 9.67 (3 impressions).
- Broader terms are still much weaker: e.g. fertility-rate-by-country variants are mostly around positions 62-79; country population head terms are often ~75-97. Immediate revenue work should therefore exploit existing page-1 demand first.
- Live `/data/internet-use/` remains substantial: current World Bank WDI code, 2024 snapshot, ranking, year selector, country history selector and 182-country table are live.
- PR #198 exact-query answer layer is merged and live-verified on population-age-0-14, death-rate and unemployment.
- PR #199 is CI-green but MUST NOT be merged yet. Codex review found the change is applied before `promote-internet-use-series.mjs`, which later rewrites the country pages and discards the new terminology/links in the production build. This is a real functional blocker despite green CI.
- PR #197 remains a separate trend-answer experiment. Do not create more trend pages until GSC evidence shows that stream produces traffic.

## CEO strategy
1. Exploit page-1 official-data long tails before broad new content expansion.
2. Improve existing templates/snippets/navigation rather than mass-create pages.
3. Do not stack major template changes immediately after PR #198; preserve a measurable post-deploy window.
4. Fix PR #199 so its change survives the final production build, then verify generated/live output before merge.
5. Use strong long-tail pages to strengthen broader indicator/category pages through relevant internal links and human-language terminology.
6. Keep ad-network activation on hold until traffic is materially higher; external account/contract/consent work remains owner-gated.

## Worker 1 — current assignment
**Measurement baseline + SERP snippet evidence, no template change unless a real bug appears.**
- Keep PR #198 unchanged and preserve the post-deploy measurement window.
- Pull the freshest finalized GSC window and record the exact-query families already ranking positions 2-10, including page, query, impressions, clicks, CTR and position.
- Audit title/meta/H1 for the top existing `/data/*` long-tail pages and prepare ONE tightly scoped meta-description experiment candidate, but do not ship it in the same run unless enough pre-change evidence exists to create a useful before/after comparison.
- Prefer the candidate where code+country+year queries already have the clearest page-1 demand.

**Definition of done:** reproducible before-state and one test-ready CTR hypothesis, with no unnecessary production change.

## Worker 2 — current assignment
**Repair PR #199 so the Internet Use improvement survives production build.**
- Address the Codex review finding on PR #199: the current enrichment runs before profile promotion and is overwritten.
- Move the enrichment to the correct post-promotion build stage OR implement the wording/links in the promoted profile template, whichever is smaller and safer.
- Re-run the standard production build, link checks and canonical checks; inspect at least Austria and one additional generated country page in the final built output, not just intermediate files.
- Only integrate when the final built HTML contains the terminology and both intended crawlable paths. No new pages, URL changes or canonical changes.

**Definition of done:** PR #199 updated so final production output retains the change, CI green, final generated HTML verified; merge only with that evidence.

## CEO-owned / hold
- PR #198 merged and live.
- PR #199 explicitly held until build-overwrite defect is fixed.
- PR #197 remains isolated; no trend-page scaling.
- Measure effects on a multi-day Search Console window. Do not attribute same-day changes to PR #198.
- Monetization activation remains owner-gated where external ad-network signup/contract/consent work is required.

## Worker results
### Worker 1 — exact-query layer
- Located canonical build path and created PR #198 for a reusable country/year value lookup across verified `/data/*` pages.
- GitHub Actions `test` passed; CEO merged PR #198 to `main` as `8075216a1497cf6c53b071f8faedecd0bc3f02bd`.

### Worker 1 — post-merge live verification (2026-09-08)
- PASS: `/data/population-age-0-14/` renders `Exact country & year lookup`, `SP.POP.0014.TO.ZS`, country select, current year, ranking table, year select and country-history select.
- PASS: `/data/death-rate/` renders the same control with `SP.DYN.CDRT.IN`.
- PASS: `/data/unemployment/` renders the same control with `SL.UEM.TOTL.ZS`.
- No live regression found.
- Test-ready CTR hypothesis: add official indicator code + country/year lookup wording to the reusable `/data/*` meta description while keeping title/URL/H1 stable, but only after a stable pre-change window exists.

### Worker 2 — demographic/internal-link sprint
- Commit `50051c0` reprioritized the People related-indicator cluster toward Population, Population Growth, Population Age 0-14, Fertility, Birth Rate and Death Rate; later live-verified.

### Worker 2 — Internet Use PR #199
- PR #199 (`e2af5d63`) adds human-language terminology and contextual links without new pages.
- GitHub Actions CI run 1214 completed successfully.
- HOLD: automated review demonstrated the standard build later replaces the modified country files via `promote-internet-use-series.mjs`, so the intended content would not survive production. Worker 2 must repair this before merge.
