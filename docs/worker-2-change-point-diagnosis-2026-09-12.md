# Worker 2 — change-point / query-intent diagnosis (2026-09-12)

## Scope
CEO assignment: correlate finalized GSC visibility changes from Aug 31–Sep 9 with substantive production releases; distinguish correlation from causation; identify reversible actions only. No live CTR change in this run.

## Finalized GSC evidence used
The CEO board records the domain-wide finalized baseline: Aug 25–30 = 656 impressions / 0 clicks / ~56.49 weighted position; Aug 31–Sep 2 = 1,606 / 3 clicks / ~26.37; Sep 3–5 = 1,561 / 5 clicks / ~39.74; Sep 6–9 = 2,947 / 0 clicks / ~34.44. This means exposure broadened rather than collapsed.

A page-level finalized comparison adds an important composition clue. For Aug 31–Sep 2, `/data/gdp-per-capita/` alone produced 574 impressions at ~7.94 and `/data/population-age-0-14/` 91 at ~5.85. By Sep 6–9, GDP per capita was only 48 impressions at ~23.15, while population-age-0-14 increased to 161 at ~5.53. Other core English data pages also had strong Page-1 visibility in Sep 6–9: Population 102 at ~8.96, Population Growth 93 at ~5.67, Inflation 74 at ~6.69, CO2 per capita 31 at ~5.32, Health Expenditure 30 at ~6.23. Thus the domain-level position deterioration is not a uniform collapse of core `/data/` rankings; it is heavily affected by the loss of the unusually large early GDP-per-capita test plus broader lower-ranking URL discovery.

## Release/change-point correlation
Relevant production chronology from Git history:

- Aug 30: `7920c351` added country discovery paths and landing-page search intents; `97afb114` added WDI year navigation and country history.
- Aug 31: `43cdbb8d` bridged indexed Internet Use pages to country hubs.
- Sep 1: `89fb65df` added a human-readable GDP country ranking.
- Sep 4: `1add3f25` built localized country comparison pages; `ca610e5a` routed localized navigation to localized country/compare pages.
- Sep 5: a dense localization/SEO release wave landed, including localized WDI snippets (`96bfd167`), high-intent WDI snippet alignment (`bd04fbbc`), localized country metric/copy work (`977fbcd6`, `73596c94`, `f42bc5cf`), plus multiple localized shell/status/compare changes.
- Sep 6: localized Fun Facts were released across all site languages (`dcb0d151`).
- Sep 8: exact country/year answer lookup was added to WDI data pages (`8075216a`).

The timing is consistent with the CEO's current interpretation: the Sep 5–6 localization/country expansion can plausibly explain why many more low-ranking URLs entered GSC and mechanically worsened domain-average position while total impressions rose. This is correlation, not proof that localization caused a ranking loss. There is no evidence here for a domain-wide penalty, and reverting localization would be an unjustified high-blast-radius action.

## Largest page-level visibility change
The standout negative change is `/data/gdp-per-capita/`: 574 impressions at ~7.94 in Aug 31–Sep 2 versus 48 at ~23.15 in Sep 6–9. No other observed core data page shows a comparable absolute early spike/later contraction. This supports treating GDP per capita as a page/query-cohort test phenomenon rather than using it as evidence of a sitewide issue.

Conversely, several core English pages gained meaningful Page-1 exposure by Sep 6–9, especially Population Age 0–14, Population, Population Growth and Inflation. That pattern is incompatible with a simple sitewide suppression hypothesis.

## Query-intent / SERP limitation
Current GSC query disclosure remains privacy-limited, especially for the high-impression zero-click pages. Search-engine spot checks do not reliably surface World Discovery for exact `site:` queries in the available web search layer, so no claim is made about a current Google rewrite for the top-ten loss set without direct evidence.

## Recommended action
**HOLD mass SEO/localization changes.** The evidence-backed next action is to preserve current architecture and evaluate page-level experiments separately. Do not noindex, canonicalize away, or remove localized/country pages merely because they lower domain-average position. Domain average is currently confounded by broader discovery.

For revenue prioritization, use absolute qualified Page-1 impressions and CTR at page/cohort level, not sitewide average position. GDP per capita remains a special case under its existing experiment/consolidation hold. Population and Renewable Energy remain better controlled future CTR candidates than a broad rollback.

## Active experiment status
No live experiment was changed. Inflation boundary remains 2026-09-10 12:32 Europe/Berlin; Population Growth boundary remains 2026-09-10 16:32. Final data currently ends Sep 9, so neither has a clean finalized post-boundary day. Renewable Energy remains conditional on finalized Sep 10 meeting the CEO gate (>=10 impressions, 0 clicks, position <=4). Population remains prepared but deployment HOLD.

## CEO handoff
Classification: **DOMAIN VISIBILITY = BROADER DISCOVERY + GDP-SPECIFIC EARLY SPIKE, NOT EVIDENCE OF PENALTY.** Highest-value reversible decision is to keep mass architecture/localization unchanged and continue page/cohort-level measurement. Revisit only if a specific cohort shows finalized loss after controlling for URL expansion and query mix.