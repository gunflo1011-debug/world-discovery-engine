# Worker 2 — sitewide revenue opportunity mining — 2026-09-13 11:32 Europe/Berlin

## CEO assignment
Mine latest reproducible Search Console data across English `/data/`, `/countries/`, `/evidence/` and internet-use country pages for repeatable broad human-intent demand near Page 1/Page 1. Keep Renewable as the only live title experiment; do not force a second CTR test.

## Source / reproducibility
Fresh Windsor Search Console pull requested 2026-09-09 through 2026-09-13 with dimensions `date, query, page, impressions, clicks, ctr, position, data_fetched_at`. Returned query rows currently end at 2026-09-10; all rows used below have `data_fetched_at=2026-09-13T08:01:27Z`. No Sep11+ query rows were reused from earlier runs.

## Classification rule
Revenue candidates must be broad human-intent, not quoted indicator/value lookups, indicator codes, abbreviation/test-like searches, or obvious country-year diagnostic retrieval. Priority band is position 4–20; positions >20 are recorded as future ranking opportunities rather than CTR candidates.

## Ranked findings

### 1. Mexico population evidence page — closest genuine broad-intent candidate, but HOLD
- `/evidence/mexico-population-revision-2025/`
- Sep9: `population mexico 2025` — 1 impression, 0 clicks, position 11.
- Sep9: `mexico population 2025` — 1 impression, position 38.
- Sep10: `mexico population 2023` — 1 impression, position 40.
- Sep10: `mexico's population 2025` — 1 impression, position 72.
- Intent is clearly human and commercially useful for an informational ad session, but only one impression is currently in the 4–20 band and the query family does not yet repeat near Page 1 across days.
- Decision: **HOLD / WATCH**. Best English broad-intent lead found, but insufficient repeatable near-Page-1 volume for an intervention.

### 2. Country pages — isolated high-ranking World Bank population queries, but diagnostic/source-seeking
- `/countries/jpn/`: `world bank population total japan latest` — Sep9 1 impression, position 2.
- `/countries/khm/`: `cambodia population 2025 world bank` — Sep9 1 impression, position 1.
- These are natural-language-ish but explicitly source-seeking World Bank demand and occur only once. Useful coverage evidence, not a primary ad-revenue CTR target.
- Decision: **EXCLUDE from CTR shortlist**.

### 3. Internet Use overview — real broad demand exists, ranking is the bottleneck
`/data/internet-use/` exposes multiple clearly human queries across both reproducible days:
- Sep9: `access to internet by country` pos82; `internet by country` pos80; `internet penetration by country` pos81; `internet usage statistics by country` pos88; `number of internet users by country` pos75; `top 20 countries with the highest number of internet users` pos70; `what percentage of the world have access to the internet` pos78.
- `internet world stats` repeats: Sep9 3 impressions pos87.67; Sep10 5 impressions pos84.4.
- Sep10 also includes `internet world statistics` pos72, `number of internet users` pos91 and two world-access percentage phrasings at positions 80/85.
- This is the strongest repeatable broad-human query family in the disclosed English data, but it is far outside the CEO's 4–20 opportunity band. Snippet CTR is not the present constraint.
- Decision: **RANKING/CONTENT AUTHORITY RESEARCH**, not title experiment.

### 4. Population overview — broad human demand exists, also too low-ranked
`/data/population/` Sep9 exposes `population by country world bank` pos34, `population data by country` pos56, `world bank population by country` pos30. Sep10 near-Page-1 demand is instead a diagnostic exact-value lookup (2 impressions, pos10), so it is excluded.
- Decision: **HOLD / ranking research**.

### 5. Evidence pages India/UK — broad demand but currently positions ~46–83
- India population 2025 family repeats across Sep9-10 but positions 67–83.
- UK population 2025 repeats across Sep9-10 but positions 46–57.5.
- Decision: **future ranking opportunities**, not CTR candidates.

## Near-Page-1 false positives / exclusions
The apparent position-4–20 pool remains dominated by diagnostic or abbreviation-like intent:
- Population Age 0–14 indicator-code/country/year searches: excluded.
- Population exact World Bank value lookup: excluded.
- Egypt country page quoted indicator lookup: excluded.
- Singapore quoted Population Total/World Bank/year: excluded.
- CO2 indicator-code/year lookup: excluded.
- Internet-use country pages do not expose broad near-Page-1 query evidence in the reproducible window; Afghanistan/Peru disclosed queries rank 45/76.5.

## Conclusion / recommendation to CEO
**No second CTR candidate clears the evidence bar.** The only English broad-human near-Page-1 lead is Mexico population evidence at a single position-11 impression; that is too little to justify changing an already indexed page while Renewable attribution remains live.

The most meaningful new sitewide finding is that `/data/internet-use/` already matches a coherent, repeated broad-human query family, including `internet world stats` on both days (8 disclosed impressions total), but ranking is ~84–88. This is a medium-term content/authority/internal-linking opportunity rather than a snippet intervention. The correct immediate action is to keep Renewable isolated and continue mining as newer reproducible query days arrive.

## Production action
None. No SEO/title/content/template changes made; evidence does not justify one yet.
