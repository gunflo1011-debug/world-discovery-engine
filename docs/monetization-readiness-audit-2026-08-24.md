# World Discovery monetization-readiness audit

Date: 2026-08-24  
Owner: Worker 4  
Scope: bounded, read-only audit. No Search Console implementation, product-code change, ad account, payment setup, outreach, or publication.

## Executive decision

**Verdict: NOT_READY_MEASURE_FIRST.**

World Discovery has a credible, low-cost content asset: 182 official 2024 country profiles, seven region pages, stable human and machine-readable routes, canonical discovery, and explicit provenance. It does **not** yet have commercial evidence. Search impressions, clicks, visits, repeat use, qualified inquiries, revenue, operating cost, and net profit are all unknown.

Do not add advertising, checkout, subscriptions, or a paid API now. The first monetization dependency is 30 days of reliable organic-demand evidence after the separately owned Search Console verification. Until then, any revenue forecast is invented.

## Evidence inspected

### Product strengths

- Evidence-first country and region corpus with official World Bank source metadata.
- Human pages plus JSON/CSV, AI discovery manifest, `llms.txt`, sitemap, canonicals, and mobile release gates.
- Static architecture keeps marginal delivery cost low.
- The World Bank's default dataset license is CC BY 4.0 and permits commercial reuse with attribution and change disclosure, subject to indicator-specific metadata and third-party exceptions.
- Existing source and methodology surfaces make provenance auditable.

### Current commercial gaps

- No measured audience, acquisition baseline, returning-user signal, buyer intent, or inbound lead evidence.
- No monetization CTA, pricing, support commitment, billing, entitlement, rate limiting, or usage metering.
- No operator/imprint and privacy surface was found in the generated site.
- No consent-management layer or `ads.txt` surface was found.
- No custom-domain/hosting decision suitable for a primarily commercial service.
- The checked generated `status` surface describes an earlier, smaller product state and should be reconciled before presenting the site to sponsors or customers. This is an audit finding only; no product code was changed.
- Raw World Bank data is already freely available. A paid offer must sell convenience, derived analysis, workflow integration, freshness guarantees, or support—not mere access to the underlying public records.

## Channel assessment

| Channel | Readiness | Time to first revenue after gates | Automation | Main constraint | Decision |
|---|---|---:|---:|---|---|
| Display ads | Low | 1–4 weeks after approval and traffic | High | No traffic baseline; privacy/CMP/ads.txt/operator requirements; hosting fit | HOLD |
| Direct sponsorship | Low-medium | 1–4 weeks after qualified audience evidence | Medium | No audience profile or sponsor inventory | Best first scalable test after measurement |
| Paid API/bulk export | Low | 4–8+ weeks | High | No demand, billing, auth, SLA, metering; free source data | Do not build |
| Custom research brief/export | Medium conceptually | 1–7 days after a qualified request | Low | Requires buyer intent, scoped delivery and legal/payment setup | Best manual validation if inbound demand appears |
| Affiliate links | Low | Unknown | High | Weak purchase intent and trust dilution | KILL for now |
| Donations | Low | Unknown | High | No loyal-user evidence | Defer |

## Economics without fabricated traffic

Ad revenue must be modeled from observed page RPM, not asserted in advance:

`monthly ad revenue = monthly pageviews / 1,000 × observed page RPM`

Scenario table (sensitivity only, not a forecast):

| Monthly pageviews | €2 RPM | €5 RPM | €10 RPM |
|---:|---:|---:|---:|
| 1,000 | €2 | €5 | €10 |
| 10,000 | €20 | €50 | €100 |
| 50,000 | €100 | €250 | €500 |

Even a strong €10 RPM produces only €100/month at 10,000 pageviews. Adding an ad stack before traffic evidence would therefore create compliance, performance, and maintenance cost before a meaningful revenue case exists.

A single direct sponsor or one paid custom brief can outperform low-volume display ads, but only if the audience is demonstrably relevant. No sponsor price is treated as validated revenue until a buyer accepts it.

## Platform and compliance constraints

