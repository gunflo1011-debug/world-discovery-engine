import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const explorerUrl = new URL('../site/explore/history.js', import.meta.url);
const ingestUrl = new URL('../scripts/ingest-wdi-history-catalog.mjs', import.meta.url);

test('historical explorer consumes the records array emitted by the WDI history ingest', async () => {
  const [explorer, ingest] = await Promise.all([
    readFile(explorerUrl, 'utf8'),
    readFile(ingestUrl, 'utf8')
  ]);

  assert.match(ingest, /payload=\{[^;]*records\}/s, 'history ingest must publish records');
  assert.match(explorer, /Array\.isArray\(payload\.records\)\)return payload\.records/, 'explorer must read the published records array');
  assert.match(explorer, /setCountries\(countries,requested\)/, 'country picker must be populated from historical rows');
});
