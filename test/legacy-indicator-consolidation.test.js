import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = resolve(process.cwd());

function runConsolidation() {
  execFileSync(process.execPath, ['scripts/consolidate-legacy-indicators.mjs'], {
    cwd: root,
    stdio: 'pipe',
  });
}

test('overlapping legacy GDP indicator pages defer indexing to current /data/ pages', async () => {
  runConsolidation();

  const cases = [
    ['gdp', 'https://worlddiscoverydata.com/data/gdp/'],
    ['gdp-per-capita', 'https://worlddiscoverydata.com/data/gdp-per-capita/'],
  ];

  for (const [slug, canonical] of cases) {
    const html = await readFile(resolve(root, 'site', 'indicators', slug, 'index.html'), 'utf8');
    assert.match(html, /<meta name="robots" content="noindex,follow">/);
    assert.ok(html.includes(`<link rel="canonical" href="${canonical}">`));
    assert.match(html, /data-legacy-indicator-notice/);
  }

  const sitemap = await readFile(resolve(root, 'site', 'sitemap.xml'), 'utf8');
  assert.ok(!sitemap.includes('https://worlddiscoverydata.com/indicators/gdp/'));
  assert.ok(!sitemap.includes('https://worlddiscoverydata.com/indicators/gdp-per-capita/'));
  assert.ok(sitemap.includes('https://worlddiscoverydata.com/data/gdp/'));
  assert.ok(sitemap.includes('https://worlddiscoverydata.com/data/gdp-per-capita/'));
});
