import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRevisionEvidence } from '../src/evidence-builder.js';

const base = {
  indicator: 'NY.GDP.MKTP.KD.ZG',
  indicatorName: 'GDP growth (annual %)',
  entity: 'DEU',
  entityName: 'Germany',
  period: '2024',
  unit: 'percent',
  methodologyVersion: 'wdi-current-definition',
  source: 'world-bank',
  sourceUrl: 'https://data.worldbank.org/'
};

test('builds deterministic evidence from multiple vintages', () => {
  const evidence = buildRevisionEvidence([
    { ...base, vintage: '2025-01-01', value: 2.0 },
    { ...base, vintage: '2025-06-01', value: 1.8 },
    { ...base, vintage: '2026-01-01', value: 1.5 }
  ]);

  assert.equal(evidence.id, 'NY.GDP.MKTP.KD.ZG:DEU:2024');
  assert.equal(evidence.firstPublished.value, 2.0);
  assert.equal(evidence.latestPublished.value, 1.5);
  assert.equal(evidence.revision.absolute, -0.5);
  assert.equal(evidence.revision.percentage, -25);
  assert.equal(evidence.revision.direction, 'down');
  assert.equal(evidence.revision.eventCount, 2);
  assert.deepEqual(evidence.provenance.vintages, ['2025-01-01', '2025-06-01', '2026-01-01']);
});

test('rejects mixed observation sets', () => {
  assert.throws(() => buildRevisionEvidence([
    { ...base, vintage: '2025-01-01', value: 2.0 },
    { ...base, entity: 'FRA', vintage: '2026-01-01', value: 1.5 }
  ]), /Mixed entities/);
});
