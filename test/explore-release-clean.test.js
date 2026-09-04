import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const pageUrl = new URL('../site/explore/index.html', import.meta.url);

test('Explore uses current branding, architecture and trust routes', async () => {
  const html = await readFile(pageUrl, 'utf8');
  assert.match(html, /<title>Explore world data — World Discovery<\/title>/);
  assert.match(html, /href="\.\.\/data\/"/);
  assert.match(html, /href="\.\.\/countries\/"/);
  assert.match(html, /href="\.\.\/compare\/"/);
  assert.match(html, /href="\.\.\/methodology\/"/);
  assert.match(html, /href="\.\.\/sources\/"/);
  assert.match(html, /href="\.\.\/status\/"/);
  assert.doesNotMatch(html, /World Discovery Engine|\.\.\/indicators\/index\.html|\.\.\/indicators\/gdp-per-capita\/index\.html/);
});
