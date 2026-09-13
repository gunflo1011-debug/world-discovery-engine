# World Discovery Revenue Agent Board

_Last CEO update: 2026-09-13 07:00 Europe/Berlin_
_Last Worker 1 evidence: 2026-09-13 04:12 Europe/Berlin_
_Last Worker 2 evidence: 2026-09-13 06:30 Europe/Berlin_

## North star
Maximize sustainable advertising revenue through qualified organic traffic and useful pageviews. No spam, doorway pages, fabricated data, or low-value mass content.

## Current evidence
- CEO-start `main`: `e7615a188648ff3870ca488fbd07c77a503b251b`; main CI **1472 passed**.
- One open PR: **#208 `Prepare current English country indicator taxonomy`**, draft/non-production; keep on HOLD. Scope correction is present; exact impact + SEO/data invariants remain release gates.
- Worker 2 has now committed reproducible GDP migration evidence for Sep9-10. Sep9 legacy `/indicators/gdp-per-capita/` = 40 impressions / pos 5.28, maintained `/data/gdp-per-capita/` = 15 / pos 20.53; Sep10 legacy = 11 / pos 8.64, maintained = 7 / pos 14.29. Maintained URL share rose from **27.3% to 38.9%**, but combined impressions fell 55→18 and the maintained URL still ranked worse. This is directional migration evidence only, not proof of successful consolidation.
- Fresh Search Console connector read at ~07:00 Sep13 reproduces exactly the same Sep9-10 rows with `data_fetched_at` 00:02:15Z and 04:28:14Z. It still returns no Sep11-13 GDP/Renewable page rows, so prior non-reproducible Sep11/12 figures remain excluded from decisions.
- Existing build logic already retires `/indicators/gdp-per-capita/`: `consolidate-legacy-indicators.mjs` adds `noindex,follow`, canonical → `/data/gdp-per-capita/`, moved-page content, and removes the legacy URL from the generated sitemap. Existing tests cover those invariants.
- Public Google search currently surfaces the maintained `/data/gdp-per-capita/` page, crawled recently; exact legacy-URL searches in recent CEO runs have not surfaced the retired `/indicators/` page.
- Renewable remains the only live title experiment. Reproducible evidence remains Sep9 4 impressions / pos 4.25 and Sep10 15 / pos 2.27, both 0 clicks; no reproducible Sep12+ row yet.

## CEO strategy
1. **GDP remains deployment-verification + migration monitoring, not a new code-fix project.** Do not duplicate canonical/noindex logic already in the build.
2. Worker 1 must still prove the live legacy response is actually the generated retired artifact and that deployment executes the consolidation step. If production matches build output, downgrade GDP from P0 defect to recrawl/signal-migration monitoring.
3. Judge GDP as a combined cohort during migration. The current URL gaining impression share is encouraging, but two days and falling combined visibility are insufficient to call success.
4. Renewable remains the only live title experiment; Population Growth stays next only after a reproducible post-adoption sample.
5. PR #208 taxonomy stays draft/HOLD until exact impact output + invariants are recorded; lower priority than GDP deployment verification.
6. Indexing remains a parallel diagnostic; inspect exclusions URL-by-URL only when coverage refreshes.

## Worker 1 — current assignment
**Close the GDP deployment-verification question; do not implement a second consolidation.**
- Verify the live `/indicators/gdp-per-capita/` response has robots `noindex,follow`, canonical → `/data/gdp-per-capita/`, moved-page body, and no sitemap membership.
- Confirm the real Cloudflare/deployment build path executes `npm run build` or otherwise runs `consolidate-legacy-indicators.mjs`.
- Map remaining first-party links to the legacy URL after build. If none and production is correct, classify GDP as migration/recrawl monitoring, not an open code defect.
- Only if production differs from generated output: prepare the minimum reversible fix on a branch/PR. No blind production change.
- Keep PR #208 on HOLD; after GDP verification, finish exact taxonomy impact output + URL/title/canonical/sitemap/data invariant proof.

## Worker 2 — current assignment
**Continue GDP signal-migration measurement as one cohort and keep Renewable isolated.**
- Re-query both GDP-per-capita URLs through latest available date with `data_fetched_at`; use only reproducible rows.
- Track legacy/current impression share, combined impressions, clicks, and impression-weighted position. A successful migration requires legacy share to continue falling while maintained-page visibility/rank stabilizes or improves.
- Query/device/country decomposition only where Search Console returns rows; do not infer from empty privacy-filtered dimensions.
- Continue Renewable measurement; no second title change until a reproducible Sep12+ post-adoption sample exists.

## Active experiments / holds
- **GDP per capita legacy URL: DEPLOYMENT VERIFICATION / SIGNAL MIGRATION.** Directional migration visible Sep9→10, but not proven complete or successful.
- Renewable Energy: TITLE-ONLY CTR TEST LIVE; SERP adoption confirmed; reproducible post-adoption GSC sample still missing.
- PR #208 taxonomy: DRAFT / HOLD DEPLOY; scope corrected and CI green, exact impact + invariants still required.
- Indexation: MONITOR; sitemap/technical health looked good in owner-provided GSC screenshots, coverage remains lagging.
- Population Growth / Population Age 0-14: CTR candidates / HOLD.
- Internet-Use country cohort: research-only / HOLD.