1. **Hosting:** GitHub states that Pages is not intended or allowed as free hosting for a site primarily directed at online business, e-commerce, or commercial SaaS. Informational pages can remain during discovery, but a transaction-led or paid-service launch needs an explicit hosting review and likely migration before monetization.
2. **Advertising consent:** Google requires a certified CMP integrated with IAB TCF for personalized ads served in the EEA/UK (since 2024-01-16) and Switzerland (since 2024-07-31). Advertising also introduces privacy and operator-disclosure work.
3. **Advertising operations:** AdSense participation is free, but an accessible root `ads.txt` and site approval/operational setup are separate requirements. No revenue should be assumed before live traffic data.
4. **Data rights:** World Bank-produced datasets are generally CC BY 4.0, including commercial use, with attribution/change disclosure. Every indicator's metadata must still be checked for third-party restrictions, and World Bank endorsement must never be implied.

Sources:

- GitHub Pages limits: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Google certified-CMP requirement: https://support.google.com/adsense/answer/13554020?hl=en-GB
- Google ads.txt guide: https://support.google.com/adsense/answer/7532444?hl=en
- Google AdSense participation cost: https://support.google.com/adsense/answer/32850?hl=en
- World Bank dataset terms: https://www.worldbank.org/ext/en/legal/terms-conditions/datasets
- World Bank license summary: https://datacatalog.worldbank.org/public-licenses

## Smallest reversible test

### Gate 0 — measure, do not monetize

After the separately owned Search Console verification is complete, observe one uninterrupted 30-day window. Record:

- total organic clicks and impressions;
- top 20 queries and pages;
- country/region landing-page share;
- explicitly commercial or workflow-intent queries;
- qualified inbound requests, if any;
- actual hosting and maintenance cost.

No ads, account creation, payment integration, cold outreach, or new commercial product during this window.

### Gate 1 — choose exactly one test

Use these internal decision thresholds:

- **Fewer than 500 organic clicks in 30 days and zero qualified requests:** no monetization build; continue discovery or kill the commercial thesis.
- **At least 500 organic clicks with repeated buyer/workflow intent, or at least three qualified inbound requests:** validate one manual offer before software—one custom, source-cited country/region export or brief at a fixed pilot price of **€49**.
- **At least 5,000 organic clicks in 30 days with a concentrated professional audience:** prepare one direct-sponsor inventory and seek evidence from no more than three relevant, non-spam warm prospects.
- **Paid API:** only after at least three independent prospects request recurring machine access and at least two accept a written price indication. Build nothing before that.
- **Display ads:** only after compliant hosting/operator/privacy/CMP readiness and enough traffic that a conservative observed-RPM scenario can cover the incremental monthly cost by at least 3×.

The thresholds are portfolio kill rules, not market facts.

### Pilot acceptance and kill criteria

For the €49 manual brief/export pilot:

- GO only after one paid, non-refunded order from an independent buyer.
- Delivery must take no more than two hours and use only license-cleared, attributed data.
- Require at least €25 contribution after payment fees and direct labor valued at €10/hour.
- KILL after 30 days with no paid order, any licensing ambiguity, delivery above two hours, or a refund/quality failure that makes expected contribution negative.
- Do not automate until three paid deliveries show the same repeatable need.

## Recommended sequence

1. Finish only the separately owned Search Console verification; preserve product-code ownership boundaries.
2. Collect 30 days of search evidence.
3. Apply Gate 1 once.
4. If manual demand validates, obtain operator/legal/payment approval and run one €49 pilot.
5. Only after repeated paid demand decide between sponsorship, a paid convenience API, or display ads.
6. Before any primarily commercial launch, move transactions and sensitive operations off GitHub Pages and complete privacy/operator/consent controls.

## Economic contribution of this audit

This audit prevents premature ad, billing, and API work while preserving the lowest-cost path to revenue evidence. It converts an unbounded “monetize the traffic” idea into one 30-day measurement gate and one €49 manual pilot with explicit contribution and kill rules. Current expected revenue and net profit remain **UNKNOWN**; that is the correct fail-closed conclusion.
