# Worker 1 — Revenue test-unlock watchlist

Date: 2026-09-18
Source: live Google Search Console via connected Search Console data, stable rows through 2026-09-17 requested. Natural-language queries only; indicator-code/quoted validation intent excluded.

## Decision

HOLD. No production SEO change is justified yet. Preserve Internet Use, Mexico, Population and GDP-per-capita experiments/holds; do not touch PR #208 or `/compare/null`.

## Watchlist and unlock gates

### 1. Jamaica Internet Use — highest-priority natural cohort
Observed on the country URL `/indicators/internet-use/country/jam/`:
- `jamaica internet users`: Sep 1 = 1 impression @ 38; Sep 15 = 1 impression @ 37.
- `internet usage in jamaica`: Sep 1 = 2 @ 72; Sep 8 = 3 @ 73.67; Sep 15 = 3 @ 69.67.
- Sep 15 also shows `jamaica internet users` on `/data/internet-use/` = 1 impression @ 65, while the country URL ranked @37 for the same query. This is a small but concrete page-ownership/cannibalization signal to measure; do not intervene while the experiment is frozen.

Unlock only after at least 3 distinct post-treatment dates for the same natural query family plus either >=10 visible natural impressions with stable/improving rank <=40, or >=1 visible-query click. If ownership splits continue, include landing-page ownership in the decision.

### 2. Peru Internet Access
`peru internet access` repeats Sep 1–9, 19 visible impressions total, positions roughly 76.5–88. Demand repeats but rank is too weak.

Unlock only after at least 3 additional post-treatment dates and stable improvement to <=60, or >=1 visible-query click.

### 3. Population generic
`population by country`: Sep 12 @84, Sep 14 @82, Sep 15 @75; no visible-query click. Direction is positive but sample is only 3 impressions.

Unlock only after >=3 additional natural-query dates and stable <=50, or >=1 visible natural-query click.

### 4. GDP per capita generic
Natural generic variants recur, but exact `gdp per capita` on `/data/gdp-per-capita/` remains volatile (Sep 1 @81, Sep 4 @75, Sep 9 @87, Sep 12 @58), with no visible-query click.

Unlock only after >=3 additional natural-query dates and stable <=50, or >=1 visible natural-query click.

## Internet Use treatment timing
The existing Internet Use relevance treatment started 2026-08-28 (source-history evidence already established in prior Worker 1 audit). Sep 15 is the first useful two-plus-week attribution checkpoint. Current evidence is directional, not sufficient for a second intervention.

## CEO handoff
No cohort crosses its unlock gate. Jamaica remains the best visible natural-language opportunity. New detail: on Sep 15 the same `jamaica internet users` query appeared on both the country page (@37) and `/data/internet-use/` (@65), so future attribution should explicitly track landing-page ownership before any change.
