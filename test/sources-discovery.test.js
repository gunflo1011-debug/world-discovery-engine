import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const pageUrl = new URL('../site/sources/index.html', import.meta.url);
const baseUrl = process.env.SITE_BASE_URL || 'https://worlddiscoverydata.com/';

test('sources page reflects production evidence and exposes machine discovery entry points', async () => {
  const html = await readFile(pageUrl, 'utf8');

  assert.match(html, new RegExp(`<link rel="canonical" href="${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}sources/">`));
  assert.match(html, /<title>Sources, provenance & machine access — World Discovery Engine<\/title>/);
  assert.match(html, /verified REAL population-revision evidence is published/);
  assert.match(html, /CURRENT_VERIFIED same-year observations/);
  assert.match(html, /Real-GDP revision publishing remains blocked/);

  assert.doesNotMatch(html, /visible evidence examples are still labelled DEMO/i);
  assert.doesNotMatch(html, /Real evidence is only promoted after two compatible source vintages/i);

  for (const href of [
    '../evidence/index.json',
    '../ai-index.json',
    '../llms.txt',
    '../indicators/internet-use/data.json',
    '../indicators/internet-use/data.csv',
    '../indicators/internet-use/country/index.json'
  ]) {
    assert.match(html, new RegExp(`href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
  }

  assert.match(html, /href="\.\.\/indicators\/index\.html">Indicators<\/a>/);
  assert.match(html, /"@type":"WebPage"/);
  assert.match(html, /World Development Indicators/);
  assert.match(
    html,
    /<div class="table-wrap" tabindex="0" aria-label="Archive comparison requirements"><table class="table">/
  );
});
