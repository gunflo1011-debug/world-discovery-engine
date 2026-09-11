import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const snippetScriptUrl = new URL('../scripts/optimize-wdi-search-snippets.mjs', import.meta.url);

test('population CTR experiment is prepared as an English title-only override', async () => {
  const source = await readFile(snippetScriptUrl, 'utf8');

  assert.match(
    source,
    /population:\s*\{\s*title:\s*\(_name, year\)\s*=>\s*`Population by Country \(\$\{year\} Ranking\) \| World Discovery`,\s*\}/s,
    'Population should use the CEO-approved title-only search experiment override',
  );
});
