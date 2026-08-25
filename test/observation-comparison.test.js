import test from 'node:test';
import assert from 'node:assert/strict';
import { compareObservations } from '../src/observation-comparison.js';

const base = {
  indicator: 'IT.NET.USER.ZS',
  entity: 'DEU',
  period: '2023',
  unit: 'percent',
  methodologyVersion: 'wdi-v1',
  source: 'World Bank WDI',
  value: 92.48,
};

test('compares a tiny supported fixture while preserving provenance', () => {
  const result = compareObservations(base, { ...base, source: 'World Bank WDI archive', value: 93.1 });
  assert.equal(result.delta, 0.6199999999999903);
  assert.equal(result.unit, 'percent');
  assert.equal(result.period, '2023');
  assert.equal(result.left.source, 'World Bank WDI');
  assert.equal(result.right.source, 'World Bank WDI archive');
});

test('rejects year, unit or methodology mismatches through the comparability gate', () => {
  assert.throws(() => compareObservations(base, { ...base, period: '2022' }), /period-mismatch/);
  assert.throws(() => compareObservations(base, { ...base, unit: 'ratio' }), /unit-mismatch/);
  assert.throws(() => compareObservations(base, { ...base, methodologyVersion: 'wdi-v2' }), /methodology-mismatch/);
});

test('rejects missing provenance and non-numeric values', () => {
  assert.throws(() => compareObservations(base, { ...base, source: '' }), /missing-source/);
  assert.throws(() => compareObservations(base, { ...base, value: 'not-a-number' }), /invalid-value/);
});
