# Worker 1 — country-code snippet test plan

Date: 2026-09-13
Status: REVIEW-ONLY / HOLD — no production implementation, PR, merge or deployment

## CEO assignment
Prepare the smallest localized country-code snippet experiment that can be released only after the CEO/Worker-2 country-code gate is met. Preserve attribution for the currently live Renewable and Internet Use experiments.

## Current implementation surface
`scripts/build-localized-country-hubs.mjs` constructs localized country meta descriptions with:

```js
const description=`${displayCountry}: ${s.indicators(hub.metrics.length)} ${s.official}.`;
```

and emits it only into:

```html
<meta name="description" content="...">
```

The same template already renders `${hub.code}` in the visible hero eyebrow immediately before the H1, so no additional body-level ISO3 label is justified.

## Smallest proposed intervention after release gate
Language: Spanish only.

Pilot cohort: a fixed allowlist containing PRK plus at most one second Spanish ISO3 code that independently meets the CEO gate. As of this plan, PRK is the only recurring Spanish code and the experiment is therefore NOT release-ready.

Do not infer or dynamically expand the cohort. The implementation should use an explicit immutable allowlist, conceptually:

```js
const ISO3_DESCRIPTION_PILOT = {
  es: new Set(['PRK', '<SECOND_GATED_CODE>'])
};
```

For allowlisted Spanish pilot pages only, append a short localized phrase to the existing description:

```text
Código ISO3: PRK.
```

Example intended output:

```html
<meta name="description" content="Corea del Norte: 30 indicadores oficiales disponibles. Datos oficiales del Banco Mundial. Código ISO3: PRK.">
```

Do not change title, H1, canonical, hreflang, sitemap membership, hero eyebrow, body copy, topic grouping, indicator rows, values, units or observation years.

## Release gate
Do not implement until the CEO explicitly releases the test after Worker 2 shows either:

1. recurrence on >=2 days for >=2 distinct ISO3 codes in one language; or
2. materially broader disclosed volume across >=5 codes at roughly positions 4–20.

Current evidence does not satisfy the first path because only PRK has multi-day recurrence. Therefore this plan remains HOLD.

## Required deterministic pre/post assertions
Build the same source snapshot before and after the candidate patch and compare generated output.

For every generated country page:

- `<title>` byte-equivalent before/after.
- `<h1>` byte-equivalent before/after.
- canonical href byte-equivalent before/after.
- complete hreflang set byte-/set-equivalent before/after after the normal hreflang enrichment stage.
- sitemap membership identical before/after.
- visible hero eyebrow identical before/after, including existing ISO3 code.
- indicator rows identical before/after: slug/link, displayed metric name, value, unit and observation year.
- body HTML outside the intended meta-description attribute identical before/after.

For meta descriptions:

- exactly the fixed allowlisted Spanish pilot URLs may differ;
- each allowed diff must consist only of appending the expected localized `Código ISO3: <CODE>.` phrase;
- every non-pilot country meta description must be byte-identical before/after;
- no non-Spanish description may change.

Repository gates:

- full build passes;
- internal-link audit passes;
- existing tests pass;
- no new orphan URLs;
- no unexpected generated-file diff outside the intended pilot meta descriptions.

## Attribution / rollback
This is a meta-description-only experiment. Do not combine it with a title, H1, body, taxonomy or URL change. Record exact deployment timestamp and fixed pilot cohort if released. Rollback is deletion of the fixed allowlist/append logic, restoring the prior descriptions exactly.

## Explicit non-goals
- No sitewide ISO3 rollout.
- No duplicate body ISO3 label.
- No country title rewrite.
- No `/compare/null` work; current evidence associates the recurring malformed localized paths with automated/external traffic and no internal producer is reproduced.
- No change to PR #208; it remains draft/non-production.
