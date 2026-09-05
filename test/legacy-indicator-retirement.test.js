import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const retiredRoutes = [
  { path: '../site/indicators/index.html', current: '../data/', canonical: 'https://worlddiscoverydata.com/data/' },
  { path: '../site/indicators/gdp/index.html', current: '../../data/gdp/', canonical: 'https://worlddiscoverydata.com/data/gdp/' },
  { path: '../site/indicators/gdp-per-capita/index.html', current: '../../data/gdp-per-capita/', canonical: 'https://worlddiscoverydata.com/data/gdp-per-capita/' },
];

test('retired legacy indicator landings show only a clean retirement surface', async () => {
  for (const route of retiredRoutes) {
    const html = await readFile(new URL(route.path, import.meta.url), 'utf8');
    assert.match(html, /<meta name="robots" content="noindex,follow">/, `${route.path} must remain noindex/follow`);
    assert.match(html, /data-legacy-indicator-notice/, `${route.path} must explain the retained URL`);
    assert.match(html, /This indicator page has moved\./, `${route.path} must not present itself as a current product page`);
    assert.ok(html.includes(`href="${route.current}"`), `${route.path} must link to its maintained data surface`);
    assert.doesNotMatch(html, /Three indicator products are now published/i, `${route.path} must not expose the stale three-product registry`);
    assert.doesNotMatch(html, /World Discovery Engine|World Discovery Data/, `${route.path} must not expose legacy branding`);
    assert.ok(html.includes(`<link rel="canonical" href="${route.canonical}">`), `${route.path} must canonicalize to maintained data`);
  }
});

test('internet-use legacy URL preserves its maintained comparison while deferring indexing to /data/', async () => {
  const html = await readFile(new URL('../site/indicators/internet-use/index.html', import.meta.url), 'utf8');
  assert.match(html, /<meta name="robots" content="noindex,follow">/);
  assert.ok(html.includes('<link rel="canonical" href="https://worlddiscoverydata.com/data/internet-use/">'));
  assert.match(html, /Internet use by country/i);
  assert.match(html, /182 verified non-aggregate countries/i);
  assert.match(html, /JSON|CSV/);
  assert.doesNotMatch(html, /data-legacy-indicator-notice|This indicator page has moved\./);
  assert.doesNotMatch(html, /World Discovery Engine|World Discovery Data/);
});

test('real GDP keeps its fail-closed methodology screening until a maintained replacement exists', async () => {
  const html = await readFile(new URL('../site/indicators/real-gdp/index.html', import.meta.url), 'utf8');
  assert.match(html, /NY\.GDP\.MKTP\.KD/);
  assert.match(html, /SCREENING · FAIL CLOSED/);
  assert.match(html, /no revision values(?: or rankings)? are published/i);
  assert.match(html, /<meta name="robots" content="noindex,follow">/);
  assert.doesNotMatch(html, /World Discovery Engine|World Discovery Data/);
});
