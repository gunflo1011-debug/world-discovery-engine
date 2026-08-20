import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeWorldBankObservation, normalizeWorldBankPayload } from '../src/world-bank-importer.js';

test('normalizes a World Bank API observation with explicit vintage metadata', () => {
  const result = normalizeWorldBankObservation({
    indicator: { id: 'NY.GDP.MKTP.KD.ZG', value: 'GDP growth' },
    country: { id: 'DE', value: 'Germany' },
    date: '2024',
    value: 2.5
  }, {
    vintage: '2025-07-01',
    unit: 'percent',
    methodologyVersion: 'wdi-current'
  });

  assert.equal(result.indicator, 'NY.GDP.MKTP.KD.ZG');
  assert.equal(result.entity, 'DE');
  assert.equal(result.period, '2024');
  assert.equal(result.value, 2.5);
  assert.equal(result.vintage, '2025-07-01');
});

test('drops null-valued rows from a World Bank payload', () => {
  const payload = [{ page: 1 }, [
    { indicator: { id: 'X' }, country: { id: 'DE' }, date: '2024', value: null },
    { indicator: { id: 'X' }, country: { id: 'FR' }, date: '2024', value: 7 }
  ]];
  const rows = normalizeWorldBankPayload(payload, {
    vintage: '2025-01-01', unit: 'index', methodologyVersion: 'v1'
  });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].entity, 'FR');
});

test('fails closed when vintage metadata is absent', () => {
  assert.throws(() => normalizeWorldBankObservation({
    indicator: { id: 'X' }, country: { id: 'DE' }, date: '2024', value: 1
  }, { unit: 'index', methodologyVersion: 'v1' }), /vintage/);
});
