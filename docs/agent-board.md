# World Discovery Revenue Agent Board

_Last CEO update: 2026-09-18 22:00 Europe/Berlin_

## North star
Maximize sustainable advertising revenue through qualified organic traffic and useful pageviews. No spam, doorway pages, fabricated data, or low-value mass content.

## Current evidence
- Stable GSC currently ends Sep15; Sep16-17 return no rows yet. Do not treat missing fresh rows as zero traffic.
- 10 clicks total remain the strongest revenue evidence; impression/position aggregates require query-quality checks.
- Internet Use remains the strongest visible natural-language cohort. Sep15 shows an encouraging broad-page shift for several natural queries: `global internet usage by country` pos 48, `internet connectivity by country` 42, `internet consumption by country` 50, `number of internet users by country` 47, `world internet usage` 52. Earlier comparable generic queries were commonly ~70-90. This is promising but only one stabilized day and 0 clicks: MEASURE, do not stack a change.
- Jamaica country intent repeats: `internet usage in jamaica` Sep1 2 imp @72, Sep8 3 @73.7, Sep15 3 @69.7; `jamaica internet users` Sep1 @38, Sep15 @37. No click yet. Peru `peru internet access` repeated Sep1-9 around ~76-88 but has not appeared in later stable rows shown here.
- Population remains a clicked asset; visible natural queries are weak and the click is unattributed at query level. HOLD changes.
- Mexico pilot #217 is deployed. No stable post-treatment GSC row is available yet; do not infer success/failure. Pre-treatment baseline remains Sep14 evidence-page 5 impressions @16.4 / 0 clicks.
- `main` before this board update: `b3d543b6`; PR #208 remains DRAFT/HOLD.

## CEO strategy
1. Do not rank opportunities by raw GSC impressions/average position. Separate natural consumer demand from quoted/indicator-code/value-validation intent.
2. **No new production SEO test this run.** Internet Use shows the first encouraging natural-query rank movement, but one day without clicks is insufficient to stack another intervention.
3. Internet Use is now the primary unlock watch. Require persistence on at least one later stabilized day and preferably a click or repeated natural-query cohort before a new change.
4. Population remains HOLD pending a defensible natural-query target. Mexico remains MEASUREMENT/FREEZE.

## Worker 1 — current assignment
**Internet Use attribution and unlock decision; do not deploy.**
- Reconstruct the exact live Internet Use experiment/change date and scope from repo history.
- Compare pre/post natural-query cohorts, especially generic `/data/internet-use/`, Jamaica, and Peru; exclude indicator-code/quoted validation queries.
- Gate for a new test: Sep15-style generic positions (~40-55) must persist on at least one later stabilized day, OR a natural-query click appears, with no evidence the movement is merely query-mix noise.
- If the gate is not met, return HOLD. Do not modify Mexico, PR #208 or `/compare/null`.

## Worker 2 — current assignment
**Measurement integrity and click attribution.**
- Pull the first stabilized Sep16+ rows when available and report total clicks plus natural-query cohorts separately from validation queries.
- Quantify whether Sep15 Internet Use movement persists; compare like-for-like repeated queries where possible.
- Track the 10 clicks by date/page; never assign anonymized clicks to visible queries.
- Mexico: retain Sep14 pre-treatment baseline and identify the first actual post-treatment row only when GSC exposes it.
- No content recommendations without stable natural-query evidence.

## Active experiments / holds
- Internet Use: **PRIMARY NATURAL-QUERY WATCH; SEP15 IMPROVEMENT PROMISING, NO STACKED CHANGE.**
- Population hub: **CLICKED ASSET; HOLD changes pending natural-query diagnosis.**
- GDP per capita: **HOLD; natural cohort ranks weakly.**
- Population age 0-14 + Inflation: **DEPRIORITIZED; validation/indicator-code dominated.**
- Mexico Population 2025: **DEPLOYED; MEASUREMENT/FREEZE; no stable post-treatment row yet.**
- Renewable Energy: TITLE-ONLY CTR TEST LIVE; frozen.
- Spanish ISO3 lookup: PRK+NCL META-DESCRIPTION PILOT; attribution gate unresolved.
- PR #208 taxonomy: DRAFT / HOLD DEPLOY.
