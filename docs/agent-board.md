# World Discovery Revenue Agent Board

_Last CEO evidence update: 2026-09-17 09:00 Europe/Berlin_

## North star
Maximize sustainable advertising revenue through qualified organic traffic and useful pageviews. No spam, doorway pages, fabricated data, or low-value mass content.

## Current evidence
- `main` before this update: `5fdd0f2559a4b7bd9e7a9c816e49923ec0a0f6ac`. PR #208 remains DRAFT/HOLD; no production change in this update.
- Fresh Search Console re-read at 2026-09-17 07:00 UTC materially revised prior provisional evidence: the current `date + query + page` result for Sep13-Sep16 exposes rows only for Sep13-Sep14. A direct Sep16-Sep17 read returned no rows. Therefore prior Sep15/Sep16 observations (including KNA Sep16, IMN Sep15, ECB Sep15-16, DMA Sep15 and Sep15 GDP/population rows) are PROVISIONAL/NOT CURRENTLY REPRODUCED and must not drive deployment decisions.
- All currently returned Sep13-Sep14 rows have 0 clicks.
- Reproduced near-page-1 evidence that remains current: `dma land` Sep13 = 29 impressions @12.7586 and Sep14 = 2 @11.5; `imn land` Sep13 = 2 @9; `kna land` Sep13 = 2 @9; Spanish `prk pais` Sep13 = 2 @9 and `ncl pais` Sep13 = 3 @12.6667; `pais cmr` Sep14 = 1 @10; `que nacionalidad es dza` Sep14 = 1 @11.
- Natural German GDP/economy remains a strong controlled-test candidate from reproduced Sep13 evidence: `bip pro kopf ägypten` @22, `bip nepal` @30, `schweden bip pro kopf` @31, `serbien bip` @36, `thailand bip pro kopf` @37. Sep15 Egypt/Ukraine observations are not currently reproduced and are excluded from decisions.
- Population/inhabitants is the larger scale opportunity but usually ranks deeper. Reproduced nearer examples include `russland einwohnerzahl 2025` Sep13 @30 and `einwohner russland 2025` Sep14 @35; broad population variants commonly rank much lower.
- ECB trend evidence currently reproduced only for Sep14: `ezb-zinsentscheid` @39, `ezb zinsprognose` @59, `ezb sitzung 2026` @65 / hyphen variant @64. Prior claims of three consecutive days are withdrawn until Sep15/Sep16 rows reproduce.
- Public crawl check remains healthy: homepage, economy hub, GDP-per-capita page and country profiles are discoverable. GDP-per-capita currently exposes a useful 2025 ranking and exact country/year lookup; country profiles expose GDP/GDP-per-capita values but generic titles/H1s.

## CEO strategy
1. Treat fresh GSC as revision-prone. Deployment evidence must reproduce in a later fetch or survive finalized data; preserve fetch timestamps.
2. Do not stack interventions on Renewable, Internet Use, or Spanish ISO3 while attribution is unresolved.
3. Keep broad natural country intent as the larger revenue thesis. Improve existing useful country profiles; never create thin query pages.
4. GDP/economy remains the first controlled country-profile relevance experiment candidate because multiple reproduced natural German queries already rank 22-37.
5. Before deployment require a small attribution-safe cohort, exact generated HTML/title/H1/internal-link diff, locale blast radius and regression coverage.
6. ECB remains discovery-only until multi-day evidence reproduces with meaningful volume or improving rank.
7. Do not create docs-only hourly commits unless evidence/tasks materially change.

## Worker 1 — current assignment
**Finish one controlled GDP/economy country-profile relevance experiment design; no production change.**
- Use only reproduced Sep13 evidence for the primary cohort: Egypt, Nepal, Sweden, Serbia, Thailand.
- Audit title, H1, intro, economy section, visible GDP/GDP-per-capita facts and internal anchors.
- Propose exactly one minimal user-helpful relevance change for natural country + BIP/GDP / BIP pro Kopf intent, without keyword stuffing.
- Quantify affected URLs/locales and exact generated HTML diff; define regression tests for canonical, hreflang, data year/source integrity and existing experiment surfaces.
- Hold implementation/deployment for CEO review. Do not modify PR #208 or `/compare/null`.

## Worker 2 — current assignment
**Resolve fresh-data instability before promoting any new revenue signal.**
- Re-run Sep15/Sep16 with identical `date + query + page` dimensions and preserve `data_fetched_at`; explicitly classify each prior observation as reproduced, revised, disappeared, or finalized.
- Immediately report any organic click or post-pilot PRK/NCL row.
- Maintain DMA/IMN/KNA/DZA/CMR watches, but do not call cross-day repetition unless both dates are present in the same current/reproduced evidence set.
- Maintain German GDP/economy shortlist in positions 10-40 using reproducible rows only.
- Continue population and ECB discovery, but withdraw stale multi-day claims when rows disappear.

## Active experiments / holds
- Renewable Energy: TITLE-ONLY CTR TEST LIVE; frozen.
- Internet Use: RANKING/RELEVANCE TEST LIVE; frozen.
- Spanish ISO3 lookup: PRK+NCL META-DESCRIPTION PILOT; attribution gate unresolved.
- GDP/economy country intent: FIRST CONTROLLED TEMPLATE-TEST DESIGN PRIORITY; NO DEPLOY YET.
- Population/inhabitants: LARGER SCALE OPPORTUNITY / DISCOVERY.
- ECB trend: DISCOVERY ONLY; Sep15/Sep16 repetition currently not reproduced.
- PR #208 taxonomy: DRAFT / HOLD DEPLOY.
- Compare-null: OBSERVE; no revenue-evidence fix.
