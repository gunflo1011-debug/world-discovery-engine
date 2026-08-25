import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { compareEntities } from '../src/cross-entity-comparison.js';

const data = JSON.parse(await readFile(new URL('../site/indicators/internet-use/data.json', import.meta.url), 'utf8'));

function observation(record) {
  return {
    indicator: data.indicator.code,
    entity: record.code,
    period: record.year,
    unit: data.indicator.unit,
    methodologyVersion: data.source.metadataUrl,
    source: `${data.source.publisher} — ${data.source.dataset} via ${data.source.surface}`,
    value: record.value
  };
}

test('Germany and France are compatible real 2024 snapshot observations', () => {
  const germany = data.records.find((record) => record.code === 'DEU');
  const france = data.records.find((record) => record.code === 'FRA');
  assert.ok(germany);
  assert.ok(france);
  const comparison = compareEntities(observation(germany), observation(france));
  assert.equal(comparison.indicator, 'IT.NET.USER.ZS');
  assert.equal(comparison.period, 2024);
  assert.equal(comparison.unit, '% of population');
  assert.equal(comparison.left.entity, 'DEU');
  assert.equal(comparison.right.entity, 'FRA');
  assert.equal(comparison.delta, france.value - germany.value);
  assert.match(comparison.left.source, /International Telecommunication Union/);
});

test('cross-country comparison fails closed when year compatibility is lost', () => {
  const germany = data.records.find((record) => record.code === 'DEU');
  const france = data.records.find((record) => record.code === 'FRA');
  assert.throws(
    () => compareEntities(observation(germany), { ...observation(france), period: 2023 }),
    /period-mismatch/
  );
});
