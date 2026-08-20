import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeWdiArchiveRows, selectComparableSeries } from '../src/wdi-archive-adapter.js';

test('normalizes wide WDI archive rows into vintage observations', () => {
  const rows = [{
    'Country Name': 'Germany',
    'Country Code': 'DEU',
    'Indicator Name': 'GDP growth (annual %)',
    'Indicator Code': 'NY.GDP.MKTP.KD.ZG',
    '2022': '1.4',
    '2023': '-0.3',
    '2024': '..'
  }];
  const result = normalizeWdiArchiveRows(rows, {
    vintage: '2025-01-15',
    unit: 'percent',
    methodologyVersion: 'wdi-current-definition',
    sourceUrl: 'https://databank.worldbank.org/source/world-development-indicators'
  });
  assert.equal(result.length, 2);
  assert.deepEqual(result.map(({ entity, period, value, vintage }) => ({ entity, period, value, vintage })), [
    { entity: 'DEU', period: '2022', value: 1.4, vintage: '2025-01-15' },
    { entity: 'DEU', period: '2023', value: -0.3, vintage: '2025-01-15' }
  ]);
});

test('requires an explicit release vintage', () => {
  assert.throws(() => normalizeWdiArchiveRows([], { unit: 'percent', methodologyVersion: 'x' }), /vintage/i);
});

test('selects and sorts one comparable series across releases', () => {
  const observations = [
    { indicator: 'X', entity: 'DEU', period: '2023', vintage: '2025-01-01', value: 2 },
    { indicator: 'X', entity: 'DEU', period: '2023', vintage: '2024-01-01', value: 3 },
    { indicator: 'X', entity: 'FRA', period: '2023', vintage: '2024-01-01', value: 4 }
  ];
  assert.deepEqual(selectComparableSeries(observations, { indicator: 'X', entity: 'DEU', period: 2023 }).map(o => o.value), [3, 2]);
});
