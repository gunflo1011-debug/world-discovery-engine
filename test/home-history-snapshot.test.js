import test from 'node:test';
import assert from 'node:assert/strict';
import { snapshotFromHistoryIndex, updateHomepageHtml } from '../scripts/sync-home-history-snapshot.mjs';

const index = {
  generatedAt: '2026-09-05T02:28:13.218Z',
  fromYear: 2000,
  toYear: 2025,
  indicators: [
    { slug: 'population', observations: 5642 },
    { slug: 'gdp', observations: 5428 }
  ]
};

test('homepage snapshot derives observation count and freshness from history index', () => {
  const en = snapshotFromHistoryIndex(index, 'en-US');
  assert.equal(en.indicators, 2);
  assert.equal(en.rawObservations, 11070);
  assert.equal(en.observations, '11,070');
  assert.equal(en.fromYear, 2000);
  assert.equal(en.toYear, 2025);
  assert.match(en.date, /Sep 5, 2026/);

  const de = snapshotFromHistoryIndex(index, 'de-DE');
  assert.equal(de.observations, '11.070');
  assert.match(de.date, /05\.09\.2026|5\. Sept\. 2026/);
});

test('homepage snapshot rejects malformed catalog counts instead of publishing a guessed total', () => {
  assert.throws(
    () => snapshotFromHistoryIndex({ ...index, indicators: [{ slug: 'population', observations: -1 }] }),
    /invalid observation count/
  );
});

test('homepage observation fact becomes exact, sourced and idempotent', () => {
  const html = '<section><div class="facts"><div class="fact"><div class="value">30</div><div class="label">verified indicators</div></div><div class="fact"><div class="value">153k+</div><div class="label">country-year observations</div></div><div class="fact"><div class="value">2000–2025</div><div class="label">historical coverage window</div></div></div><p class="home-cta"><a href="./data/">Browse</a></p></section>';
  const once = updateHomepageHtml(html, { count: '11,070', note: 'Derived from the current WDI history catalog. Catalog snapshot: Sep 5, 2026.' });
  assert.match(once, /<div class="value">11,070<\/div><div class="label">country-year observations<\/div>/);
  assert.match(once, /data-wd-history-snapshot/);
  assert.doesNotMatch(once, /153k\+/);

  const twice = updateHomepageHtml(once, { count: '11,070', note: 'Derived from the current WDI history catalog. Catalog snapshot: Sep 5, 2026.' });
  assert.equal(twice, once);
  assert.equal((twice.match(/data-wd-history-snapshot/g) || []).length, 1);
});
