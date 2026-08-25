import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSearchAnalyticsRows, toCsv, PROPERTY, DIMENSIONS } from '../scripts/extract-search-console.mjs';

test('extractor contract is fixed to read-only property dimensions', () => {
  assert.equal(PROPERTY, 'sc-domain:worlddiscoverydata.com');
  assert.deepEqual(DIMENSIONS, ['date', 'page', 'query']);
});

test('normalizes aggregate rows and rejects malformed shapes', () => {
  const rows = normalizeSearchAnalyticsRows({ rows: [
    { keys: ['2026-08-24', 'https://worlddiscoverydata.com/internet-use/', 'internet users'], clicks: 2, impressions: 20, ctr: 0.1, position: 8.4 },
    { keys: ['missing'], clicks: 1, impressions: 1, ctr: 1, position: 1 },
  ]});
  assert.equal(rows.length, 1);
  assert.equal(rows[0].impressions, 20);
});

test('zero-row response stays empty and CSV remains analyzer-compatible', () => {
  assert.deepEqual(normalizeSearchAnalyticsRows({}), []);
  assert.equal(toCsv([]), 'page,query,date,clicks,impressions,ctr,position\n');
});
