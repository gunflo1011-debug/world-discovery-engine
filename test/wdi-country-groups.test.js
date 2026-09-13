import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { WDI_COUNTRY_GROUPS } from '../scripts/wdi-country-groups.mjs';

const catalog = JSON.parse(await readFile(new URL('../site/data/wdi/index.json', import.meta.url), 'utf8'));
const currentIndicators = (catalog.indicators ?? []).filter(x => x.status === 'CURRENT_VERIFIED');
const current = currentIndicators.map(x => x.slug).sort();
const assigned = WDI_COUNTRY_GROUPS.flatMap(([, slugs]) => slugs);

const LEGACY_GROUPS = [
  ['People', ['population','population-growth','urban-population','urban-population-share','population-density','fertility-rate','age-dependency-ratio','life-expectancy']],
  ['Economy & work', ['gdp-current-usd','gdp-per-capita','gdp-growth','inflation','unemployment','employment-to-population','labor-force-participation','exports','imports']],
  ['Health', ['life-expectancy','health-expenditure','health-expenditure-per-capita','infant-mortality','maternal-mortality','physicians','hospital-beds']],
  ['Technology & infrastructure', ['internet-use','mobile-subscriptions','fixed-broadband','electricity-access','renewable-electricity']],
  ['Energy & environment', ['co2-emissions-per-capita','renewable-energy-consumption','forest-area','electric-power-consumption']]
];

const EXPECTED_MOVED_SLUGS = [
  'agricultural-land-share',
  'birth-rate',
  'death-rate',
  'exports-share-of-gdp',
  'fdi-net-inflows-share-of-gdp',
  'forest-area-share',
  'gdp',
  'health-expenditure-share-of-gdp',
  'imports-share-of-gdp',
  'population-age-0-14',
  'population-age-65-plus',
  'trade-share-of-gdp'
].sort();

const topicMap = groups => new Map(groups.flatMap(([topic, slugs]) => slugs.map(slug => [slug, topic])));
const legacyTopic = topicMap(LEGACY_GROUPS);
const nextTopic = topicMap(WDI_COUNTRY_GROUPS);

async function impactEvidence() {
  const countries = new Map();
  for (const indicator of currentIndicators) {
    const snapshot = JSON.parse(await readFile(new URL(`../site/data/wdi/${indicator.slug}/data.json`, import.meta.url), 'utf8'));
    for (const record of snapshot.records ?? []) {
      if (!record?.code || !record?.country || !Number.isFinite(record.value)) continue;
      if (!countries.has(record.code)) countries.set(record.code, { country: record.country, metrics: [] });
      countries.get(record.code).metrics.push({ slug: indicator.slug, value: record.value, year: record.year });
    }
  }
  const hubs = [...countries.entries()].filter(([, c]) => c.metrics.length >= 10);
  const movedByIndicator = {};
  const movedByTargetGroup = {};
  const affectedHubs = new Set();
  let movedLinks = 0;
  for (const [code, hub] of hubs) {
    for (const metric of hub.metrics) {
      const before = legacyTopic.get(metric.slug) ?? 'More indicators';
      const after = nextTopic.get(metric.slug) ?? 'More indicators';
      if (before === after) continue;
      movedLinks++;
      affectedHubs.add(code);
      movedByIndicator[metric.slug] = (movedByIndicator[metric.slug] ?? 0) + 1;
      movedByTargetGroup[after] = (movedByTargetGroup[after] ?? 0) + 1;
    }
  }
  return {
    eligibleHubs: hubs.length,
    affectedHubs: affectedHubs.size,
    movedLinks,
    movedByIndicator,
    movedByTargetGroup,
    sample: hubs.filter(([code]) => affectedHubs.has(code)).slice(0, 3).map(([code, hub]) => ({
      code,
      country: hub.country,
      movements: hub.metrics.filter(m => (legacyTopic.get(m.slug) ?? 'More indicators') !== (nextTopic.get(m.slug) ?? 'More indicators')).map(m => ({ slug: m.slug, from: legacyTopic.get(m.slug) ?? 'More indicators', to: nextTopic.get(m.slug) ?? 'More indicators' }))
    }))
  };
}

test('every current WDI indicator belongs to exactly one visible country topic', () => {
  const counts = new Map();
  for (const slug of assigned) counts.set(slug, (counts.get(slug) ?? 0) + 1);
  assert.deepEqual([...counts.entries()].filter(([, n]) => n !== 1), []);
  assert.deepEqual([...new Set(assigned)].sort(), current);
});

test('taxonomy changes are limited to the 12 intended formerly-collapsed indicators', () => {
  const movedSlugs = current.filter(slug => (legacyTopic.get(slug) ?? 'More indicators') !== (nextTopic.get(slug) ?? 'More indicators')).sort();
  assert.deepEqual(movedSlugs, EXPECTED_MOVED_SLUGS);
  for (const slug of EXPECTED_MOVED_SLUGS) {
    assert.equal(legacyTopic.get(slug) ?? 'More indicators', 'More indicators');
    assert.notEqual(nextTopic.get(slug) ?? 'More indicators', 'More indicators');
  }
});

test('representative formerly-collapsed indicators have the intended visible topic', () => {
  const topic = slug => nextTopic.get(slug);
  assert.equal(topic('population-age-0-14'), 'People');
  assert.equal(topic('death-rate'), 'Health');
  assert.equal(topic('health-expenditure-share-of-gdp'), 'Health');
  assert.equal(topic('gdp'), 'Economy & work');
  assert.equal(topic('trade-share-of-gdp'), 'Economy & work');
  assert.equal(topic('forest-area-share'), 'Energy & environment');
  assert.equal(topic('agricultural-land-share'), 'Energy & environment');
});

test('review-only impact audit quantifies grouping changes without changing hub eligibility or metric payloads', async () => {
  const evidence = await impactEvidence();
  assert.ok(evidence.eligibleHubs > 0);
  assert.ok(evidence.affectedHubs > 0);
  assert.ok(evidence.movedLinks > 0);
  assert.ok(evidence.affectedHubs <= evidence.eligibleHubs);
  assert.deepEqual(Object.keys(evidence.movedByIndicator).sort(), EXPECTED_MOVED_SLUGS);
  assert.equal(Object.values(evidence.movedByIndicator).reduce((a, b) => a + b, 0), evidence.movedLinks);
  assert.equal(Object.values(evidence.movedByTargetGroup).reduce((a, b) => a + b, 0), evidence.movedLinks);
  console.log(`WDI_COUNTRY_TAXONOMY_IMPACT ${JSON.stringify(evidence)}`);
});
