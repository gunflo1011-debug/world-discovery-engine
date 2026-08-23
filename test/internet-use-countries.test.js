import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const mainBuilder = new URL('../scripts/build-internet-use.mjs', import.meta.url);
const countryBuilder = new URL('../scripts/build-internet-use-countries.mjs', import.meta.url);
const dataUrl = new URL('../site/indicators/internet-use/data.json', import.meta.url);
const parentUrl = new URL('../site/indicators/internet-use/index.html', import.meta.url);
const indexUrl = new URL('../site/indicators/internet-use/country/index.json', import.meta.url);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('internet-use country builder creates source-faithful long-tail discovery pages and country JSON', async () => {
  await execFileAsync(process.execPath, [mainBuilder.pathname]);
  await execFileAsync(process.execPath, [countryBuilder.pathname]);

  const [rawData, parentHtml, rawIndex] = await Promise.all([
    readFile(dataUrl, 'utf8'),
    readFile(parentUrl, 'utf8'),
    readFile(indexUrl, 'utf8')
  ]);
  const data = JSON.parse(rawData);
  const index = JSON.parse(rawIndex);

  assert.equal(index.schemaVersion, '1.2');
  assert.equal(index.status, 'CURRENT_VERIFIED');
  assert.equal(index.indicator, 'IT.NET.USER.ZS');
  assert.equal(index.observationYear, data.observationYear);
  assert.equal(index.countries.length, data.records.length);
  assert.equal(index.provenance.publisher, data.source.publisher);
  assert.equal(index.provenance.metadataUrl, data.source.metadataUrl);
  assert.equal(index.provenance.retrievalUrl, data.retrievalUrl);
  assert.equal(index.provenance.license, data.source.license);

  for (const record of data.records) {
    const slug = record.code.toLowerCase();
    const htmlUrl = new URL(`../site/indicators/internet-use/country/${slug}/index.html`, import.meta.url);
    const machineUrl = new URL(`../site/indicators/internet-use/country/${slug}/data.json`, import.meta.url);
    const [html, rawMachine] = await Promise.all([
      readFile(htmlUrl, 'utf8'),
      readFile(machineUrl, 'utf8')
    ]);
    const machine = JSON.parse(rawMachine);
    const indexed = index.countries.find((item) => item.code === record.code);

    assert.ok(indexed, `missing country index record for ${record.code}`);
    assert.equal(indexed.value, record.value);
    assert.deepEqual(indexed.region, record.region);
    assert.equal(indexed.url, `/indicators/internet-use/country/${slug}/`);
    assert.equal(indexed.machineDataUrl, `/indicators/internet-use/country/${slug}/data.json`);

    assert.equal(machine.schemaVersion, '1.1');
    assert.equal(machine.status, 'CURRENT_VERIFIED');
    assert.equal(machine.indicator.code, 'IT.NET.USER.ZS');
    assert.equal(machine.entity.type, 'country');
    assert.equal(machine.entity.code, record.code);
    assert.equal(machine.entity.name, record.country);
    assert.deepEqual(machine.entity.region, record.region);
    assert.equal(machine.observation.year, record.year);
    assert.equal(machine.observation.value, record.value);
    assert.equal(machine.provenance.publisher, data.source.publisher);
    assert.equal(machine.provenance.metadataUrl, data.source.metadataUrl);
    assert.equal(machine.provenance.retrievalUrl, data.retrievalUrl);
    assert.equal(machine.provenance.retrievedAt, data.retrievedAt);
    assert.equal(machine.provenance.license, data.source.license);
    assert.equal(machine.scope.completeGlobalRanking, false);
    assert.equal(machine.scope.historicalRevisionProduct, false);
    assert.equal(machine.humanUrl, `https://gunflo1011-debug.github.io/world-discovery-engine/indicators/internet-use/country/${slug}/`);

    assert.match(parentHtml, new RegExp(`href="\\./country/${slug}/">${escapeRegex(record.country)}<`));
    assert.match(html, new RegExp(`<h1>${escapeRegex(record.country)} internet use rate: ${record.value}%</h1>`));
    assert.match(html, new RegExp(`${record.value}% of people in ${escapeRegex(record.country)} used the internet in ${record.year}`));
    assert.match(html, new RegExp(`Among the ${data.records.length} countries currently included in this verified same-year dataset`));
    assert.match(html, /countries currently included in this verified same-year dataset, not to a complete worldwide ranking/i);
    assert.match(html, /reports the 2024 observation from the same validated same-year dataset/i);
    assert.doesNotMatch(html, /verified launch slice/i);
    assert.doesNotMatch(html, /current\/latest observation/i);
    assert.match(html, new RegExp(`rel="canonical" href="https://gunflo1011-debug\\.github\\.io/world-discovery-engine/indicators/internet-use/country/${slug}/"`));
    assert.match(html, /rel="alternate" type="application\/json" href="\.\/data\.json"/);
    assert.match(html, /"@type":"WebPage"/);
    assert.match(html, /"@type":"PropertyValue"/);
    assert.match(html, /"propertyID":"IT\.NET\.USER\.ZS"/);
    assert.match(html, new RegExp(`"identifier":"${record.code}"`));
    assert.match(html, /World Bank indicator page →/);
    assert.match(html, /WDI metadata →/);
    assert.match(html, /Country JSON →/);
    assert.match(html, /Full JSON →/);
    assert.match(html, /Full CSV →/);
    assert.match(html, /not claim a historical WDI revision/i);
    assert.match(html, /not to a complete worldwide ranking/i);
  }

  const invalid = structuredClone(data);
  delete invalid.records[0].region;
  try {
    await writeFile(dataUrl, `${JSON.stringify(invalid, null, 2)}\n`, 'utf8');
    await assert.rejects(
      execFileAsync(process.execPath, [countryBuilder.pathname]),
      /country records require official region code and name/
    );
  } finally {
    await writeFile(dataUrl, rawData, 'utf8');
  }
});
