# Worker 1 — Population revenue audit (2026-09-18)

## Decision
**HOLD. Do not change `/data/population/` yet.** The stable page-level signal is strong, but query-level data is too incomplete to justify a title/H1/snippet rewrite without risking the intent family that is already ranking well.

## Stable Search Console evidence
Latest successful artifact inspected: workflow run `35330256597`, generated 2026-09-18, baseline window `2026-08-20..2026-09-16`.

Page-level baseline from the aggregate artifact:
- `/data/population/`: **1 click / 378 impressions / avg position 11.35**.

Query+page+date export for the same URL exposes only:
- **24 rows / 27 impressions / 0 clicks**.
- Therefore **351 of 378 page impressions (92.9%) are not attributable to visible query rows** in this export, and the page's real click is also absent from query-level rows.
- Visible-query weighted average position is about **51.44**, radically different from the page-level **11.35**. This strongly implies the hidden/anonymized query set contains materially stronger ranking traffic. Do not infer the hidden queries' wording.

Notable visible high-ranking intents:
- `iraq population 2024 world bank`: 1 impression @ position 3.
- `world bank population 2024 kazakhstan australia canada argentina russia`: 1 @ 3.
- `yemen population 2025 world bank`: 1 @ 4.
- `"egypt, arab rep." "2023" "sp.pop.totl" "world bank"`: 1 @ 7.
- `world bank 2022 population indonesia 275501339 malaysia 33938221 singapore 5637022`: 3 visible impressions across two dates @ position 10.

Visible broad/generic intents rank much worse:
- `world bank population by country`: 1 @ 30.
- `population by country world bank`: 1 @ 34.
- `population by country data`: 2 @ 69.
- `population by country`: 3 visible impressions across dates @ positions 75, 82 and 84.
- `how many people in each country`: 2 @ 76.

## Interpretation
The page is already near page-one territory at aggregate level, but the visible query sample is not representative of that aggregate. The best visible rankings are country/year/World Bank/indicator-code lookups, while generic `population by country` variants are currently weak. A generic SEO rewrite would therefore be an evidence-poor intervention and could damage the stronger intent family.

The query-level export cannot identify the actual clicked query because it reports zero clicks for all visible query rows while page-level data reports one click. Treat this as aggregation/privacy suppression, not as proof that the click did not occur.

## Indexing note
The latest URL Inspection attempt for `/data/population/` timed out (`searchconsole.googleapis.com` read timeout 12s). This is an inspection-call error, not evidence of deindexing. Other inspected core data URLs succeeded in the same run. Do not change the page because of this transient inspection failure.

## Live/user-value audit summary
The page already presents current World Bank WDI population data, a full country ranking, country/year lookup and historical year navigation. This aligns with the visible high-ranking country/year/World-Bank query family. No clear user-value defect was found that justifies stacking an intervention before Worker 2 can attribute the hidden traffic further.

## Proposed action
No production diff, no PR, no deploy. Keep `/data/population/` frozen while Worker 2 tracks stable daily page metrics and query families. Re-open only if stable evidence reveals one clear, reversible CTR/ranking/user-value gap.

## Guardrails
Do not modify Mexico, PR #208, `/compare/null`, Renewable, Internet Use or Spanish ISO3 experiments as part of this audit.
