import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { buildSite } from '../scripts/build-site.js';

test('static build includes only discovery-ready real evidence in sitemap and machine index', async () => {
  const result = await buildSite();

  assert.ok(result.pagePaths.includes('/'));
  assert.ok(result.pagePaths.includes('/explore/'));
  assert.ok(result.pagePaths.includes('/discoveries/'));
  assert.ok(result.pagePaths.includes('/evidence/'));
  assert.ok(result.pagePaths.includes('/methodology/'));
  assert.ok(result.pagePaths.includes('/sources/'));
  assert.ok(result.pagePaths.includes('/archive/'));
  assert.ok(result.pagePaths.includes('/status/'));
  assert.ok(result.pagePaths.includes('/indicators/'));
  assert.ok(result.pagePaths.includes('/indicators/real-gdp/'));
  assert.ok(result.pagePaths.some((path) => path.startsWith('/evidence/') && path !== '/evidence/'));
  assert.ok(!result.pagePaths.includes('/indicators/population-total/'));
  assert.ok(!result.pagePaths.includes('/evidence/germany-gdp-growth-revision/'));
  assert.ok(!result.pagePaths.includes('/evidence/real-wdi-population-revision-2025/'));
  assert.ok(result.evidence.every((record) => record.discovery.ready));

  const sitemap = await readFile(resolve(process.cwd(), 'site', 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /world-discovery-engine\/explore\//);
  assert.match(sitemap, /world-discovery-engine\/archive\//);
  assert.match(sitemap, /world-discovery-engine\/indicators\//);
  assert.match(sitemap, /world-discovery-engine\/indicators\/real-gdp\//);
  assert.doesNotMatch(sitemap, /world-discovery-engine\/indicators\/population-total\//);
  assert.doesNotMatch(sitemap, /world-discovery-engine\/evidence\/germany-gdp-growth-revision\//);
  assert.doesNotMatch(sitemap, /world-discovery-engine\/evidence\/real-wdi-population-revision-2025\//);

  const evidenceIndex = JSON.parse(await readFile(resolve(process.cwd(), 'site', 'evidence', 'index.json'), 'utf8'));
  assert.equal(evidenceIndex.schemaVersion, '1.2');
  assert.ok(evidenceIndex.evidence.every((record) => record.demo === false));
  assert.ok(evidenceIndex.evidence.every((record) => record.noindex === false));
  assert.ok(evidenceIndex.evidence.every((record) => record.discoveryReady === true));
  assert.ok(evidenceIndex.evidence.every((record) => record.status === 'REAL'));
  assert.ok(evidenceIndex.evidence.every((record) => record.machineReadable?.json?.endsWith('/evidence.json')));
  assert.ok(evidenceIndex.evidence.every((record) => record.machineReadable?.csv?.endsWith('/evidence.csv')));
  assert.ok(evidenceIndex.evidence.every((record) => record.indicator?.code && record.indicator?.methodologyVersion));
  assert.ok(evidenceIndex.evidence.every((record) => record.entity?.code && record.entity?.entityType));
  assert.ok(evidenceIndex.evidence.every((record) => Number.isInteger(record.referenceYear)));
  assert.ok(evidenceIndex.evidence.every((record) => record.vintages?.length === 2));
  assert.ok(evidenceIndex.evidence.every((record) => record.vintages.every((item) => item.vintage && /^https?:\/\//.test(item.sourceUrl))));
  assert.ok(evidenceIndex.evidence.every((record) => record.methodologyNote && record.license));

  const germany = evidenceIndex.evidence.find((record) => record.slug === 'germany-population-revision-2025');
  assert.ok(germany);
  assert.equal(germany.status, 'REAL');
  assert.equal(germany.indicator.code, 'SP.POP.TOTL');
  assert.equal(germany.entity.code, 'DEU');
  assert.equal(germany.referenceYear, 2023);
  assert.equal(germany.machineReadable.json, '/evidence/germany-population-revision-2025/evidence.json');
  assert.equal(germany.machineReadable.csv, '/evidence/germany-population-revision-2025/evidence.csv');
  assert.deepEqual(germany.vintages.map((item) => item.vintage), ['2025-01-28', '2025-07-02']);
  assert.ok(germany.vintages.every((item) => item.sourceUrl?.startsWith('https://databank.worldbank.org/')));

  const buildMetadata = JSON.parse(await readFile(resolve(process.cwd(), 'site', 'build.json'), 'utf8'));
  assert.equal(buildMetadata.publicRoutes, result.pagePaths.length);
  assert.ok(buildMetadata.demoPagesExcluded >= 1);
  assert.ok(buildMetadata.noindexPagesExcluded >= 2);
  assert.ok(Number.isInteger(buildMetadata.discoveryIncompleteExcluded));

  for (const slug of ['germany-population-revision-2025', 'united-states-population-revision-2025']) {
    const verifiedPopulationPage = await readFile(resolve(process.cwd(), 'site', 'evidence', slug, 'index.html'), 'utf8');
    assert.match(verifiedPopulationPage, /<script type="application\/ld\+json">/);
    assert.match(verifiedPopulationPage, /"@type":"Dataset"/);
    assert.match(verifiedPopulationPage, /"propertyID":"SP\.POP\.TOTL"/);
    assert.match(verifiedPopulationPage, new RegExp(`${slug}\\/evidence\\.json`));
    assert.match(verifiedPopulationPage, new RegExp(`${slug}\\/evidence\\.csv`));
  }
});