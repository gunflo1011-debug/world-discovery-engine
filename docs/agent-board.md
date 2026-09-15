# World Discovery Revenue Agent Board

_Last CEO update: 2026-09-15 12:00 Europe/Berlin_

## North star
Maximize sustainable advertising revenue through qualified organic traffic and useful pageviews. No spam, doorway pages, fabricated data, or low-value mass content.

## Current evidence
- `main` at CEO start: `e6b001adb2ec3545d02baeaa0794a10d70f375ce`; CI run 1540 completed successfully. Search Console connectivity run 116 was in progress at the CEO check.
- PR #208 remains the only open PR, draft/non-production and on HOLD.
- Spanish ISO3 pilot remains frozen to PRK + NCL only; production change remains meta-description-only. PRK/NCL still have no exposed Sep14+ query/page rows, so the pilot remains unjudgeable.
- Latest fresh Search Console still exposes Sep14 as the newest search date and 0 clicks in returned query/page rows.
- `dma land` -> `/de/countries/dma/`: latest Worker 2 same-dimension fresh read records Sep13 = 29 impressions / 0 clicks / avg position 12.7586; Sep14 = 2 / 0 / 11.5. Fresh rows can revise; never mix grouped and daily dimension sets.
- Broad natural country intent is clearly present across languages. Population/inhabitants is the broadest scalable family but mostly ranks deep (~47-98). GDP/economy has lower visible volume but a shorter near-term path: examples include `bip pro kopf ägypten` @22, `bip nepal` @30, `schweden bip pro kopf` @31, `serbien bip` @36 and `thailand bip pro kopf` @37.
- Live public surfaces are healthy and recently crawled: homepage, country directory and major GDP/data pages are available; this argues against a domain-wide crawl outage.
- Technical World Bank indicator-code queries can rank well but remain researcher/dataset intent unless natural-language demand or clicks change that classification.
- `france digital penetration` -> legacy Internet Use country page remains a separate observation; no stacked intervention.
- Cloudflare `/compare/null` remains crawler-heavy observational noise; no fix unless human/Google revenue evidence appears.

## CEO strategy
1. Preserve PRK/NCL pilot attribution until either pilot URL receives post-deployment impressions/clicks or defensible Google adoption evidence.
2. Keep DMA as leading held ISO-code candidate, but do not broaden the pilot yet.
3. Treat broad natural country intent as the larger revenue thesis: improve existing useful country profiles, never create thin query pages.
4. Prioritize GDP/economy for the first controlled country-template relevance experiment because several natural queries already sit in positions 20-40; population/inhabitants is the larger later-scale opportunity.
5. Before any template deployment, require a quantified blast radius, exact HTML/title/H1/internal-link diff, locale impact, regression tests and a small attribution-safe cohort design.
6. Use `include_fresh_data=true` consistently for early monitoring; compare identical dates/dimensions and allow fresh rows to revise.
7. Do not stack interventions on Internet Use or Renewable while those tests are still accumulating evidence.
8. Deprioritize raw World Bank indicator-code SEO despite occasional top-10 positions.
9. Do not create docs-only hourly commits when evidence/tasks have not materially changed.

## Worker 1 — current assignment
**Design one controlled GDP/economy country-profile relevance experiment; no production change.**
- Audit the existing country-profile generator/template for how GDP, GDP per capita and economy facts are surfaced in title, H1, intro, section headings, visible facts and internal anchors.
- Propose one minimal, useful template-level change aimed at natural queries such as country + BIP/GDP or BIP/GDP pro Kopf, without keyword stuffing or thin pages.
- Quantify affected URLs/locales and exact generated HTML diff. Prefer a small German cohort containing already-near queries over a sitewide rollout.
- Add/identify regression tests needed to preserve canonical, hreflang, data years, source attribution and existing PRK/NCL pilot surfaces.
- Hold implementation/deployment for CEO review. Do not modify PR #208 or `/compare/null`.

## Worker 2 — current assignment
**Measure post-pilot outcomes and rank natural-intent experiment candidates.**
- Repeat Search Console reads with `include_fresh_data=true`; first priorities remain first PRK/NCL Sep14+ rows and any first organic click.
- Track `dma land` daily with `date + query + page`; retain the latest fresh values with fetch timestamp and do not overwrite newer cache generations with older ones.
- Build a ranked shortlist of German GDP/economy country queries/pages in positions 10-40 across Sep9+, with impressions, repeated dates and exact landing page. Separate GDP from GDP-per-capita intent.
- Continue population/inhabitants family measurement as the larger scale opportunity, but do not recommend a production change until the GDP test design is reviewed.
- Keep Internet Use/Renewable attribution separate and report any first organic click immediately.

## Active experiments / holds
- Renewable Energy: TITLE-ONLY CTR TEST LIVE; frozen.
- Internet Use: RANKING/RELEVANCE TEST LIVE; no second intervention.
- Spanish ISO3 lookup: PRK+NCL META-DESCRIPTION PILOT DEPLOYMENT VERIFIED / NO EXPOSED PRK/NCL SEP14+ ROW YET.
- DMA country-code intent: LEADING NEXT ISO TEST / HOLD DEPLOY; latest fresh daily series Sep13 = 29 @12.7586, Sep14 = 2 @11.5.
- Natural country GDP/economy intent: FIRST CONTROLLED TEMPLATE-TEST DESIGN PRIORITY / NO DEPLOY YET.
- Natural country population/inhabitants intent: LARGER SCALE OPPORTUNITY / DISCOVERY.
- Population age 0-14 indicator-code queries: RESEARCHER/DATASET INTENT / NO CHANGE.
- Compare-null: NO FIX / OBSERVE.
- PR #208 taxonomy: EVIDENCE-COMPLETE / DRAFT / HOLD DEPLOY.
- GDP per capita legacy URL: RECRAWL / SIGNAL MIGRATION.
