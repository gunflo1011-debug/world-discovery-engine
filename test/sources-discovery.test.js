import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const pageUrl = new URL('../site/sources/index.html', import.meta.url);
const baseUrl = process.env.SITE_BASE_URL || 'https://worlddiscoverydata.com/';

test('sources page reflects all published products and exposes machine discovery entry points', async () => {
  const html = await readFile(pageUrl, 'utf8');

  assert.match(html, new RegExp(`<link rel="canonical" href="${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}sources/">`));
  assert.match(html, /<title>Sources, provenance & machine access — World Discovery Data<\/title>/);
  assert.match(html, /REAL population-revision evidence/);
  assert.match(html, /CURRENT_VERIFIED Internet Use observations/);
  assert.match(html, /CURRENT_VERIFIED GDP per capita observations/);
  assert.match(html, /NY\.GDP\.PCAP\.CD/);
  assert.match(html, /Real-GDP revision publishing remains blocked/);

  assert.doesNotMatch(html, /visible evidence examples are still labelled DEMO/i);
  assert.doesNotMatch(html, /Real evidence is only promoted after two compatible source vintages/i);

  for (const href of [
    '../evidence/index.json',
    '../ai-index.json',
    '../llms.txt',
    '../indicators/internet-use/data.json',
    '../indicators/internet-use/data.csv',
    '../indicators/internet-use/country/index.json',
    '../indicators/gdp-per-capita/data.json',
    '../indicators/gdp-per-capita/'
  ]) {
    assert.match(html, new RegExp(`href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
  }

  // The site-wide shell intentionally uses the human-facing Data label instead of
  // exposing the implementation-oriented Indicators registry as a primary nav item.
  assert.match(html, /href="\.\.\/data\/">Data<\/a>/);
  assert.match(html, /"@type":"WebPage"/);
  assert.match(html, /World Development Indicators/);
  assert.match(html, /<div class="table-wrap" tabindex="0" aria-label="Archive comparison requirements"><table class="table">/);
});
