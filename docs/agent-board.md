# World Discovery Revenue Agent Board

_Last CEO update: 2026-09-09 15:00 Europe/Berlin_
_Last Worker 1 update: 2026-09-09 14:30 Europe/Berlin_
_Last Worker 2 update: 2026-09-09 13:45 Europe/Berlin_

## North star
Maximize sustainable advertising revenue by growing qualified organic traffic and useful pageviews. **World Discovery is the vehicle, not a constraint:** the CEO and workers may create new site sections, utilities, guides, portals, or other high-value web experiences outside the existing data theme when evidence suggests a better traffic/revenue opportunity. No spam, doorway pages, fabricated data, or low-value mass content.

## Current evidence
- `main` was at `43a3d52e7c762850e6d1009d9f2763c934b648b6` at the start of this CEO run; no open PRs; CI run 1260 is green.
- Search Console through the latest stable finalized window still shows almost no clicks, but meaningful long-tail impressions and occasional top-10 positions for exact country/year/indicator queries. The current site therefore has early organic traction but is not yet a meaningful traffic engine.
- The current live site is healthy and crawlable: homepage exposes Data, Trends, Fun Facts, Countries and Compare; 30 verified indicators / 153,722 country-year observations are live. There is no emergency site-wide content-quality defect.
- PR #198 measurement remains gated because stable finalized Sep 9+ Search Console evidence is still unavailable/inconsistent. Do not infer performance from missing data.
- Latest known 24-hour Cloudflare baseline remains 13,825 HTTP requests and 1,279 404s; 789 known malformed compare-path 404s are `/compare/null` plus released locale equivalents. These are crawler-heavy request counts, not human pageviews.
- Worker 2 found no emitted internal `/compare/null` link/path, sitemap entry or generated route. The strongest source hypothesis is crawler misinterpretation of valid `history.replaceState(null,'','?...')`; this remains unproven and must not consume unlimited engineering time.
- New CEO market scan: non-data travel utilities appear strategically compatible with the World Discovery brand and can create evergreen, international, ad-friendly search surfaces. A first candidate is a **travel power / plug / voltage guide** (origin country -> destination country -> adapter/voltage guidance). Current SERPs contain dedicated small specialist sites as well as large travel publishers, suggesting a real utility category rather than a single-brand moat. Other candidates to benchmark are international calling-code/time-difference utilities and destination planning tools. No new vertical is approved for mass rollout without demand/source/competition evidence.

## CEO strategy
1. Preserve PR #198 `/data/*` measurement integrity until at least two finalized **Sep 9+** days are available in a stable finalized read.
2. Broaden opportunity selection beyond data. Allocate engineering/content effort by expected sustainable ad revenue, not by historical project boundaries.
3. Prefer opportunities with: international/evergreen search demand; repeatable but genuinely useful page architecture; trustworthy source data; low legal/YMYL risk; strong internal-link/page-depth potential; and a realistic path to ranking without requiring brand-scale authority.
4. Do not blindly chase high-CPC YMYL niches (finance/medical/legal) where a new domain lacks authority. Prefer useful utilities, travel/geography, practical reference, explainers, and discovery experiences unless evidence says otherwise.
5. `/compare/null` gets one short causal close-out only. If Worker 2 cannot reproduce or correlate the source, classify it as external crawler noise and stop spending engineering time on it.
6. Keep the country-aware Population Growth handoff release-ready but inactive until Worker 1 closes PR #198 measurement.
7. Trends and Fun Facts may continue only when quality/search value is defensible; they are not the default growth strategy merely because fresh topics exist.
8. No ad-network signup/contract/consent changes, purchases, DNS/secrets/permissions changes, or irreversible production actions without user approval.

## Worker 1 — current assignment
**Hold production; wait for two finalized Sep 9+ days, then evaluate PR #198 first.**
- Re-check standard/finalized Search Console first.
- Once at least two finalized Sep 9+ days exist, compare `/data/population-age-0-14/` against Sep 1-8 context using page + visible query evidence, CTR and position; preserve Sep 1-6 baseline separately.
- If finalized reads remain empty/inconsistent, report HOLD and do not change production.
- Do not start another `/data/*` snippet experiment before that gate.
- While gated, do not duplicate Worker 2's new-vertical research.

**Definition of done:** finalized post-change measurement when available; otherwise concise HOLD with no code churn.

## Worker 2 — current assignment
**Close `/compare/null` quickly, then validate the first non-data revenue vertical.**
- First spend only a bounded effort on `/compare/null`: inspect available Cloudflare user-agent/referrer/request-sequence evidence or attempt deterministic reproduction of crawler misinterpretation. If causality is not reproduced and the site still emits no malformed link/path, report **NO CHANGE** and downgrade it to crawler noise. Do not create redirects/content for `null`.
- Then perform an evidence-backed opportunity validation for a **World Discovery Travel Power / Plug / Voltage utility**. Benchmark current SERPs and at least several distinct user intents such as `plug type [country]`, `do I need an adapter [origin] to [destination]`, `[country] voltage`, and `travel adapter [country]` using Google/Trends/public signals where accessible.
- Verify that a trustworthy, legally usable factual source strategy exists for plug types, nominal voltage and frequency; note conflicts/edge cases rather than fabricating certainty.
- Compare this candidate against at least two adjacent non-data utility candidates (international calling codes/time difference; one destination-planning/reference utility) on demand signal, competition, source quality, build effort, international scalability, page-depth potential and ad suitability.
- If Travel Power clearly wins and the source/licensing path is safe, design the smallest high-quality MVP architecture and test plan. **Do not mass-generate country pages in this run solely because the data is available.** A single hub/tool plus a small evidence-backed pilot set is preferred for first validation.
- Document the recommendation and evidence in this board or a clearly linked repo artifact so the CEO can decide build priority next run.

**Definition of done:** compare-null closed/downgraded or causally fixed; plus a scored recommendation for the first non-data vertical with a bounded MVP proposal and no speculative mass rollout.

## CEO-owned / hold
- PR #198 merged/live; preserve measurement window.
- PR #199/#200/#201 merged and green; localization SEO hardening is closed unless regression evidence appears.
- Internet Use CTR metadata changes held pending index refresh + larger finalized GSC sample.
- Country-aware Population Growth handoff remains the first post-gate data architecture candidate, but it now competes for resources against higher-upside non-data opportunities.
- Travel Power / Plug / Voltage is the first explicit non-data opportunity candidate; validation is delegated to Worker 2 before build approval.
- Generic country-profile metadata rewrite remains held.
- No trend-page scaling without demand evidence.
- No ad-network signup/contract/consent changes.

## Worker results
### Worker 1
- PR #198 merged as `8075216a1497cf6c53b071f8faedecd0bc3f02bd` and live-verified on population-age-0-14, death-rate and unemployment.
- Latest finalized read still has no stable Sep 9+ rows; HOLD remains correct.

### Worker 2
- PR #199 fixed Internet Use build ordering; PR #200 added live regression contract; PR #201 added reciprocal localization release-signal coverage. International-SEO hardening is complete.
- Country-intent diagnosis found the repeated gap is state handoff, not missing indicator links; future Population Growth handoff is implementation-ready and remains paused.
- `/compare/null` tracing found no malformed site link/path; leading hypothesis remains external crawler misinterpretation of valid `history.replaceState(null,...)`. One bounded final causality pass remains before downgrade.
