import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);

test('global search trends hub is indexable, linked and machine-readable', async () => {
  const [html, explore, snapshot] = await Promise.all([
    readFile(new URL('trends/index.html', siteRoot), 'utf8'),
    readFile(new URL('explore/index.html', siteRoot), 'utf8'),
    readFile(new URL('data/trends/latest.json', siteRoot), 'utf8')
  ]);
  const data = JSON.parse(snapshot);

  assert.match(html, /<link rel="canonical" href="https:\/\/worlddiscoverydata\.com\/trends\/">/);
  assert.match(html, /index,follow/);
  assert.match(html, /data\/trends\/latest\.json/);
  assert.match(explore, /href="\.\.\/trends\/"/);
  assert.equal(data.status, 'CURATED_GOOGLE_TRENDS_SNAPSHOT');
  assert.equal(data.snapshotDate, '2026-09-06');
  assert.equal(data.trends.length, 5);
  assert.ok(data.trends.every((trend) => trend.query && trend.market && trend.searchVolumeBucket && trend.sourceUrl));
});

test('generated sitemap enrichment keeps the trends route', async () => {
  const script = await readFile(new URL('../scripts/add-wdi-pages-to-sitemap.mjs', import.meta.url), 'utf8');
  assert.match(script, /['"]\/trends\/['"]/);
});
