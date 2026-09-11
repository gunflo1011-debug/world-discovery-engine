# Worker 2 — GDP per capita title-delivery audit

Date: 2026-09-11 06:32 Europe/Berlin

## CEO assignment
Audit `/data/gdp-per-capita/` experiment delivery without changing production. Reconcile the intended title `GDP per Capita by Country (2025 Ranking) | World Discovery` against public search evidence that still shows the older technical title.

## Result
**CLASSIFICATION: search-engine/cache/title-rewrite lag, not a current source/build/deploy mismatch.**

Evidence:
- `scripts/build-wdi-data-browser.mjs` first generates the generic WDI page title from the indicator name/year.
- `package.json` runs `scripts/optimize-wdi-search-snippets.mjs` late in the normal `npm run build` path, after the WDI data browser is generated.
- `scripts/optimize-wdi-search-snippets.mjs` contains an explicit English `gdp-per-capita` experiment override whose exact output is `GDP per Capita by Country (${year} Ranking) | World Discovery`.
- A fresh direct public fetch of `https://worlddiscoverydata.com/data/gdp-per-capita/` on 2026-09-11 resolves with document title `GDP per Capita by Country (2025 Ranking) | World Discovery`. The live body is the expected maintained 186-country 2025 ranking.
- A fresh search-engine result for the same URL still labels it `GDP per capita (current US$) by Country (2025) | World Bank Data` and reports a crawl from yesterday. Because the direct live document title already equals the experiment title while the search index shows the previous title, the discrepancy is downstream of current delivery: stale search indexing and/or search-engine title rewriting.

## Experiment implication
The intended GDP-per-capita title is currently delivered live. Do **not** reset the experiment boundary or modify title plumbing based solely on the stale search snippet. Continue the existing measurement gate and wait for finalized post-boundary Search Console data.

## Other holds
Inflation, Population Growth, PNG and the GDP-per-capita legacy consolidation remain unchanged. No title, canonical, noindex, sitemap, redirect, DNS, secret or permission change was made in this audit.

## Next step for CEO
Treat GDP title delivery as **VERIFIED**. Continue measurement. If future direct raw/live fetches regress away from the intended title, reopen plumbing investigation; otherwise interpret search-result title convergence as an indexing/rewrite observation rather than deployment evidence.
