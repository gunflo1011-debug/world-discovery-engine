import test from 'node:test';
import assert from 'node:assert/strict';
import { createReleaseManifest, contextFromManifest } from '../src/release-manifest.js';

test('creates immutable release provenance', () => {
  const manifest = createReleaseManifest({
    vintage: '2024-12-16',
    sourceUrl: 'https://databank.worldbank.org/',
    retrievedAt: '2026-08-21T03:00:00Z',
    methodologyVersion: 'validated-series-definition-v1',
    unit: 'percent',
  });
  assert.equal(manifest.vintage, '2024-12-16');
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(contextFromManifest(manifest).unit, 'percent');
});

test('refuses comparison context when methodology is not validated', () => {
  const manifest = createReleaseManifest({
    vintage: '2024-12-16',
    sourceUrl: 'https://databank.worldbank.org/',
    retrievedAt: '2026-08-21T03:00:00Z',
    unit: 'percent',
  });
  assert.throws(() => contextFromManifest(manifest), /methodologyVersion/);
});

test('refuses malformed vintage dates', () => {
  assert.throws(() => createReleaseManifest({ vintage: 'Dec 2024', sourceUrl: 'x', retrievedAt: 'now' }), /YYYY-MM-DD/);
});
