# AI Compliance acquisition economics — Germany 10–100 employees

**Research date:** 2026-08-24  
**Decision:** `CONDITIONAL_GO_7_DAY_SEARCH_FALSIFICATION__HOLD_SCALE`

## Scope and evidence limits

This validation compares exactly three low-touch acquisition channels for a €49/month AI-compliance evidence workflow aimed at German firms with 10–100 employees. It uses public evidence only. No account was created, no billing details were entered, no prospect list was built, and no company was contacted.

Exact German keyword volumes and forecasts are not public evidence: Google Keyword Planner requires an Ads account setup and billing information, and its forecasts vary with bid, budget, quality, location, and recent behavior. Therefore all lead-volume figures below are explicit scenario calculations, not forecasts. [Google Keyword Planner](https://support.google.com/google-ads/answer/7337243/use-keyword-planner)

Competitor prices demonstrate commercial offers, not verified demand or sales. Public examples range from €49/person at EUCompliant to €89/person at Herkules, while KWAIX and IQONEX sell substantially higher-priced packages. [EUCompliant](https://www.eucompliant.ai/), [Herkules](https://ai-act-schulung.de/), [KWAIX](https://kwaix.de/), [IQONEX](https://iqonex.de/de/eu-ai-act-schulung)

Acquisition copy must avoid fear claims. Article 4 is broad and does not itself prescribe a certificate; the product hypothesis is an evidence workflow, not a guarantee of legal compliance. [Heise legal analysis](https://www.heise.de/hintergrund/KI-Kompetenz-Warum-Zertifikate-erforderlich-sind-10306088.html)

## Unit-economics gate

Assumption: 85% contribution margin before human support and fixed costs.

- Monthly contribution per customer: €49 × 85% = **€41.65**
- Maximum CAC for 3-month payback: **€124.95**
- Maximum CAC for 6-month payback: **€249.90**
- Maximum CAC for 12-month payback: **€499.80**
- Human support must remain below about 15 minutes/customer/month at a €35/hour internal cost, otherwise it consumes €8.75/month and materially weakens the model.

The operational decision gate is **CAC ≤ €249.90**, corresponding to six-month contribution payback.

## Exactly three channels

| Channel | Seven-day scenario | Paid-customer scenario | CAC/payback signal | Human effort | Decision |
|---|---|---|---|---|---|
| **1. Google Search Ads** | €150, CPC €2–6 ⇒ 25–75 clicks; click→lead 2–4% ⇒ 0.5–3 leads | Assumed lead→paid 15–25% ⇒ 0.075–0.75 paid customers | Base: CPC €4, 3% lead CVR, 20% close ⇒ €667 media CAC / 16.0 months. At €4 CPC, six-month payback requires 1.6% click→paid; with 3% click→lead that means 53% lead→paid. | 4–6h setup, then 1–2h/week | **Only reversible seven-day candidate; HOLD scale** |
| **2. LinkedIn Lead Gen Ads** | €140, CPC €4–15 ⇒ 9–35 clicks; form CVR 6–10% ⇒ 0.5–3.5 leads | Assumed lead→paid 10–20% ⇒ 0.05–0.7 paid customers | Base: CPC €6, 8% form CVR, 15% close ⇒ about €500 media CAC / 12.0 months | 6–10h setup/creative, then 2–3h/week | **NO-GO for initial test** |
| **3. Organic SEO + ungated checklist/calculator** | Seven days cannot validate ranking or qualified demand on a new/no-authority property | Assumed visitor→lead 5%, lead→paid 20% ⇒ 1% visitor→paid | 12h × €35 = €420 initial time cost. At least 2 customers within six months are needed; that implies about 200 qualified visits in six months under the assumptions. | 8–16h/asset, then 2–4h/month | **Longer-term watch; not a seven-day test** |

### Source quality for channel assumptions

Google allows advertiser-controlled daily budgets, editable at any time. Daily spend can reach twice the average daily budget, while monthly charging is capped at 30.4 times that budget; a seven-day experiment therefore needs a campaign-level stop rule rather than reliance on the nominal daily number alone. [Google Ads budget mechanics](https://support.google.com/google-ads/answer/6385083/about-average-daily-budgets)

The €2–6 Google CPC and 2–4% conversion ranges are directional German agency benchmarks, not platform guarantees. [Ostend Digital 2026 benchmarks](https://ostend.digital/google-ads-budget-planen/)

LinkedIn's official mechanics support low-budget reversibility, with a minimum daily budget starting around $10. However, LinkedIn recommends much larger audiences than the narrow ICP may provide: at least 50,000 for useful results and 300,000 for Sponsored Content, with a platform minimum of 300. EEA consent rules can further reduce matched-audience reach. [LinkedIn budget guidance](https://business.linkedin.com/advertise.html), [LinkedIn audience guidance](https://www.linkedin.com/help/lms/answer/a420820)

The €4–15 LinkedIn CPC and 6–10% Lead Gen form conversion ranges are directional DACH agency benchmarks. These are lead conversions, not paid subscriptions. [Leadanic DACH guide](https://leadanic.com/blog/linkedin-ads-b2b-saas-guide/)

SEO has no media CAC but is not free: editorial labor and ongoing maintenance must be recovered. A publicly available free AI-policy template already competes for the relevant intent, reinforcing that rankings and conversion cannot be assumed. [Example free template](https://ki.fachkraft-jetzt.de/magazin/ki-richtlinie-unternehmen-muster/)

## Seven-day reversible test contract

**Selected channel:** Google Search, solely because it can expose high-intent demand and price acceptance within seven days while remaining capped and reversible. This is a falsification test, not a launch or scale recommendation.

Future execution requires separate owner approval and an Ads account with billing. Nothing was activated during this validation.

- **Maximum media spend:** €150 total.
- **Targeting:** Germany; exact/phrase high-intent terms around AI-policy evidence, Article 4 evidence, and AI training documentation; no automatic broad expansion.
- **Offer:** evidence workflow at **€49/month**, stated before lead submission; no “legally required certificate” or guaranteed-compliance claim.
- **Primary evidence:** ICP-qualified leads that explicitly accept the €49/month price.
- **PASS to a longer controlled test:** at least 3 ICP-qualified leads and at least 1 explicit €49/month price acceptance within the earlier of 7 days or €150.
- **Immediate KILL:** CPC above €6 after 15 clicks, zero qualified leads by €100 spend, or zero price acceptance by €150.
- **Scale gate:** no scaling until observed paid CAC is at most €249.90 and support stays below 15 minutes/customer/month.

Even a PASS would validate only message/price interest. It would not prove retention, legal adequacy, or profitable CAC. The public base case remains unfavorable; the test is justified only as a small information purchase.

## Handoff

The strongest acquisition lever is a **single €150 Google Search falsification test**, but it remains externally gated and unexecuted. LinkedIn is rejected for the first test because its base-case CAC and narrow-audience delivery risk are worse. SEO should wait until paid-intent evidence or existing distribution reduces keyword-volume uncertainty.
