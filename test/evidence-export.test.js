import test from 'node:test';
import assert from 'node:assert/strict';
import { evidenceJson, evidenceCsv } from '../src/evidence-export.js';

const evidence = {
  indicator: { id: 'NY.GDP.MKTP.KD.ZG', name: 'GDP growth' },
  entity: { id: 'DEU', name: 'Germany' },
  period: '2024',
  firstPublished: { value: 2, vintage: '2025-01-01' },
  latestPublished: { value: 1.5, vintage: '2026-01-01' },
  revision: { absolute: -0.5, percentage: -25, direction: 'down' },
  events: [{ fromVintage: '2025-01-01', toVintage: '2026-01-01', fromValue: 2, toValue: 1.5, absoluteRevision: -0.5, percentageRevision: -25 }],
  provenance: { source: 'World Bank', sourceUrl: 'https://data.worldbank.org', vintages: ['2025-01-01','2026-01-01'] }
};

test('JSON export is stable and machine readable', () => {
  const parsed = JSON.parse(evidenceJson(evidence));
  assert.equal(parsed.schemaVersion, 1);
  assert.equal(parsed.type, 'revision-evidence');
  assert.equal(parsed.revision.percentage, -25);
});

test('CSV export contains provenance-ready revision rows', () => {
  const csv = evidenceCsv(evidence);
  assert.match(csv, /entity_id,entity_name,indicator_id/);
  assert.match(csv, /DEU,Germany,NY.GDP.MKTP.KD.ZG,GDP growth,2024/);
  assert.match(csv, /2025-01-01,2026-01-01,2,1.5,-0.5,-25/);
});
