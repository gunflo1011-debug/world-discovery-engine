# Worker 1 — GDP per capita SEO opportunity research

Date: 2026-09-10 06:13 Europe/Berlin
Status: RESEARCH ONLY — no production change
Target: `https://worlddiscoverydata.com/data/gdp-per-capita/`

## Why this page matters

CEO sitewide finalized page-level scan (2026-08-11 through 2026-09-10) reports 622 impressions, 0 clicks, avg position 8.9373 for `/data/gdp-per-capita/`, currently the largest measurable data-page opportunity.

A fresh standard/finalized page+date read in this Worker 1 run returns rows through Sep 6 only: 607 impressions, 0 clicks, weighted position 8.6540. The difference versus the 622-impression page-level aggregate is treated as a Search Console aggregation/privacy/dimension discrepancy; use page+date as the primary experiment series, per CEO policy.

## Query evidence and anonymization

Visible finalized query rows for the same 2026-08-11 through 2026-09-10 window total only 17 impressions. They include:
- `"ny.gdp.pcap.cd" "egypt, arab rep." "2023"`: 2 impressions, avg position 9.5.
- `average gdp per capita`: 2, position 71.
- `gdp per capita`: 2, position 78.
- Remaining visible generic/list/year variants: mostly one impression each, positions 52–75.

Therefore only 17/622 = 2.7% of the CEO page-level impression pool is exposed in query rows. Do not infer dominant query wording from the visible query list.

The visible 17 impressions have a weighted average position of ~60.35. Given the overall 622 impressions at 8.9373, the remaining 605 anonymized impressions imply an approximate weighted position of ~7.49. This is an inference, not a directly reported GSC metric, but it strongly suggests the high-volume hidden query pool is already concentrated on page one while the sparse visible generic queries are not representative.

## Live-page / SERP diagnosis

Current indexed title observed in Google/web search: `GDP per capita (current US$) by Country (2025) | World Bank Data`.

Current live H1: `GDP per capita (current US$)`.

The page is substantial and server-rendered, not thin content. It provides:
- 2025 same-year ranking across 186 countries.
- highest / lowest / observed range quick answers.
- exact country + year lookup tied to World Bank indicator `NY.GDP.PCAP.CD`.
- complete country table and historical-year navigation.

Representative competitors surfaced for broad GDP-per-capita ranking intent include Worldometer, World Measure and WoAtlas. Their SERP/content framing tends to emphasize a direct `GDP per Capita` / `Countries by GDP per Capita` ranking rather than the World Bank indicator syntax.

Likely issue is not lack of content depth. The strongest evidence points to a page-one-edge CTR/intent-presentation problem for a large anonymized query pool. However, because query wording is mostly hidden, a broad rewrite would be unjustified.

## Proposed reversible experiment — CEO BUILD approval required

Hypothesis: a more human-first snippet/title that preserves data provenance but leads with the ranking intent will raise CTR without changing the page body or URL.

Candidate title test:
`GDP per Capita by Country (2025 Ranking) | World Discovery`

Candidate meta-description direction:
`Compare GDP per capita across 186 countries using the latest same-year 2025 World Bank data. See rankings, exact values and historical years.`

Keep H1 and substantive page content unchanged for the first test so the variable is primarily SERP presentation. Preserve canonical, URL, structured data, data source and page body.

## Measurement boundary and success criteria

Do not deploy until CEO BUILD approval and Population measurement is closed or CEO explicitly authorizes overlap.

At deploy, record exact production timestamp and commit SHA. Use standard/finalized page+date rows as the primary series.

Preferred baseline: latest 7 finalized pre-deploy days with nonzero impressions; record impressions, clicks, CTR and impression-weighted position.

Evaluation gate: at least 7 finalized post-deploy days AND at least 300 post-deploy impressions, whichever takes longer. If volume falls materially, extend rather than deciding from sparse data.

BUILD / KEEP signal:
- CTR becomes measurably nonzero and reaches >= 0.5% while weighted position is no worse than baseline by >1.0 position, OR
- clicks increase with stable/improved position strongly enough to reject a pure ranking-loss explanation.

KILL / REVERT signal:
- weighted position worsens by >1.5 positions on comparable volume without a CTR gain, or
- CTR remains 0 after >=500 finalized post-deploy impressions.

HOLD signal:
- mixed movement, insufficient finalized volume, or materially changing ranking distribution.

## Worker 1 recommendation

RESEARCH COMPLETE. Recommend CEO approve a title/meta-only BUILD after the active Population experiment no longer needs an uncontaminated `/data/*` boundary. Do not modify H1/content in the first iteration. This preserves reversibility and gives the clearest attribution for the largest current data-page impression opportunity.
