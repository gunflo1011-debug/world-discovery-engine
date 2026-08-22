import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const mainBuilder = new URL('../scripts/build-internet-use.mjs', import.meta.url);
const countryBuilder = new URL('../scripts/build-internet-use-countries.mjs', import.meta.url);
const dataUrl = new URL('../site/indicators/internet-use/data.json', import.meta.url);
const parentUrl = new URL('../site/indicators/internet-use/index.html', import.meta.url);
const indexUrl = new URL('../site/indicators/internet-use/country/index.json', import.meta.url);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('internet-use country builder creates source-faithful long-tail discovery pages', async () => {
  await execFileAsync(process.execPath, [mainBuilder.pathname]);
  await execFileAsync(process.execPath, [countryBuilder.pathname]);

  const [rawData, parentHtml, rawIndex] = await Promise.all([
    readFile(dataUrl, 'utf8'),
    readFile(parentUrl, 'utf8'),
    readFile(indexUrl, 'utf8')
  ]);
  const data = JSON.parse(rawData);
  const index = JSON.parse(rawIndex);

  assert.equal(index.schemaVersion, '1.0');
  assert.equal(index.indicator, 'IT.NET.USER.ZS');
  assert.equal(index.observationYear, data.observationYear);
  assert.equal(index.countries.length, data.records.length);

  for (const record of data.records) {
    const slug = record.code.toLowerCase();
    const html = await readFile(new URL(`../site/indicators/internet-use/country/${slug}/index.html`, import.meta.url), 'utf8');
    const indexed = index.countries.find((item) => item.code === record.code);

    assert.ok(indexed, `missing country index record for ${record.code}`);
    assert.equal(indexed.value, record.value);
    assert.equal(indexed.url, `/indicators/internet-use/country/${slug}/`);
    assert.match(parentHtml, new RegExp(`href="\\./country/${slug}/">${escapeRegex(record.country)}<`));
    assert.match(html, new RegExp(`<h1>${escapeRegex(record.country)} internet use rate: ${record.value}%</h1>`));
    assert.match(html, new RegExp(`${record.value}% of people in ${escapeRegex(record.country)} used the internet in ${record.year}`));
    assert.match(html, new RegExp(`rel="canonical" href="https://gunflo1011-debug\\.github\\.io/world-discovery-engine/indicators/internet-use/country/${slug}/"`));
    assert.match(html, /"@type":"WebPage"/);
    assert.match(html, /"@type":"PropertyValue"/);
    assert.match(html, /"propertyID":"IT\.NET\.USER\.ZS"/);
    assert.match(html, new RegExp(`"identifier":"${record.code}"`));
    assert.match(html, /World Bank indicator page →/);
    assert.match(html, /WDI metadata →/);
    assert.match(html, /Full JSON →/);
    assert.match(html, /Full CSV →/);
    assert.match(html, /not claim a historical WDI revision/i);
    assert.match(html, /not to a complete worldwide ranking/i);
  }
});
