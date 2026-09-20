import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const slugs = ['gdp-per-capita', 'internet-use', 'population'];

async function history(slug) {
  return JSON.parse(await readFile(new URL(`../site/data/wdi/${slug}/history.json`, import.meta.url), 'utf8'));
}

function recordMap(data) {
  return new Map(data.records.map((r) => [`${r.code}:${r.year}`, r.value]));
}

function codesForYear(data, year) {
  return new Set(data.records.filter((r) => r.year === year && Number.isFinite(Number(r.value)) && r.code).map((r) => r.code));
}

function intersection(sets) {
  const [first, ...rest] = sets;
  return new Set([...first].filter((code) => rest.every((set) => set.has(code))));
}

test('Explorer historical assets are verified real WDI observations', async () => {
  const datasets = await Promise.all(slugs.map(history));
  for (const data of datasets) {
    assert.equal(data.status, 'VERIFIED_HISTORY');
    assert.match(data.coverage.note, /no backfill/i);
    assert.ok(data.records.length > 0);
  }
});

test('default Explorer trio has non-empty exact-year intersections', async () => {
  const datasets = await Promise.all(slugs.map(history));
  for (const year of [2010, 2015, 2017]) {
    const common = intersection(datasets.map((data) => codesForYear(data, year)));
    assert.ok(common.size > 0, `expected a non-empty GDP/Internet/Population intersection for ${year}`);
    assert.ok(common.has('ABW'), `expected Aruba in the exact-year intersection for ${year}`);
  }
});

test('concrete country/year values remain exact and unbackfilled', async () => {
  const [gdp, internet, population] = (await Promise.all(slugs.map(history))).map(recordMap);
  const expected = [
    [2010, 24093.1401510626, 62, 101838],
    [2015, 27458.2201537506, 88.661226932496, 107906],
    [2017, 28440.0416881491, 97.17, 108735],
  ];
  for (const [year, gdpValue, internetValue, populationValue] of expected) {
    assert.equal(gdp.get(`ABW:${year}`), gdpValue);
    assert.equal(internet.get(`ABW:${year}`), internetValue);
    assert.equal(population.get(`ABW:${year}`), populationValue);
  }
});
