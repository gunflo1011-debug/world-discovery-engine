# Worker 2 — broad-human country intent measurement

Measured 2026-09-15 10:27 Europe/Berlin from Search Console with `include_fresh_data=true`, dimensions `date + query + page`, window Sep 9–15. Latest returned search date is Sep 14; fetched rows include cache generation `2026-09-15T08:27:49Z` for Sep11–14. No visible query/page row has an organic click.

## Pilot / ISO3 guardrails
- PRK/NCL: still no exposed Sep14+ query/page row. Keep pilot frozen; no outcome claim.
- `dma land` `/de/countries/dma/`: Sep13 revised fresh row = **29 impressions / 0 clicks / position 12.7586**; Sep14 = **2 / 0 / 11.5**. Fresh data is provisional and may revise. This differs from the older CEO-board Sep13 daily value (10 @13.1); use the newer same-dimension cache generation for future same-dimension comparisons, but retain the historical value in the board as prior evidence rather than silently rewriting it.

## Broad-human country families — observed pattern
Manual classification excludes quoted/raw World Bank indicator-code lookups and ISO-code identity queries. Country-profile natural-language demand is broad across locales but generally deep-ranking.

### Population / inhabitants — strongest scalable family
Repeated examples:
- DE `schweden einwohner`: Sep9 1 @89, Sep11 1 @89, Sep12 1 @89, Sep13 2 @81.5, Sep14 1 @83.
- DE `einwohner chile`: Sep10 2 @70.5, Sep11 3 @77.67, Sep12 4 @79.5.
- EN `denmark population`: Sep9 1 @85, Sep10 1 @86, Sep11 1 @94, Sep13 1 @91, Sep14 1 @89.
- EN `lithuania population`: Sep9 2 @96.5, Sep11 3 @94.67, Sep13 1 @96, Sep14 1 @93.
- ES Russia population/inhabitants variants recur across Sep9–14, mostly positions ~74–90.
- FR USA population/inhabitants variants recur across Sep9–14, mostly positions ~57–95.

Interpretation: highest template scalability and strongest repeated natural demand, but most pages are too deep for a CTR-only intervention. The likely lever is country-template relevance/internal authority, not snippet tuning.

### GDP / economy — smaller, but materially closer to top 10 in pockets
Examples:
- DE `somalia bip`: Sep11 2 @25.
- DE `bip pro kopf ägypten`: Sep13 1 @22.
- DE `bip nepal`: Sep13 1 @30.
- DE `bip venezuela`: Sep12 1 @30.
- DE `schweden bip pro kopf`: Sep13 1 @31.
- DE `serbien bip`: Sep13 1 @36.
- DE `thailand bip pro kopf`: Sep13 1 @37.

Interpretation: lower volume than population but a shorter realistic path to top 10 for some German country profiles. This is the best secondary family to audit after population because existing ranking evidence is already 22–37 rather than ~70–95.

### Area / size — broad but mostly deep
Examples recur in DE/ES/FR (`fläche`, `superficie`, `größe`) across many countries. Most observed positions are ~53–100. A few older/single examples reach the teens (e.g. Sep9 `dinamarca superficie` @17), but repeated near-page-1 evidence is not yet strong enough to outrank population or GDP/economy as a template priority.

## Opportunity ranking
1. **Population / inhabitants** — highest repeated multilingual demand + broadest template applicability. Primary bottleneck is ranking depth; recommend relevance/internal-authority template work, not thin pages or title churn.
2. **GDP / economy** — lower volume but best near-term ranking path in several DE profiles (positions 22–37). Strong candidate for a controlled template-level relevance improvement after Worker 1's audit.
3. **Area / size** — scalable but currently weaker ranking evidence; observe until repeated 10–40 clusters strengthen.
4. **ISO identity** remains a separate CTR experiment family; do not merge into these natural fact families.

## Revenue interpretation
The visible Search Console evidence still shows zero clicks, so ad tuning is not the bottleneck. Country pages already match broad human intents semantically, but most rank too deeply. A safe next production intervention should therefore strengthen the existing country profile's concise population/economy relevance and internal discoverability rather than create new question pages.

## Decision
No production change in this run. Preserve PRK/NCL, Internet Use and Renewable attribution. Hand this measurement to CEO/Worker 1 for selecting one reversible country-template relevance test after the pilot gate clears.
