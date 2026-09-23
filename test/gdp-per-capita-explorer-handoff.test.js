import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const page = new URL('../site/data/gdp-per-capita/index.html', import.meta.url);

test('GDP per capita has one contextual handoff to the World Data Explorer', async () => {
  const html = await readFile(page, 'utf8');
  assert.match(html, /class="section section-explorer-handoff"/);
  assert.match(html, /Compare GDP per capita with another indicator/);
  assert.match(html, /href="\.\.\/\.\.\/explore\/"/);
  assert.match(html, /Open the World Data Explorer →/);
  assert.equal((html.match(/section-explorer-handoff/g) ?? []).length, 1);
});
