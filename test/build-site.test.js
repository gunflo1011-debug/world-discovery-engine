import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { buildSite } from '../scripts/build-site.js';

test('static build includes browse hubs, sources and evidence routes', async () => {
  const result = await buildSite();

  assert.ok(result.pagePaths.includes('/'));
  assert.ok(result.pagePaths.includes('/explore/'));
  assert.ok(result.pagePaths.includes('/discoveries/'));
  assert.ok(result.pagePaths.includes('/evidence/'));
  assert.ok(result.pagePaths.includes('/methodology/'));
  assert.ok(result.pagePaths.includes('/sources/'));
  assert.ok(result.pagePaths.some((path) => path.startsWith('/evidence/') && path !== '/evidence/'));

  const sitemap = await readFile(resolve(process.cwd(), 'site', 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /world-discovery-engine\/explore\//);
  assert.match(sitemap, /world-discovery-engine\/discoveries\//);
  assert.match(sitemap, /world-discovery-engine\/sources\//);

  const buildMetadata = JSON.parse(await readFile(resolve(process.cwd(), 'site', 'build.json'), 'utf8'));
  assert.equal(buildMetadata.publicRoutes, result.pagePaths.length);
});
