import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const siteRoot = resolve(process.cwd(), 'site');
const baseUrl = 'https://worlddiscoverydata.com/';

async function readSite(path) {
  return readFile(resolve(siteRoot, path), 'utf8');
}

async function assertExists(path) {
  await access(resolve(siteRoot, path));
}

function internalHrefs(html) {
  return [...html.matchAll(/href="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((href) => !/^(https?:|mailto:|tel:|#)/i.test(href));
}

async function assertInternalLinksResolve(htmlPath) {
  const html = await readSite(htmlPath);
  const baseDir = dirname(resolve(siteRoot, htmlPath));

  for (const href of internalHrefs(html)) {
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) continue;
    const absolute = resolve(baseDir, clean);
    const target = clean.endsWith('/') || !/\.[a-z0-9]+$/i.test(clean)
      ? resolve(absolute, 'index.html')
      : absolute;
    await access(target);
  }
}

function collectKeys(value, keys = new Set()) {
  if (!value || typeof value !== 'object') return keys;
  for (const [key, child] of Object.entries(value)) {
    keys.add(key);
    collectKeys(child, keys);
  }
  return keys;
}

test('critical navigation and indicator discovery links resolve', async () => {
  await assertInternalLinksResolve('index.html');
  await assertInternalLinksResolve('indicators/index.html');
  await assertInternalLinksResolve('indicators/real-gdp/index.html');
});

test('GDP screening remains fail-closed and machine-readable', async () => {
  const page = await readSite('indicators/real-gdp/index.html');
  assert.match(page, /NY\.GDP\.MKTP\.KD/);
  assert.match(page, /SCREENING · FAIL CLOSED/);
  assert.match(page, /no revision values(?: or rankings)? are published/i);
  assert.match(page, /rel="canonical" href="https:\/\/worlddiscoverydata\.com\/indicators\/real-gdp\/"/);

  const status = JSON.parse(await readSite('indicators/real-gdp/status.json'));
  assert.equal(status.indicator.code, 'NY.GDP.MKTP.KD');
  assert.equal(status.publishableRevisionData, false);
  assert.equal(status.screeningStatus, 'BLOCKED_METHODOLOGY_COMPARABILITY');
  assert.ok(!('revisionValue' in status));

  const forbiddenPublicationKeys = ['rows', 'values', 'revisions', 'oldValue', 'newValue', 'delta', 'ranking', 'rank'];
  const statusKeys = collectKeys(status);
  for (const key of forbiddenPublicationKeys) {
    assert.equal(statusKeys.has(key), false, `GDP status must not publish ${key}`);
  }
});

test('indicator registry is canonical and does not advertise a missing population hub', async () => {
  const page = await readSite('indicators/index.html');
  assert.match(page, /rel="canonical" href="https:\/\/worlddiscoverydata\.com\/indicators\/"/);
  assert.match(page, /Population, total/);
  assert.match(page, /Real GDP/);
  assert.doesNotMatch(page, /href="\.\/population-total\/index\.html"/);
});

test('robots and sitemap expose the canonical release surface only', async () => {
  const robots = await readSite('robots.txt');
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, new RegExp(`^Sitemap: ${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}sitemap\\.xml$`, 'm'));

  const sitemap = await readSite('sitemap.xml');
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.ok(locations.length > 0);
  assert.equal(new Set(locations).size, locations.length, 'sitemap must not contain duplicate URLs');

  for (const expected of [
    baseUrl,
    `${baseUrl}indicators/`,
    `${baseUrl}indicators/real-gdp/`,
    `${baseUrl}evidence/germany-population-revision-2025/`
  ]) {
    assert.ok(locations.includes(expected), `sitemap missing ${expected}`);
  }

  assert.ok(locations.every((url) => url.startsWith(baseUrl)));
  assert.ok(locations.every((url) => !url.includes('/indicators/population-total/')));
  assert.ok(locations.every((url) => !url.includes('/evidence/germany-gdp-growth-revision/')));
  assert.ok(locations.every((url) => !url.includes('/evidence/life-expectancy-change/')));
  assert.ok(locations.every((url) => !url.includes('/evidence/real-wdi-population-revision-2025/')));
});

test('legacy duplicate page is noindex and consolidates to the canonical evidence URL', async () => {
  const legacy = await readSite('evidence/real-wdi-population-revision-2025/index.html');
  assert.match(legacy, /name="robots" content="noindex,follow"/);
  assert.match(legacy, /rel="canonical" href="https:\/\/worlddiscoverydata\.com\/evidence\/germany-population-revision-2025\/"/);
  await assertExists('evidence/germany-population-revision-2025/index.html');

  const canonicalEvidence = await readSite('evidence/germany-population-revision-2025/index.html');
  assert.match(canonicalEvidence, /rel="canonical" href="https:\/\/worlddiscoverydata\.com\/evidence\/germany-population-revision-2025\/"/);
  assert.doesNotMatch(canonicalEvidence, /name="robots" content="[^"]*noindex/i);
});
