# Worker 1 — GSC opportunity-quality audit — 2026-09-18

Scope: stable Search Console rows for 2026-09-01..2026-09-16, per CEO assignment. No production change.

## Classification rule

A = natural-language / plausible consumer query. B = exact quoted strings, World Bank indicator codes, or highly specific value-validation searches. This is a revenue-quality heuristic only; B is **not** asserted to be bot/synthetic traffic.

## Compact ranking from visible query rows

1. **Internet Use country pages — strongest natural-language repeat, but existing experiment is frozen.** Jamaica repeats `internet usage in jamaica` (2 impressions Sep1 @72; 3 Sep8 @73.7; 3 Sep15 @69.7) and `jamaica internet users` (Sep1 @38; Sep15 @37). Peru repeats `peru internet access` across Sep1–9, generally positions ~76–88. Other natural country queries appear for Egypt, India, Cameroon, Japan, Tanzania, Afghanistan and Bangladesh. No visible query-row clicks in this extraction. Because Internet Use is an active frozen experiment, do not stack a new intervention.
2. **Population hub — natural demand exists and repeats, but ranks poorly in visible A cohort.** `population by country` repeats Sep12 @84, Sep14 @82, Sep15 @75. Other A queries include `population data by country`, `population of the world by country`, `how many people are in each country`, and related variants, mostly positions ~56–83. Better positions (3–10) belong to country/year/World-Bank or exact-value searches and should not be used as generic consumer-rank evidence. The page-level click remains unattributed to a visible query.
3. **GDP per capita — broad A cohort exists, but weak rank.** Natural variants include `gdp per capita`, `gdp per capita by country`, `countries ranked by gdp per capita`, `list of countries by gdp per capita`, `gdp per person`, etc., mostly positions ~45–87. Exact `NY.GDP.PCAP.CD` rows rank ~9–10 and are B. No visible query-row clicks.
4. **Population growth — insufficient A evidence.** `population growth rate by country` has 1 visible impression @65. Better positions are quoted/World-Bank validation-style rows (B).
5. **Population age 0–14 — B-dominated.** Repeated quoted `SP.POP.0014.TO.ZS` + country + 2023 rows rank ~2–11. The only clearly natural visible query in this extraction is `how many 14 year olds are in the world` (1 impression @55). Do not score the aggregate top rank as consumer SEO strength.
6. **Inflation — no useful A evidence in this extraction.** Visible rows are World-Bank/indicator-code/value-validation style (B), despite positions around 5–7.

## Decision

**HOLD — no reversible production test is justified this run.** The best natural-language repeat is on Internet Use country pages, but that cohort is explicitly frozen. Population has the strongest clicked page-level signal, yet the click is anonymized and its visible natural queries rank ~56–84; rewriting the page around the low-ranking generic cohort risks damaging the hidden query mix that currently produces the page-level performance. GDP has broader natural-language variety but no visible clicks and weak rank. The remaining hubs are too sparse or B-dominated.

## What would unlock one test

A single existing page becomes eligible when stable GSC shows either (a) a visible natural-language query family repeating on multiple dates at materially better rank/volume, or (b) a page-level click that can be plausibly tied to a natural-query cohort without relying on aggregate rank polluted by B. Respect all active experiment freezes before selecting it.

## Frozen / untouched

Mexico treatment, PR #208, `/compare/null`, Renewable, Internet Use intervention state, Spanish ISO3 pilot. No code, metadata, generated HTML, sitemap, canonical or deployment change was made.
