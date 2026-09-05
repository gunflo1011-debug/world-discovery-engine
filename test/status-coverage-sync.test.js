import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const pages = [
  'status/index.html',
  'de/status/index.html',
  'es/status/index.html',
  'fr/status/index.html',
  'zh-hans/status/index.html'
];

const readJson = async (path) => JSON.parse(await readFile(new URL(path, siteRoot), 'utf8'));
const catalog = await readJson('data/wdi/index.json');
const countries = await readJson('countries/index.json');
const expectedIndicators = (catalog.indicators ?? []).filter((item) => item.status === 'CURRENT_VERIFIED').length;
const expectedCountries = (countries.countries ?? []).length;

test('status pages use generated coverage counts in every published locale', async () => {
  assert.ok(expectedIndicators > 0);
  assert.ok(expectedCountries > 0);

  for (const path of pages) {
    const html = await readFile(new URL(path, siteRoot), 'utf8');
    const values = [...html.matchAll(/<article class="fact">[\s\S]*?<div class="value">([^<]+)<\/div>[\s\S]*?<\/article>/g)]
      .map((match) => match[1].trim());

    assert.ok(values.length >= 2, `${path} should expose at least two status facts`);
    assert.equal(values[0], String(expectedIndicators), `${path} indicator count should match the generated catalog`);
    assert.equal(values[1], String(expectedCountries), `${path} country count should match the generated directory`);
  }
});
