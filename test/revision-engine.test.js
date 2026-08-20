import test from 'node:test';
import assert from 'node:assert/strict';
import { compareObservations, buildRevisionHistory } from '../src/revision-engine.js';

const base = {
  indicator: 'NY.GDP.MKTP.KD.ZG', entity: 'DEU', period: 2024,
  unit: 'percent', methodologyVersion: 'wdi-compatible-v1'
};

test('computes comparable revision deterministically', () => {
  const result = compareObservations(
    { ...base, vintage: '2025-01', value: 2.0 },
    { ...base, vintage: '2025-07', value: 1.5 }
  );
  assert.equal(result.comparable, true);
  assert.equal(result.absoluteRevision, -0.5);
  assert.equal(result.percentageRevision, -25);
  assert.equal(result.direction, 'down');
});

test('fails closed when methodology changes', () => {
  const result = compareObservations(
    { ...base, vintage: '2025-01', value: 2.0 },
    { ...base, vintage: '2025-07', value: 1.5, methodologyVersion: 'changed-definition' }
  );
  assert.deepEqual(result, { comparable: false, reason: 'methodology_mismatch' });
});

test('history excludes unchanged observations', () => {
  const events = buildRevisionHistory([
    { ...base, vintage: '2025-01', value: 2 },
    { ...base, vintage: '2025-03', value: 2 },
    { ...base, vintage: '2025-07', value: 1.8 }
  ]);
  assert.equal(events.length, 1);
  assert.equal(events[0].absoluteRevision, -0.2);
});
