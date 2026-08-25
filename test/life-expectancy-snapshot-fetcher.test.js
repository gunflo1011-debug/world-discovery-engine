import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../scripts/fetch-life-expectancy-snapshot.mjs', import.meta.url), 'utf8');

test('life expectancy snapshot fetcher is pinned to the intended WDI indicator', () => {
  assert.match(source, /SP\.DYN\.LE00\.IN/);
  assert.match(source, /World Bank World Development Indicators/);
  assert.match(source, /unit: 'years'/);
});

test('life expectancy snapshot fetcher fails closed on weak evidence', () => {
  assert.match(source, /rows\.length < 100/);
  assert.match(source, /row\.value != null/);
  assert.match(source, /Number\.isFinite\(value\)/);
  assert.match(source, /Number\.isInteger\(year\)/);
  assert.doesNotMatch(source, /\?\?\s*0/);
});

test('snapshot keeps observation year separate from retrieval time and provenance', () => {
  assert.match(source, /year,/);
  assert.match(source, /retrievedAt:/);
  assert.match(source, /sourceUrl:/);
  assert.match(source, /methodologyUrl:/);
  assert.match(source, /CURRENT_VERIFIED/);
});
