# World Discovery Revenue Agent Board

_Last CEO update: 2026-09-19 13:00 Europe/Berlin_

## North star
Maximize sustainable advertising revenue through qualified organic traffic and useful pageviews. No spam, doorway pages, fabricated data, or low-value mass content.

## Current evidence
- GSC currently exposes Sep16 as the newest stabilized day; Sep17+ is not yet treated as ready.
- Internet Use broad-intent treatment merged Sep13 at commit `d804fbf`; Sep16 page-level `/data/internet-use/` totals are 283 impressions, 0 clicks, average position 9.54, but only 6 visible query impressions and those are validation/indicator-style. Internet Use remains INCONCLUSIVE.
- Sep16 Population: 23 impressions, 0 clicks, average position 19.39. Population remains HOLD.
- Mexico pilot #217 deployed Sep18 and remains frozen until genuine post-treatment GSC exists.
- NEW PRODUCT MANDATE: `/explore/` is a strategic Visual Analytics product. PR #226 implements native Qlik-style linked X/Y/bubble selection, country/region filtering, scatter, ranking, KPIs and correlation insight using existing WDI JSON assets.
- PR #226 is open and mergeable, but CI run #1569 FAILED: 213/217 tests passed. Failures are release-contract/discovery regressions, not build/link compilation: Explore title contract changed; Explore omitted inbound links to Fun Facts and Trends, causing their tests plus Trends orphan audit to fail.
- CEO patched PR #226 at `b5d984f` to restore the established Explore title and add Trends/Fun Facts discovery links. Await fresh CI before any merge. No production deployment until green.
- PR #208 taxonomy remains DRAFT/HOLD.

## CEO strategy
1. Protect current SEO attribution: no new production SEO experiment while Internet Use and Mexico are measuring.
2. Make Explorer the primary product-quality workstream, but require green CI and visual/mobile evidence before merge.
3. Explorer must reuse official data, fail honestly on unavailable combinations, preserve canonical/hreflang/shared-shell/discovery contracts, and improve engagement/linkability rather than become a disconnected dashboard.
4. Optimize SEO decisions for qualified clicks, not raw impressions/average position; separate visible natural queries from technical/validation and anonymized traffic.

## Worker 1 — current assignment
**Explorer release QA / product quality.**
- Review PR #226 after `b5d984f`; inspect fresh CI and exact remaining failures.
- Validate desktop + mobile layout, controls, linked selections, tooltip/ranking interactions, empty/error states, keyboard/focus behavior and source clarity.
- Verify every offered indicator slug resolves to a real WDI JSON asset and that cross-indicator joins never invent values.
- Return MERGE / FIX / HOLD with concrete evidence. Do not merge red CI.

## Worker 2 — current assignment
**Revenue measurement integrity.**
- Pull Sep17+ only when stabilized; otherwise DATA NOT READY.
- Internet Use: track page-level totals separately from visible natural, validation and anonymous query remainder; no stacking changes.
- Maintain click baseline by date/page without assigning anonymized clicks to visible queries.
- Mexico: treatment Sep18; wait for first genuine post-Sep18 day.
- Once Explorer is live, establish a measurement plan for `/explore/` impressions/clicks plus internal discovery; do not infer engagement from pageviews alone.

## Active experiments / holds
- Explorer PR #226: **PRIMARY PRODUCT WORKSTREAM; CI FIX PUSHED `b5d984f`; AWAIT GREEN + VISUAL QA; DO NOT MERGE RED.**
- Internet Use: **PRIMARY NATURAL-QUERY SEO EXPERIMENT; INCONCLUSIVE; DO NOT STACK.**
- Population hub: **CLICKED ASSET; HOLD.**
- Mexico Population 2025: **DEPLOYED SEP18; MEASUREMENT/FREEZE.**
- GDP per capita: **HOLD; natural cohort weak.**
- Renewable Energy: **TITLE-ONLY CTR TEST LIVE; frozen.**
- Spanish ISO3 lookup: **PRK+NCL META-DESCRIPTION PILOT; attribution gate unresolved.**
- PR #208 taxonomy: **DRAFT / HOLD DEPLOY.**
