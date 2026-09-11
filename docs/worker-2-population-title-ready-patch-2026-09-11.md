# Worker 2 — Population title experiment ready patch

Status: **PREPARED / DO NOT DEPLOY until CEO gate closes**

Target: `/data/population/` only. Preserve H1, content, meta description, canonical, structured data and all localized titles.

## Minimal code change

In `scripts/optimize-wdi-search-snippets.mjs`, add exactly this English experiment override beside the existing GDP per capita / Inflation / Population Growth overrides:

```diff
     'population-growth': {
       title: (_name, year) => `Population Growth Rate by Country (${year} Ranking) | World Discovery`,
     },
+    population: {
+      title: (_name, year) => `Population by Country (${year} Ranking) | World Discovery`,
+    },
```

## Regression test to add at launch

Create `test/population-search-title-experiment.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const snippetScriptUrl = new URL('../scripts/optimize-wdi-search-snippets.mjs', import.meta.url);

test('population CTR experiment is an English title-only override', async () => {
  const source = await readFile(snippetScriptUrl, 'utf8');
  assert.match(
    source,
    /population:\s*\{\s*title:\s*\(_name, year\)\s*=>\s*`Population by Country \(\$\{year\} Ranking\) \| World Discovery`,\s*\}/s,
  );
});
```

## Launch checklist

1. Confirm CEO has closed at least one currently active CTR gate and explicitly released Population from HOLD.
2. Apply only the override + regression test above.
3. Run the repository's full check/CI; require green evidence.
4. Verify generated `/data/population/` title is exactly `Population by Country (2025 Ranking) | World Discovery` for the current dataset year.
5. Verify H1, meta description and canonical are unchanged.
6. Record an exact launch boundary in `docs/agent-board.md`.
7. Evaluate only finalized post-boundary Search Console rows. Gate defined by CEO: >=100 impressions; promising only if CTR >0 and weighted position does not worsen by >1.5 vs ~8.22 baseline; revert/iterate if CTR remains 0 after >=100 impressions or weighted position worsens by >1.5 with >=50 impressions.

This document is intentionally non-executable so preparation cannot accidentally launch the fourth CTR experiment.
