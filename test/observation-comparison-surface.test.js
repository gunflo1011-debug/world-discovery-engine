import test from 'node:test';
import assert from 'node:assert/strict';
import { buildObservationComparisonSurface } from '../src/observation-comparison-surface.js';

const base = {
  indicator: 'IT.NET.USER.ZS',
  entity: 'DEU',
  period: '2024',
  unit: '% of population',
  methodologyVersion: 'WDI-source-2-v1',
};

test('builds a product-facing comparison while retaining provenance', () => {
  const surface = buildObservationComparisonSurface(
    { ...base, value: 91.2, source: { publisher: 'ITU' } },
    { ...base, value: 92.7, source: { dataset: 'WDI verified refresh' } },
  );

  assert.equal(surface.status, 'COMPARABLE');
  assert.equal(surface.delta, 1.5);
  assert.equal(surface.direction, 'higher');
  assert.equal(surface.left.source, 'ITU');
  assert.equal(surface.right.source, 'WDI verified refresh');
  assert.match(surface.summary, /1\.5 % of population higher/);
  assert.match(surface.trustNote, /Same entity, period, unit and methodology/);
});

test('fails closed instead of rendering a misleading mixed-year delta', () => {
  assert.throws(() => buildObservationComparisonSurface(
    { ...base, value: 91.2, source: 'ITU' },
    { ...base, period: '2023', value: 92.7, source: 'ITU' },
  ), /period-mismatch/);
});

test('fails closed for mixed units', () => {
  assert.throws(() => buildObservationComparisonSurface(
    { ...base, value: 91.2, source: 'ITU' },
    { ...base, unit: 'people', value: 92.7, source: 'ITU' },
  ), /unit-mismatch/);
});

test('requires a usable provenance label for the rendered surface', () => {
  assert.throws(() => buildObservationComparisonSurface(
    { ...base, value: 91.2, source: {} },
    { ...base, value: 92.7, source: 'ITU' },
  ), /unusable-source-label/);
});
