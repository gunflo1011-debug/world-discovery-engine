import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { buildSite } from '../scripts/build-site.js';

test('static build includes real public routes and excludes demo or absent URLs', async () => {
  const result = await buildSite();

  assert.ok(result.pagePaths.includes('/'));
  assert.ok(result.pagePaths.includes('/explore/'));
  assert.ok(result.pagePaths.includes('/discoveries/'));
  assert.ok(result.pagePaths.includes('/evidence/'));
  assert.ok(result.pagePaths.includes('/methodology/'));
  assert.ok(result.pagePaths.includes('/sources/'));
  assert.ok(result.pagePaths.includes('/archive/'));
  assert.ok(result.pagePaths.includes('/status/'));
  assert.ok(result.pagePaths.includes('/indicators/real-gdp/'));
  assert.ok(result.pagePaths.some((path) => path.startsWith('/evidence/') && path !== '/evidence/'));
  assert.ok(!result.pagePaths.includes('/indicators/population-total/'));
  assert.ok(!result.pagePaths.includes('/evidence/germany-gdp-growth-revision/'));

  const sitemap = await readFile(resolve(process.cwd(), 'site', 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /world-discovery-engine\/explore\//);
  assert.match(sitemap, /world-discovery-engine\/archive\//);
  assert.match(sitemap, /world-discovery-engine\/indicators\/real-gdp\//);
  assert.doesNotMatch(sitemap, /world-discovery-engine\/indicators\/population-total\//);
  assert.doesNotMatch(sitemap, /world-discovery-engine\/evidence\/germany-gdp-growth-revision\//);

  const evidenceIndex = JSON.parse(await readFile(resolve(process.cwd(), 'site', 'evidence', 'index.json'), 'utf8'));
  assert.ok(evidenceIndex.evidence.every((record) => record.demo === false));

  const buildMetadata = JSON.parse(await readFile(resolve(process.cwd(), 'site', 'build.json'), 'utf8'));
  assert.equal(buildMetadata.publicRoutes, result.pagePaths.length);
});
