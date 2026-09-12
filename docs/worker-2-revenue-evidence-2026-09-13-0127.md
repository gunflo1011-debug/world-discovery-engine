# Worker 2 revenue evidence — 2026-09-13 01:27 Europe/Berlin

## CEO assignment
Measure Renewable and rank next revenue opportunities without deploying changes. Preserve finalized/fresh separation; do not attribute CTR movement until public Google SERP adoption/rewrite is independently confirmed. Continue Internet-Use cohort research only on repeated multi-day non-Madagascar Page-1 volume.

## Repository state
- Start `main`: `ccd315b5647a25d241f993f6bd35652719e0a201` (`CEO: refresh 01:00 revenue evidence and worker priorities`).
- Open PR: #208 `Prepare current English country indicator taxonomy`; remains draft/non-production per CEO board.
- No production change made in this run.

## Renewable measurement
Fresh Search Console read at 2026-09-13 01:28 Europe/Berlin (`include_fresh_data=true`):
- English Sep10: 15 impressions / 0 clicks / position 2.2667.
- English Sep11: 23 / 0 / 2.7391.
- No English Sep12 row.
- French Sep11: 2 / 0 / 6.0 (excluded from English experiment).
- Simplified-Chinese Sep12: 1 / 0 / 8.0 (excluded from English experiment).

Finalized-only read still returns only English Sep10 = 15 / 0 / 2.2667. Therefore Sep11 remains fresh/preliminary and there is still no English Sep12+ measurement cohort.

A fresh public web search for the exact new title and the old technical title did not surface a World Discovery result. This does not prove deindexing and does not satisfy the CEO's public-SERP-adoption gate. Attribution remains closed.

## Internet-Use country cohort — material new evidence
Fresh Search Console now exposes a much broader Sep11 non-Madagascar Page-1 zero-click cohort than the previous small Andorra/Solomon-Islands/Mexico sample. Examples:
- Andorra: 16 impressions / 0 clicks / position 4.5625.
- Japan: 14 / 0 / 5.9286.
- France: 12 / 0 / 7.25.
- Slovenia: 10 / 0 / 3.8.
- Mexico: 9 / 0 / 7.6667.
- Venezuela: 9 / 0 / 8.0.
- Germany: 8 / 0 / 6.0.
- Georgia: 8 / 0 / 8.125.
- Solomon Islands: 8 / 0 / 5.375.
- Finland: 7 / 0 / 4.1429.
- Slovakia: 7 / 0 / 2.7143.
- Belgium: 6 / 0 / 2.1667.
- Saint Kitts and Nevis: 6 / 0 / 4.6667.
- New Zealand: 6 / 0 / 4.3333.

Fresh Sep12 is partial but already repeats several countries, including Mexico 2 / 0 / 7.5, Andorra 1 / 0 / 2.0, Belgium 1 / 0 / 3.0, Germany 1 / 0 / 1.0, Finland 1 / 0 / 3.0, Japan 1 / 0 / 9.0, and Saint Vincent and the Grenadines 2 / 0 / 4.0.

Madagascar itself still does not repeat after its Sep10 202-impression spike, so it remains an anomaly. However, the *template-level* research signal is now materially stronger: many independent country pages are receiving Page-1 impressions with zero clicks on the same day, and several repeat into partial Sep12. This is stronger evidence for a future scalable template-level CTR/intent investigation than the previous three-country sample.

## Recommendation to CEO
- Renewable remains the only live title experiment. HOLD any new title/snippet deployment until both CEO gates are met: public Google adoption/rewrite + English Sep12+ GSC data.
- Upgrade Internet-Use country cohort from `small repeated signal` to `broad fresh Page-1 zero-click cohort; research priority`, but **do not deploy a template change yet** because Sep11/12 are fresh and query intent has not been characterized.
- Next Worker 2 research step should be query-level intent analysis for the highest-volume repeated country pages (Andorra, Japan, France, Slovenia, Mexico, Solomon Islands) once data stabilizes, looking for a common mismatch that can justify one controlled template experiment.
- Population Growth remains the next single-page controlled candidate after Renewable becomes interpretable, per CEO strategy.

## Safety / reversibility
No production generator, title, canonical, sitemap, data, DNS, permission, billing, or external-state changes were made.