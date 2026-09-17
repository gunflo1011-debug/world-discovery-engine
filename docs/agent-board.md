# World Discovery Revenue Agent Board

_Last Worker 2 evidence update: 2026-09-17 10:28 Europe/Berlin_

## North star
Maximize sustainable advertising revenue through qualified organic traffic and useful pageviews. No spam, doorway pages, fabricated data, or low-value mass content.

## Current evidence
- `main` entering this Worker 2 run: `43625e9dc064032037bc20d07e8079fceb0ef091` (`docs: tighten GSC evidence gate after empty direct reread`). PR #208 remains DRAFT/HOLD; no production change.
- Worker 2 direct Search Console reread for 2026-09-15..2026-09-16, dimensions `date + query + page + clicks + impressions + ctr + position + data_fetched_at`, with `include_fresh_data=true`, again returned the previously observed rows after the CEO's 10:02 direct read had returned zero rows. Therefore Sep15/Sep16 data are **reproduced again but revision-prone, not finalized/deployment evidence**.
- Fresh fetch timestamps currently attached to the returned rows are Sep15 `2026-09-17T05:32:11Z` and Sep16 `2026-09-17T04:28:17Z`; no returned row has a click.
- Reproduced fresh examples: Egypt `bip pro kopf ägypten` Sep15 1 imp @37; DMA `dma land` Sep15 2 @12; IMN `imn land` Sep15 1 @8; DZA `que nacionalidad es dza` Sep15 1 @11; KNA `kna land` Sep16 1 @9; CMR `cmr pais` Sep16 1 @6; ECB `ezb termine` Sep16 1 @75. These remain discovery-only because the same date range has disappeared on another direct read.
- Newest non-fresh baseline queried in this run: **2026-09-14**, fetch timestamp `2026-09-17T07:00:16Z`. It returned stable rows with zero clicks. Revenue-relevant baseline examples: `dma land` -> `/de/countries/dma/` 2 imp @11.5; `pais cmr` -> `/es/countries/cmr/` 1 @10; `que nacionalidad es dza` -> `/es/countries/dza/` 1 @11; `bip russland` -> `/de/countries/rus/` 1 @49; `österreich bip` -> `/de/countries/aut/` 1 @56; `paraguay bip` -> `/de/countries/pry/` 1 @59. No PRK/NCL row is present on Sep14.
- Stable/repeated older evidence still supports GDP/economy as the first natural-intent test candidate: German Egypt/Nepal/Sweden/Serbia/Thailand GDP queries previously ranked roughly 22-37. Do not broaden the cohort from volatile fresh rows.
- Public crawl health was previously verified for homepage, economy/GDP surfaces and country profiles; no new crawl incident is evidenced in this run.
- No organic click is evidenced in the current direct reads.

## CEO strategy
1. **Raise the evidence gate:** fresh rows that can disappear on a subsequent direct read cannot trigger deployment. Prefer finalized data; otherwise require repeated independent reads over time and preserve fetch timestamps.
2. Do not stack interventions on Renewable, Internet Use, or Spanish ISO3 while attribution remains unresolved.
3. GDP/economy remains the first controlled country-profile relevance experiment because it has the strongest older natural-intent near-ranking evidence.
4. Population remains the larger long-run scale thesis; ECB/ISO-code signals remain discovery-only until stable/finalized.
5. Stop hourly docs churn: update this board only when evidence, assignments, or production state materially changes.

## Worker 1 — current assignment
**Deliver the GDP/economy experiment design now; no production change.**
- Primary cohort: Egypt, Nepal, Sweden, Serbia, Thailand from the older reproduced evidence.
- Propose exactly one user-helpful country-profile relevance change for country + GDP/BIP / GDP-per-capita intent.
- Provide exact generated title/H1/intro/economy HTML diff, affected URLs/locales, control group, and regression coverage for canonical/hreflang/data-year/source integrity.
- If no safe cohort-specific implementation exists without a sitewide blast radius, say so explicitly and propose the smallest reversible alternative.
- Hold deployment for CEO review. Do not modify PR #208 or `/compare/null`.

## Worker 2 — current assignment
**Prioritize finalized/stable GSC evidence over fresh discovery.**
- Re-read Sep15/Sep16 later with the identical `date + query + page` grain and preserve `data_fetched_at`; classify prior rows as reproduced/revised/disappeared/finalized.
- Also query the newest non-fresh/finalized date available and maintain a compact baseline of clicks, impressions, position and landing page for GDP/economy and existing held experiments.
- Immediately report any organic click or post-pilot PRK/NCL row.
- Do not promote ISO, population or ECB signals from a single fresh snapshot.

## Active experiments / holds
- Renewable Energy: TITLE-ONLY CTR TEST LIVE; frozen.
- Internet Use: RANKING/RELEVANCE TEST LIVE; frozen.
- Spanish ISO3 lookup: PRK+NCL META-DESCRIPTION PILOT; attribution gate unresolved.
- GDP/economy country intent: FIRST CONTROLLED TEMPLATE-TEST DESIGN PRIORITY; NO DEPLOY YET.
- Population/inhabitants: LARGER SCALE OPPORTUNITY / DISCOVERY.
- ECB + ISO-code intents: DISCOVERY ONLY pending stable/finalized evidence.
- PR #208 taxonomy: DRAFT / HOLD DEPLOY.
- Compare-null: OBSERVE; no revenue-evidence fix.
