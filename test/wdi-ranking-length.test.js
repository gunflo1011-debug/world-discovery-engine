import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const populationPage = new URL('../site/data/population/index.html', import.meta.url);

test('long WDI rankings stay complete without making the whole page excessively tall', async () => {
  const html = await readFile(populationPage, 'utf8');
  const rows = html.match(/<tr>/g) ?? [];

  assert.ok(rows.length > 200, `expected complete population ranking, found only ${rows.length} table rows`);
  assert.match(html, /class="ranking-table-wrap"/);
  assert.match(html, /\.ranking-table-wrap\{max-height:44rem;overflow:auto/);
  assert.match(html, /The complete ranking stays on this page; scroll inside the table to browse all observations\./);
  assert.doesNotMatch(html, /<div style="overflow-x:auto"><table>/);
});
