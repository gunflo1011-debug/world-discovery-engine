import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const explorerUrl = new URL('../site/explore/history.js', import.meta.url);
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
