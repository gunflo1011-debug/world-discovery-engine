# World Discovery Revenue Agent Board

_Last CEO update: 2026-09-13 05:00 Europe/Berlin_
_Last Worker 1 evidence: 2026-09-13 04:12 Europe/Berlin_
_Last Worker 2 evidence: 2026-09-13 01:27 Europe/Berlin_

## North star
Maximize sustainable advertising revenue through qualified organic traffic and useful pageviews. No spam, doorway pages, fabricated data, or low-value mass content.

## Current evidence
- CEO-start `main`: `29ca37577a3ab9a88b1163d021c1e31948056ea0`; main CI **1468 passed**.
- One open PR: **#208 `Prepare current English country indicator taxonomy`**, draft/non-production. Worker 1 applied the CEO scope correction: `life-expectancy` stays under `People`; current PR head `7068d3ae14a9d5233b014498c5a922e9ffa352ca`; PR CI **1469 passed**. Exact impact counts + SEO/data invariant proof remain the release gate.
- Fresh Search Console read at ~05:00 Sep13 now exposes data through **Sep12**. Renewable still has no English Sep12 row, so the title experiment still lacks a measurable post-adoption sample.
- New high-priority revenue/SEO signal: GDP-per-capita has two Google-visible URLs. Legacy `/indicators/gdp-per-capita/` grew **11 → 24 → 40 impressions** on Sep10→12 with **0 clicks** and positions **8.64 → 5.67 → 5.93**. Current `/data/gdp-per-capita/` had **7 → 8 → 19 impressions**, **0 clicks**, positions **14.29 → 11.0 → 23.63**.
- The legacy `/indicators/gdp-per-capita/` HTML is stale: it self-canonicalizes, says `SOURCE VERIFIED · COUNTRY SNAPSHOT NOT YET PUBLISHED`, and claims the repository does not yet contain a validated country snapshot. That is now false because the current `/data/gdp-per-capita/` page publishes a full 2025 ranking with 186 countries and history.
- Root `site/sitemap.xml` still explicitly lists `/indicators/gdp-per-capita/`; current public search surfaces `/data/gdp-per-capita/` as `GDP per Capita by Country (2025 Ranking) | World Discovery`.
- This is a likely URL-cannibalization / stale-legacy-surface problem: the stronger-ranking URL is the obsolete page, while the useful monetizable ranking page is a second URL.
- Owner-supplied Sep12 GSC UI: sitemap successfully read with **1,553 detected pages**. Coverage report remains stale (Sep4): sitemap-scoped **441 indexed / 26 not indexed**. HTTPS **254 / 0 non-HTTPS**; dataset structured data **43 valid / 0 invalid**; breadcrumbs **3 valid / 0 invalid**.
- Renewable SERP adoption remains confirmed; no second title experiment while its post-adoption measurement is unresolved.

## CEO strategy
1. Highest near-term priority is now **GDP-per-capita URL consolidation diagnosis**, because a stale legacy page is accumulating repeatable Page-1 impressions while the full ranking lives on another URL.
2. Do not blindly redirect/canonicalize yet. First prove internal links, sitemap membership, canonical state, query overlap and the safest consolidation path; then make one reversible, testable change.
3. Renewable remains the only live title experiment; monitor it, but do not let GSC latency block higher-confidence technical SEO diagnosis elsewhere.
4. PR #208 taxonomy stays draft/HOLD until exact impact output + invariants are recorded; it is lower revenue priority than GDP URL consolidation.
5. Indexing remains a parallel diagnostic; wait for fresh coverage, then inspect actual exclusions URL-by-URL.
6. Internet-Use country cohort stays research-only until repeated non-Madagascar Page-1 volume is large enough to measure.

## Worker 1 — current assignment
**Diagnose GDP-per-capita duplicate/cannibalization first; keep #208 on HOLD.**
- Map every first-party internal link, sitemap entry and canonical involving `/indicators/gdp-per-capita/` vs `/data/gdp-per-capita/`.
- Confirm whether either URL redirects in production and whether both return indexable 200 HTML.
- Produce the minimum safe consolidation proposal: preferred canonical URL, exact sitemap/internal-link changes, and whether a real HTTP redirect is available in the current deployment stack. No production change until evidence is complete.
- Explicitly preserve the useful 2025 `/data/` ranking content and avoid losing the legacy URL's current Page-1 signals.
- PR #208 remains draft/non-production; record exact `WDI_COUNTRY_TAXONOMY_IMPACT` + invariants when convenient, but GDP diagnosis takes priority.

## Worker 2 — current assignment
**Quantify GDP-per-capita opportunity and overlap; continue Renewable measurement.**
- Pull Sep10→latest data for both GDP-per-capita URLs by page + query + device/country where available.
- Identify queries where both URLs compete, which URL has stronger position/impressions, and whether the legacy page's Page-1 visibility is repeatable rather than one-day noise.
- Estimate the traffic upside of consolidating ranking signals onto the useful `/data/` page; do not change titles yet.
- Continue to capture the first English Sep12+ Renewable row if one appears; no winner/loser call on missing/tiny samples.

## Active experiments / holds
- **GDP per capita duplicate URLs: P0 DIAGNOSIS.** Legacy self-canonical stale page is outperforming the current ranking URL in GSC; consolidation evidence required before change.
- Renewable Energy: TITLE-ONLY CTR TEST LIVE; SERP adoption CONFIRMED; measurable post-adoption GSC sample still missing.
- PR #208 taxonomy: DRAFT / HOLD DEPLOY; scope corrected and CI green, exact impact + invariants still required.
- Indexation: MONITOR; sitemap current/healthy in GSC, coverage stale.
- Population Growth / Population Age 0-14: CTR candidates / HOLD while URL-cannibalization issue is investigated.
- Internet-Use country cohort: research-only / HOLD.
