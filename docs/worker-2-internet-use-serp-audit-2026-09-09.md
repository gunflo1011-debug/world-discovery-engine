# Worker 2 Internet Use SERP audit — 2026-09-09

## CEO assignment
Diagnose high-position zero-click Internet Use country profiles (Austria, Slovakia, New Zealand) against clicked controls (Bangladesh, Iran, Kyrgyz Republic) without touching `/data/*` or rolling out a template change without cross-page evidence.

## GSC evidence (2026-09-01 through 2026-09-06)
Page-level baseline from the CEO board:
- Austria: 0 clicks / 60 impressions / avg position 4.15
- Slovakia: 0 / 36 / 4.50
- New Zealand: 0 / 16 / 3.94
- Bangladesh: 1 / 9 / 3.22
- Iran: 1 / 7 / 6.57
- Kyrgyz Republic: 1 / 3 / 7.0

A fresh query-level pull for all six exact country-profile URLs returns only three rows, all for Austria:
- `it.net.user.zs austria 2023`: 0 clicks / 1 impression / position 7
- `world bank it.net.user.zs 2023 austria`: 0 / 1 / 2
- `world bank it.net.user.zs austria 2023`: 0 / 1 / 3

So only 3 of Austria's 60 page-level impressions are visible at query level (~5%). Slovakia, New Zealand and all three clicked controls expose no query rows in this window. This is insufficient to attribute the page-level CTR difference to title/meta wording or query intent.

## Current live pages vs indexed/search presentation
Fresh live fetches show the promoted historical-series template is already present:
- Austria live title: `Austria internet penetration trend: 1990–2024 | World Discovery`; H1: `Austria internet penetration over time`; latest value shown as 94.9%.
- Slovakia live title: `Slovak Republic internet penetration trend: 1990–2024 | World Discovery`.
- New Zealand live title: `New Zealand internet penetration trend: 1990–2024 | World Discovery`; H1: `New Zealand internet penetration over time`; latest value shown as 93.5%.
- Austria's live body also contains the PR #199 terminology block mapping “internet penetration rate” / “internet users” to IT.NET.USER.ZS and links to the compare/ranking assets.

Public search-result retrieval still surfaces older snapshot-style titles/content for Austria, Slovakia and New Zealand, e.g. `Austria internet use rate in 2024: 94.91974877% | World Discovery Engine`, while opening the same URLs returns the newer trend template. The same older snapshot presentation is also surfaced for clicked controls Bangladesh, Iran and Kyrgyz Republic.

This means stale indexing/snippet presentation is real, but it is not unique to zero-click pages; clicked controls exhibit the same stale presentation. Therefore stale snippets may suppress CTR generally, but they do not currently explain the zero-click-vs-clicked split.

## Conclusion
**No production change.** The strongest evidence is tiny-sample/query-visibility uncertainty plus an index-refresh lag affecting both zero-click and clicked pages. There is no cross-page defect proven on the current live title/H1/template that is absent from clicked controls.

## Prioritized hypothesis
Google is still serving/indexing the pre-promotion snapshot representation for at least part of this cluster. Measure whether impressions/clicks shift after the newer trend-template titles/snippets are recrawled before changing metadata again. If a later query-level sample shows high-volume, high-position intent that the current trend title fails to match across multiple zero-click pages but not controls, then run one narrow reversible CTR test.

## Recommended next check
1. Wait for additional finalized GSC days after the current template/index refresh.
2. Re-run exact page+query pulls for Austria, Slovakia, New Zealand and the three controls.
3. Compare only when enough query rows exist to explain a material share of page impressions.
4. Do not template-roll out another title/meta change solely from page-level averages.
