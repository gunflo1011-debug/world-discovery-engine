import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { WDI_COUNTRY_GROUPS } from '../scripts/wdi-country-groups.mjs';

const catalog = JSON.parse(await readFile(new URL('../site/data/wdi/index.json', import.meta.url), 'utf8'));
const current = (catalog.indicators ?? []).filter(x => x.status === 'CURRENT_VERIFIED').map(x => x.slug).sort();
const assigned = WDI_COUNTRY_GROUPS.flatMap(([, slugs]) => slugs);

test('every current WDI indicator belongs to exactly one visible country topic', () => {
  const counts = new Map();
  for (const slug of assigned) counts.set(slug, (counts.get(slug) ?? 0) + 1);
  assert.deepEqual([...counts.entries()].filter(([, n]) => n !== 1), []);
  assert.deepEqual([...new Set(assigned)].sort(), current);
});

test('representative formerly-collapsed indicators have the intended visible topic', () => {
  const topic = slug => WDI_COUNTRY_GROUPS.find(([, slugs]) => slugs.includes(slug))?.[0];
  assert.equal(topic('population-age-0-14'), 'People');
  assert.equal(topic('death-rate'), 'Health');
  assert.equal(topic('health-expenditure-share-of-gdp'), 'Health');
  assert.equal(topic('gdp'), 'Economy & work');
  assert.equal(topic('trade-share-of-gdp'), 'Economy & work');
  assert.equal(topic('forest-area-share'), 'Energy & environment');
  assert.equal(topic('agricultural-land-share'), 'Energy & environment');
});
