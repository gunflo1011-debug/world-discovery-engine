# Worker 2 revenue measurement update — 2026-09-13 23:32 Europe/Berlin

## Assignment
Measure outcomes without redefining cohorts. Preserve the frozen Internet Use Sep9-10 natural-query baseline, continue Renewable separately, freeze the Spanish ISO3 pilot cohort as PRK + NCL, and keep mining repeated broad-human queries around positions 4-20.

## Fresh Search Console evidence
Fresh connector pull on 2026-09-13 now reproducibly exposes query rows through **2026-09-11**.

### Spanish ISO3 pilot — frozen cohort remains PRK + NCL
Pre-pilot disclosed evidence remains:
- PRK: Sep9 `pais prk` = 2 impressions, 0 clicks, position 12; Sep10 `prk pais` = 3 impressions, 0 clicks (2 @9 Argentina, 1 @13 Mexico; weighted 10.33).
- NCL: Sep10 `ncl pais` = 22 impressions, 0 clicks, weighted position ~12.95; Sep11 `ncl pais` = 1 impression, 0 clicks, position 13.

Do **not** add other successful-looking codes to the pilot after the fact. CMR (`cmr pais`) also repeats Sep10/Sep11 at positions 14/13 and GNQ appears Sep11 @10, but these are observational evidence only, not part of the frozen PRK+NCL pilot cohort.

No post-deployment/adoption inference is made here because this run did not establish that the PRK/NCL meta-description pilot has been deployed and adopted by Google.

### Internet Use — first reproducible Sep11 post-change query window
Frozen Sep9-10 natural-query baseline remains **22 impressions / 0 clicks / weighted position 76.86**.

Disclosed Sep11 natural queries for `/data/internet-use/` are:
- `how many people are using internet in the world` — 1 imp, pos 72
- `how many people have access to the internet` — 1 imp, pos 87
- `how many people use internet worldwide` — 1 imp, pos 88
- `how many people use the internet globally` — 1 imp, pos 92
- `what percentage of the world has access to internet` — 1 imp, pos 85
- `world internet access` — 1 imp, pos 86
- `world internet usage by country` — 2 imp, pos 71.5

Total disclosed Sep11 natural cohort: **8 impressions / 0 clicks / weighted position 78.125**.

Interpretation: first reproducible post-change day is approximately flat/slightly worse versus the frozen 76.86 baseline (+1.27 positions worse), on only 8 disclosed impressions and a partly different query mix. This is **far too early for win/loss attribution**. Keep the experiment frozen and accumulate 3-7 post-adoption days.

### Sitewide broad-human near-page-1 mining
New Sep11 human-intent observations around positions 4-20 include:
- `gnq pais` -> `/es/countries/gnq/`: 1 impression, pos 10
- `que nacionalidad es dza` -> `/es/countries/dza/`: 1 impression, pos 11
- `imn land` -> `/de/countries/imn/`: 1 impression, pos 11
- `xkx welches land` -> `/de/countries/xkx/`: 1 impression, pos 10
- CMR/NCL ISO3 queries continue at pos 13.

These strengthen the general country-code identity intent, but no new cohort is released: individual non-pilot queries are one-impression observations and the Spanish pilot cohort must remain fixed.

## Decision
- **Internet Use:** HOLD/FROZEN. Sep11 = 8 disclosed natural impressions, 0 clicks, weighted pos 78.13 vs baseline 76.86. No second intervention.
- **Spanish ISO3:** frozen PRK+NCL cohort. Do not broaden after seeing CMR/GNQ/DZA.
- **Renewable:** keep isolated; this pull was query-focused and does not justify a new conclusion.
- **Sitewide:** country-code identity remains the clearest near-page-1 broad-human family, but current non-pilot observations are too small for another release.

## Next measurement
1. Establish exact PRK/NCL pilot deployment and Google-adoption timestamps before labeling any query row post-pilot.
2. When Sep12+ becomes reproducible, compare the exact frozen PRK/NCL intent only.
3. Continue Internet Use with the same natural-query definition; wait for 3-7 reproducible post-adoption days before judging ranking impact.
4. Keep observational non-pilot country-code queries separate from the experiment cohort.
