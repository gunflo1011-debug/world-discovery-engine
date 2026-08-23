import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const parentBuilder = new URL('../scripts/build-internet-use.mjs', import.meta.url);
const countryBuilder = new URL('../scripts/build-internet-use-countries.mjs', import.meta.url);
const csvBuilder = new URL('../scripts/enrich-internet-use-country-csv.mjs', import.meta.url);
const sourceUrl = new URL('../site/indicators/internet-use/data.json', import.meta.url);
const registryUrl = new URL('../site/indicators/internet-use/country/index.json', import.meta.url);

function parseCsvLine(line) {
  const cells = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      cells.push(cell);
      cell = '';
    } else {
      cell += char;
    }
  }
  cells.push(cell);
  return cells;
}

test('internet-use country profiles expose matching country-level CSV evidence', async () => {
  await execFileAsync(process.execPath, [parentBuilder.pathname]);
  await execFileAsync(process.execPath, [countryBuilder.pathname]);
  await execFileAsync(process.execPath, [csvBuilder.pathname]);

  const data = JSON.parse(await readFile(sourceUrl, 'utf8'));
  const registry = JSON.parse(await readFile(registryUrl, 'utf8'));
  assert.equal(registry.schemaVersion, '1.2');
  assert.equal(registry.countries.length, data.records.length);

  for (const record of data.records) {
    const slug = record.code.toLowerCase();
    const html = await readFile(new URL(`../site/indicators/internet-use/country/${slug}/index.html`, import.meta.url), 'utf8');
    const csv = await readFile(new URL(`../site/indicators/internet-use/country/${slug}/data.csv`, import.meta.url), 'utf8');
    const lines = csv.trim().split('\n');
    assert.equal(lines.length, 2);
    const header = parseCsvLine(lines[0]);
    const values = parseCsvLine(lines[1]);
    const row = Object.fromEntries(header.map((key, index) => [key, values[index]]));

    assert.equal(row.entity_code, record.code);
    assert.equal(row.entity_name, record.country);
    assert.equal(row.indicator_code, 'IT.NET.USER.ZS');
    assert.equal(Number(row.reference_year), record.year);
    assert.equal(Number(row.value), record.value);
    assert.equal(row.publisher, data.source.publisher);
    assert.equal(row.dataset, data.source.dataset);
    assert.equal(row.retrieval_url, data.retrievalUrl);
    assert.equal(row.retrieved_at, data.retrievedAt);
    assert.equal(row.license, data.source.license);

    assert.match(html, /rel="alternate" type="text\/csv" href="\.\/data\.csv"/);
    assert.match(html, /href="\.\/data\.csv">Country CSV →<\/a>/);

    const indexed = registry.countries.find((item) => item.code === record.code);
    assert.ok(indexed, `missing registry record for ${record.code}`);
    assert.equal(indexed.machineCsvUrl, `/indicators/internet-use/country/${slug}/data.csv`);
  }
});
