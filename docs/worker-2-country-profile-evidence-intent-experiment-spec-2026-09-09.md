# Worker 2 — Country-profile evidence-intent experiment spec

_Date: 2026-09-09_
_Status: implementation-ready; do not deploy until CEO authorizes_
_Recommendation: BUILD after PR #198 measurement closes_

## Why this experiment
Finalized Search Console data (fresh data disabled) for Sep 1–8 shows a sparse but real country-profile evidence-intent wedge. The strongest repeatable natural-language cluster is Papua New Guinea population growth 2023:

- `papua new guinea population growth rate 2023` — position 8 on Sep 4, 8 on Sep 5, 7 on Sep 6.
- `papua new guinea population growth rate 2023 world bank` — position 10 on Sep 5.

Other one-off Top-20 evidence-intent matches exist (Rwanda current population ~4, Iceland current population ~7, Cambodia population 2025 + World Bank ~4, Botswana population growth 2024 ~10, Netherlands 2023 female life expectancy ~11), but PNG is the best experiment because the same natural query repeats across three finalized days and has an explicit World Bank variant.

## Current live-page gap
Target: `/countries/png/`.

The live profile is useful and crawler-visible, but it currently foregrounds only the latest population-growth observation: `Population growth (annual %) | 2025 | 1.8%`. The page does not initially expose the historical 2023 population-growth answer that Google is already ranking it for. The site-wide `/data/population-growth/` page has historical-year machinery, so the verified source data already exists elsewhere in the product.

## Experiment
Upgrade only the Papua New Guinea profile with one compact server-rendered `Exact historical answer` block. Do not add a new URL and do not change the country-template globally in this experiment.

### Proposed DOM placement
Place immediately after `Quick view / Key indicators` and before the `People` section so the answer is visible early without displacing the current latest-value overview.

Suggested semantic structure:

```html
<section class="country-evidence-answer" aria-labelledby="png-growth-2023-answer">
  <p class="eyebrow">Exact historical answer · World Bank WDI</p>
  <h2 id="png-growth-2023-answer">Papua New Guinea population growth in 2023</h2>
  <p><strong>[VERIFIED_VALUE]%</strong> annual population growth in 2023.</p>
  <p>Indicator <code>SP.POP.GROW</code> · Population growth (annual %) · World Bank World Development Indicators.</p>
  <a href="/data/population-growth/">Compare population growth by country and year →</a>
</section>
```

`[VERIFIED_VALUE]` must be resolved at build time from the same validated WDI historical dataset used by `/data/population-growth/`. Never hard-code a number from Search Console or from this spec. If the exact PNG 2023 observation is absent, fail closed and render no block.

## Provenance contract
- Indicator: `SP.POP.GROW` — Population growth (annual %).
- Source surface: World Bank World Development Indicators already used by World Discovery.
- Observation year must be 2023; retrieval/build date must never be presented as observation year.
- Display formatting may round consistently with the existing site, but machine/source value must remain unchanged in the underlying verified dataset.
- Link the answer to the existing population-growth comparison/history surface rather than inventing a new provenance path.

## SEO/indexing contract
- Keep canonical exactly `https://worlddiscoverydata.com/countries/png/`.
- No query-parameter canonicals, no new country-year URL, no sitemap addition, no redirect.
- Do not change title/H1 in this first test; isolate the treatment to crawler-visible exact-answer content.
- No FAQ/schema markup solely for ranking purposes. Existing valid structured data may remain unchanged.
- Do not roll the block across other countries until the experiment is measured and CEO explicitly approves expansion.

## Accessibility / UX
- Use a real `<section>` + `<h2>` in normal document flow; no JS required to reveal the answer.
- Preserve heading order and existing focus order.
- Do not encode meaning only by color/iconography.
- Link text should describe the destination (`Compare population growth by country and year`).
- On narrow screens the block must wrap without horizontal scrolling.

## Implementation route
1. Locate the country-profile generator/template and the validated historical WDI data accessor.
2. Add an experiment allowlist containing only `PNG + SP.POP.GROW + 2023`.
3. Resolve the observation during build; fail closed if absent or non-numeric.
4. Render the block in initial HTML only for PNG.
5. Build the full static site.
6. Assert generated `/countries/png/` contains `SP.POP.GROW`, `2023`, `World Bank`, the verified value and the `/data/population-growth/` link.
7. Assert a control profile (for example `/countries/khm/`) does not receive the experiment block.
8. Assert canonical/sitemap URL counts are unchanged and existing CI/smoke tests remain green.

## Rollback
Single allowlisted rendering branch. Rollback is removal/revert of that branch; no URLs, redirects, data migrations or external state are created.

## Measurement
Preserve a pre-change GSC baseline for `/countries/png/`. After deployment, use finalized Search Console only (`include_fresh_data=false`). Primary query cluster:
- contains `papua new guinea` + `population growth` + `2023`;
- separately track rows that also contain `world bank`.

Primary success signals over a comparable finalized post-change window:
1. no material loss of impressions for the target cluster;
2. impression-weighted average position improves versus baseline, or target-query clicks appear without position deterioration;
3. CTR is non-decreasing when impression volume is sufficient to interpret it;
4. no material deterioration in the profile's other query mix.

Because current volume is tiny, do not declare success from a single impression/day. Prefer at least 7 finalized post-change days and compare impressions, clicks, CTR, weighted position and query mix. If volume remains too sparse, HOLD rather than claiming uplift.

## Decision
**BUILD after CEO authorization and after PR #198 measurement closes.** PNG is a better bounded country-profile test than the one-off current-population matches because its exact historical intent repeated on three finalized days and also produced a World Bank-qualified query. The treatment is reversible, source-faithful and creates no new indexable pages.
