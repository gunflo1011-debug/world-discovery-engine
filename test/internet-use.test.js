import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const htmlPath = new URL('../site/indicators/internet-use/index.html', import.meta.url);
const jsonPath = new URL('../site/indicators/internet-use/data.json', import.meta.url);
const csvPath = new URL('../site/indicators/internet-use/data.csv', import.meta.url);

function parseCsv(text) {
  const [header, ...rows] = text.trim().split(/\r?\n/);
  const fields = header.split(',');
  return rows.map((line) => {
    const values = line.split(',');
    return Object.fromEntries(fields.map((field, index) => [field, values[index]]));
  });
}

test('internet-use vertical keeps a single observation year and matching JSON/CSV identity', async () => {
  const [html, rawJson, rawCsv] = await Promise.all([
    readFile(htmlPath, 'utf8'),
    readFile(jsonPath, 'utf8'),
    readFile(csvPath, 'utf8')
  ]);
  const data = JSON.parse(rawJson);
  const csv = parseCsv(rawCsv);

  assert.equal(data.status, 'CURRENT_VERIFIED');
  assert.equal(data.indicator.code, 'IT.NET.USER.ZS');
  assert.equal(data.indicator.unit, '% of population');
  assert.equal(data.observationYear, 2024);
  assert.equal(data.records.length, 12);
  assert.ok(data.records.every((record) => record.year === 2024));
  assert.equal(csv.length, data.records.length);

  for (const record of data.records) {
    const row = csv.find((item) => item.country_code === record.code);
    assert.ok(row, `missing CSV row for ${record.code}`);
    assert.equal(row.indicator_code, data.indicator.code);
    assert.equal(Number(row.value), record.value);
    assert.equal(Number(row.observation_year), record.year);
    assert.match(html, new RegExp(`>${record.country.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<`));
    assert.match(html, new RegExp(`>${record.value}%<`));
  }

  assert.match(html, /rel="canonical" href="https:\/\/gunflo1011-debug\.github\.io\/world-discovery-engine\/indicators\/internet-use\/"/);
  assert.match(html, /href="\.\/data\.json"/);
  assert.match(html, /href="\.\/data\.csv"/);
  assert.match(html, /International Telecommunication Union \(ITU\)/);
  assert.match(html, /not a complete global ranking/i);
  assert.doesNotMatch(html, /revision-ready|archive-to-archive delta/i);
});
