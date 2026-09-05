import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const routes = [
  { path: '../site/indicators/index.html', current: '../data/', canonical: 'https://worlddiscoverydata.com/data/' },
  { path: '../site/indicators/gdp/index.html', current: '../../data/gdp/', canonical: 'https://worlddiscoverydata.com/data/gdp/' },
  { path: '../site/indicators/gdp-per-capita/index.html', current: '../../data/gdp-per-capita/', canonical: 'https://worlddiscoverydata.com/data/gdp-per-capita/' },
  { path: '../site/indicators/internet-use/index.html', current: '../../data/internet-use/', canonical: 'https://worlddiscoverydata.com/data/internet-use/' },
  { path: '../site/indicators/real-gdp/index.html', current: '../../data/', canonical: null },
];

test('legacy indicator landings show only a clean retirement surface', async () => {
  for (const route of routes) {
    const html = await readFile(new URL(route.path, import.meta.url), 'utf8');
    assert.match(html, /<meta name="robots" content="noindex,follow">/, `${route.path} must remain noindex/follow`);
    assert.match(html, /data-legacy-indicator-notice/, `${route.path} must explain the retained URL`);
    assert.match(html, /This indicator page has moved\./, `${route.path} must not present itself as a current product page`);
    assert.ok(html.includes(`href="${route.current}"`), `${route.path} must link to its maintained data surface`);
    assert.doesNotMatch(html, /Three indicator products are now published/i, `${route.path} must not expose the stale three-product registry`);
    assert.doesNotMatch(html, /World Discovery Engine|World Discovery Data/, `${route.path} must not expose legacy branding`);
    if (route.canonical) assert.ok(html.includes(`<link rel="canonical" href="${route.canonical}">`), `${route.path} must canonicalize to maintained data`);
  }
});
