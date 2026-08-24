# World Discovery — Monetization Readiness

_Last reviewed: 2026-08-24_

## Decision

**WAIT_FOR_TRAFFIC / PREPARE DATA-PRODUCT SIGNALS, NOT BILLING.**

Do not activate ads, affiliate links, paid plans, account signups, contracts or payment infrastructure yet. World Discovery has no verified traffic, conversion or willingness-to-pay evidence in the company control file. The current highest-value action is to preserve user trust and define objective triggers that tell the CEO when a monetization path is worth activating.

## Current user jobs and commercial-intent fit

World Discovery's product thesis is evidence-driven public-data discovery: reproducible country/region answers, official-source provenance, revision/vintage intelligence, and machine-readable JSON/CSV output. The current audience is therefore more naturally aligned with research, analysis, citation and data reuse than with shopping or travel booking.

Commercial-intent segments that could emerge later:

1. **Analyst/researcher/data-engineer reuse** — exports, API access, revision histories, bulk retrieval, reproducible provenance.
2. **High-volume reference readership** — informational sessions where unobtrusive display ads could monetize scale.
3. **Travel/connectivity intent on specific country pages** — only if search/query evidence shows users are actually arriving with connectivity/travel intent; not assumed from country-page existence alone.

## Model comparison

| Path | Public market evidence | Fit with current product | Time to revenue | Margin / automation | Traffic threshold / dependency | Main risk | Decision |
|---|---|---:|---:|---:|---:|---|---|
| **Paid data/export/API** | Trading Economics currently charges about **$199/month** for a Standard API plan and **$399/month** Professional, proving that economic-data/API access can support recurring B2B pricing. | **High** — World Discovery already emphasizes reproducible evidence, vintage/revision intelligence and JSON/CSV outputs. | Medium | High once self-service | Requires evidence that users actually reuse/export data or request machine access | Free official-source alternatives mean the paid value must be revision/provenance/workflow convenience, not raw WDI values | **PREPARE SIGNALS / WAIT FOR DEMAND** |
| **Display ads (AdSense)** | Google AdSense allows eligible sites with original, policy-compliant content; Google does not state a traffic minimum in its public eligibility criteria. | Medium | Low technically, but economic value depends on sessions | High automation, low operational load | Strongly traffic-dependent | Premature ads can reduce trust/UX before meaningful audience scale exists | **WAIT_FOR_TRAFFIC** |
| **Affiliate/referral (eSIM example)** | Airalo currently advertises a standard **10% commission** on verified referred sales and explicitly accepts comparison sites/apps with travel audiences. | Low-to-medium today | Fast once relevant traffic exists | High | Requires commercial travel/connectivity intent, not just country-information traffic | Weak relevance can damage neutrality and produce negligible conversion | **WAIT_FOR INTENT EVIDENCE** |
| **Sponsorship / lead-gen** | Plausible for niche data/reference audiences, but no current World Discovery traffic or buyer evidence supports pricing. | Medium later | Medium-high | Medium; often sales-led | Needs demonstrable audience quality and reach | Human sales effort conflicts with low-touch objective | **KILL FOR NOW** |

## Why paid data/API is the strongest eventual path

The site's differentiator is not raw current World Bank data. Raw public data is widely available for free. The potential paid product is instead **workflow compression around revision intelligence**: stable vintage comparisons, change histories, reproducible provenance, bulk export, machine retrieval, and possibly alerts when published values materially revise.

That positioning aligns with the existing repository architecture and can be delivered with low marginal cost once the underlying evidence base is broad enough. It also avoids contaminating early user trust with irrelevant commerce.

## Objective activation triggers

No paid feature should be built merely because a competitor charges money. Activate a monetization experiment only when one of these signals appears in real usage or inbound demand.

### Trigger A — paid data/export/API test

Move from `WAIT_FOR_TRAFFIC` to `PREPARE PAID DATA TEST` when **at least one** of the following is observed and recorded:

- repeated organic queries or landing sessions with explicit API/export/download/revision-history intent;
- repeated use of machine-readable JSON/CSV endpoints once first-party measurement exists;
- at least **3 independent inbound requests** for bulk export, API access, vintage history, alerts, or a reusable dataset;
- at least **2 organizations or professional users** independently asking for the same machine-readable/revision workflow.

Then test a small self-service paid tier or paid pilot around revision/provenance workflow value. Do **not** paywall raw public facts that are already freely available from official sources.

### Trigger B — display ads

Only reconsider display ads after traffic is large enough that a modest RPM would produce economically material monthly revenue relative to the site's maintenance cost. Before enabling ads, the CEO must have real session/pageview geography and estimate revenue using current network economics; no arbitrary traffic threshold is asserted here.

### Trigger C — affiliate

Only test an affiliate placement if Search Console or first-party behavior proves a meaningful query cluster with purchase-adjacent intent (for example, country connectivity/travel preparation) and the affiliate genuinely improves that page's user job. A country page alone is not sufficient evidence.

## Safe readiness work already justified

- Preserve stable canonical URLs and machine-readable outputs.
- Keep provenance/licensing metadata explicit so any future paid convenience layer does not misrepresent ownership of public-source data.
- Ensure future measurement can distinguish page family, export/API actions and outbound commercial clicks without introducing third-party tracking before consent/privacy review.
- Treat revision/vintage intelligence, bulk convenience and alerts as the monetizable layer; keep core public facts accessible and trustworthy.

## Kill criteria

- **Paid data/API:** kill or defer if real users primarily consume one-off public facts and do not show repeated export/API/revision intent.
- **Ads:** defer if expected revenue is immaterial or UX/trust impact outweighs expected contribution.
- **Affiliate:** kill if commercial-intent queries do not emerge or outbound conversion cannot be measured transparently.
- **Sponsorship:** keep killed until audience scale/quality can support low-touch inbound sponsorship rather than founder-led sales.

## Public evidence reviewed

- Google AdSense eligibility: https://support.google.com/adsense/answer/9724
- Airalo affiliate program: https://www.airalo.com/de/m/resources/airalo-affiliate-program
- Trading Economics API pricing: https://tradingeconomics.com/api/pricing.aspx

## CEO handoff

**Recommended portfolio action:** keep World Discovery monetization in `WAIT_FOR_TRAFFIC`, but bias product/measurement architecture toward detecting data-reuse and revision-intelligence intent. The first monetization experiment should be **paid data/export/API convenience**, not ads or affiliate, if and only if the trigger evidence above appears.
