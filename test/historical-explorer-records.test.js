import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const explorerUrl = new URL('../site/explore/history.js', import.meta.url);
const explorerHtmlUrl = new URL('../site/explore/history.html', import.meta.url);
const ingestUrl = new URL('../scripts/ingest-wdi-history-catalog.mjs', import.meta.url);
const historyIndexUrl = new URL('../site/data/wdi/history-index.json', import.meta.url);

test('historical explorer consumes the records array emitted by the WDI history ingest', async () => {
  const [explorer, ingest] = await Promise.all([
    readFile(explorerUrl, 'utf8'),
    readFile(ingestUrl, 'utf8')
  ]);

  assert.doesNotThrow(() => new Function(explorer), 'historical explorer JavaScript must parse');
  assert.match(ingest, /\brecords\};const dir=/, 'history ingest must publish records');
  assert.match(explorer, /Array\.isArray\(payload\.records\)\)return payload\.records/, 'explorer must read the published records array');
  assert.match(explorer, /setCountries\(countries,requested\)/, 'country picker must be populated from historical rows');
  assert.match(explorer, /countries and other geographic entities/, 'coverage wording must disclose non-country geographic entities');
  assert.doesNotMatch(explorer, /\$\{meta\.countries\} countries,/, 'coverage count must not describe every WDI entity as a country');
});

test('historical explorer controls stay compact instead of stretching to the tallest grid item', async () => {
  const html = await readFile(explorerHtmlUrl, 'utf8');
  assert.match(html, /\.controls\{[^}]*align-items:start/);
  assert.match(html, /\.controls label\{[^}]*align-self:start/);
  assert.match(html, /\.controls select,\.controls input\{[^}]*min-height:44px/);
  assert.match(html, /\.country-picker\{[^}]*align-self:start/);
  assert.match(html, /#compare\{[^}]*min-height:44px/);
});

test('historical explorer uses current production branding and maintained navigation', async () => {
  const html = await readFile(explorerHtmlUrl, 'utf8');
  assert.match(html, /<title>Compare countries over time — World Discovery<\/title>/);
  assert.match(html, /<div class="brand">World Discovery<\/div>/);
  assert.match(html, /href="\.\.\/data\/index\.html">Data<\/a>/);
  assert.match(html, /href="\.\.\/countries\/index\.html">Countries<\/a>/);
  assert.match(html, /href="\.\.\/compare\/index\.html">Compare<\/a>/);
  assert.doesNotMatch(html, /World Discovery Engine/);
  assert.doesNotMatch(html, /href="\.\.\/indicators\/index\.html">Indicators<\/a>/);
});

test('published historical data can populate a real country picker', async () => {
  const index = JSON.parse(await readFile(historyIndexUrl, 'utf8'));
  const population = index.indicators.find(indicator => indicator.slug === 'population');

  assert.ok(population, 'population history must be present in the history index');
  assert.equal(population.status, 'VERIFIED_HISTORY');
  assert.ok(population.observations > 0, 'population history must advertise observations');

  const historyUrl = new URL(`../site${population.dataUrl}`, import.meta.url);
  const payload = JSON.parse(await readFile(historyUrl, 'utf8'));
  const rows = Array.isArray(payload) ? payload : payload.records;

  assert.ok(Array.isArray(rows), 'published history payload must contain records');
  assert.ok(rows.length > 0, 'published history payload must not be empty');

  const countries = new Map();
  for (const row of rows) {
    const name = row.countryName || row.country?.name || row.country || row.name || row.entity || row.location;
    const code = row.countryCode || row.country?.id || row.iso3 || row.code || name;
    if (name && code && !countries.has(code)) countries.set(code, name);
  }

  assert.ok(countries.size > 0, 'historical rows must yield selectable countries');
  assert.equal(countries.get('DEU'), 'Germany', 'Germany should be selectable from published history data');
  assert.equal(countries.get('USA'), 'United States', 'United States should be selectable from published history data');
});
