import test from 'node:test';
import assert from 'node:assert/strict';
import { compareEntities } from '../src/cross-entity-comparison.js';

const base = {
  indicator: 'IT.NET.USER.ZS',
  period: '2024',
  unit: '% of population',
  methodologyVersion: 'wdi-current',
  source: 'World Development Indicators',
};

test('compares different countries only within the same trusted snapshot', () => {
  const result = compareEntities(
    { ...base, entity: 'DEU', value: '93.5' },
    { ...base, entity: 'FRA', value: '92.1' },
  );
  assert.equal(result.left.entity, 'DEU');
  assert.equal(result.right.entity, 'FRA');
  assert.equal(result.delta, -1.4);
  assert.equal(result.period, '2024');
});

test('rejects year mismatch', () => {
  assert.throws(() => compareEntities(
    { ...base, entity: 'DEU', value: 93.5 },
    { ...base, entity: 'FRA', period: '2023', value: 91 },
  ), /period-mismatch/);
});

test('rejects unit and methodology mismatch', () => {
  assert.throws(() => compareEntities(
    { ...base, entity: 'DEU', value: 93.5 },
    { ...base, entity: 'FRA', unit: 'people', methodologyVersion: 'other', value: 92.1 },
  ), /unit-mismatch.*methodology-mismatch/);
});

test('rejects missing provenance', () => {
  assert.throws(() => compareEntities(
    { ...base, entity: 'DEU', value: 93.5 },
    { ...base, entity: 'FRA', source: '', value: 92.1 },
  ), /missing-source/);
});

test('keeps revision and cross-entity semantics separate', () => {
  assert.throws(() => compareEntities(
    { ...base, entity: 'DEU', value: 93.5 },
    { ...base, entity: 'DEU', value: 94 },
  ), /same-entity/);
});
