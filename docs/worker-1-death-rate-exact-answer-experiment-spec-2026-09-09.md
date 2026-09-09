# Worker 1 — Death-rate exact-answer experiment spec (2026-09-09)

## Status
Prepared only. **Do not deploy until PR #198 measurement closes and CEO explicitly authorizes this experiment.**

## Measurement gate
Finalized Search Console for `/data/population-age-0-14/`, requested through 2026-09-10 with fresh data disabled, still returns rows only through 2026-09-06. Therefore `/data/*` remains frozen.

## Important implementation finding
The live `/data/death-rate/` page already contains an `Exact country & year lookup` section between the `Quick answers` summary and the main `Country comparison` table. The initial HTML is useful but incomplete for evidence intent: it tells the crawler/user to select a country, while the exact country/year/value answer is produced only after interaction.

**Therefore this experiment must NOT add a second lookup block.** It should upgrade the existing lookup slot so the initial HTML contains one genuine, source-transparent historical answer while preserving the interactive lookup.

## Exact DOM placement
Keep the current section in its existing location:
1. hero / latest snapshot;
2. `Quick answers · same-year 2024 snapshot`;
3. **existing `Exact country & year lookup` section — experiment target**;
4. `Country comparison` heading and ranking table.

Within that existing section, place the server-rendered answer immediately after the explanatory sentence and before the country/year controls. Do not move the ranking table or add another H1.

Suggested semantic skeleton (implementation intent, not final copy):
```html
<section data-experiment="death-rate-exact-answer-v1">
  <p class="eyebrow">Exact country & year lookup</p>
  <h2>Find the exact Death rate, crude (per 1,000 people) value</h2>
  <p>...</p>
  <div class="exact-answer" aria-live="polite">
    <!-- one deterministic, genuine historical answer rendered into initial HTML -->
    <strong>[Country], [Year]: [Value] per 1,000 people</strong>
    <span>World Bank WDI · SP.DYN.CDRT.IN</span>
  </div>
  <!-- existing country/year controls continue to update this same answer node -->
</section>
```

## What should be server-rendered initially
Use exactly **one deterministic historical answer** chosen before deployment from the already-observed natural-language GSC cluster, and keep it fixed for the full experiment window. Preferred candidate: **China, 2021**, because the existing finalized GSC evidence shows `China crude death rate 2021 per 1,000` at about position 2.

The value itself must be read from the site's existing verified WDI historical dataset at build time. Do not hard-code a value copied from search results or from this document.

If the existing dataset cannot produce a verified China-2021 observation during build, abort this experiment rather than substituting an unverified value.

## Query intent served
Primary intent:
- `china crude death rate 2021 per 1,000`
- equivalent natural-language country + historical year + metric queries

Secondary intent:
- World Bank/source-qualified historical crude-death-rate lookups
- `SP.DYN.CDRT.IN` + country + year lookups

This is deliberately narrower than generic `death rate by country` intent. The purpose is to test whether a crawler-visible exact answer strengthens the evidence-intent cluster already ranking well.

## Required fields in the initial answer
All of the following must be present in initial HTML, not only after JavaScript interaction:
- country display name;
- year;
- exact value from the verified WDI dataset;
- unit exactly consistent with the page dataset (`per 1,000 people`);
- source label `World Bank WDI`;
- indicator code `SP.DYN.CDRT.IN`.

The answer must use the same formatter/rounding rules as the ranking/history UI so the page never exposes conflicting values for the same observation.

## Interaction behavior
- Existing country/year controls remain the only interactive lookup controls.
- Once the visitor changes country or year, update the same `.exact-answer` node; do not append duplicate answer cards.
- The fixed initial China-2021 answer is an experiment default, not a claim that China is representative.
- Preserve keyboard navigation and `aria-live="polite"` for updated answers.

## Indexing/canonical constraints
- Keep canonical URL `/data/death-rate/`.
- Do **not** create indexable country/year result URLs or static country-year page permutations for this experiment.
- If the lookup uses query parameters for shareability, canonicalize them back to `/data/death-rate/` and do not add parameter URLs to sitemaps.
- Do not add FAQ schema or fabricate question/answer markup solely for SERP enhancement.

## Rollback
The change should be isolated to the death-rate page/config or to a page-scoped feature flag such as `deathRateExactAnswerExperiment`.

Rollback = remove/disable the pre-rendered default answer and restore the existing placeholder initial state. No data migration, URL removal, redirect or sitemap cleanup should be required.

## Pre-deploy tests
Before merge after CEO authorization:
1. build succeeds with verified China-2021 value from the existing dataset;
2. generated `/data/death-rate/index.html` contains `China`, `2021`, the exact value, `per 1,000 people`, `World Bank WDI`, and `SP.DYN.CDRT.IN` before client JS executes;
3. only one exact-answer node exists;
4. selecting another country/year updates that node correctly;
5. selected answer equals the corresponding historical dataset observation;
6. canonical remains `/data/death-rate/`;
7. no new sitemap URLs are introduced;
8. existing ranking/year/history interactions still pass;
9. mobile rendering remains readable without pushing the main table excessively far down-page;
10. full CI/Pages checks green.

## Success measurement
Preserve a pre-change baseline immediately before deployment. Evaluate only after at least two stable finalized post-change Search Console days are available; do not use fresh/incomplete rows for the decision.

Primary metrics for `/data/death-rate/`:
- impressions for natural-language country + year + crude-death-rate queries;
- clicks and CTR;
- average position;
- count/share of visible queries in positions 1-10 and 1-20;
- whether query mix broadens beyond literal indicator-code searches without becoming irrelevant.

Primary experiment cluster: China + 2021 + crude death rate/per-1,000 variants. Secondary read: other historical country/year natural-language variants already seen for Indonesia, Brazil and United States.

## Decision rule
- **Scale candidate:** relevant evidence-intent impressions expand and/or position/CTR improves without a material relevance regression.
- **Hold longer:** sample remains too small to distinguish movement from noise.
- **Rollback / do not scale:** visibility shifts toward irrelevant intent, exact-answer consistency issues appear, or adequate finalized observation shows no useful movement.

Even on success, the next step is one additional controlled indicator-page test, **not** a mass template rollout.

## Production state when prepared
- `main` head before this documentation commit: `77d692a0d9e543f7a1332355b7b3b84733d5773e`.
- Open PRs: 0.
- CI run 1279 on that head: success.
- Live `/data/death-rate/` reachable; existing lookup appears before the country comparison table.
