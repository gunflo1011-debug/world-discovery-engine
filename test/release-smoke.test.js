import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const siteRoot = new URL('../site/', import.meta.url);
const baseUrl = process.env.SITE_BASE_URL || 'https://worlddiscoverydata.com/';

async function readSite(relative) {
  return readFile(new URL(relative, siteRoot), 'utf8');
}

async function assertInternalLinksResolve(relative) {
  const html = await readSite(relative);
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (/^(?:https?:|mailto:|tel:|#)/.test(href)) continue;
    const [path] = href.split('#');
    if (!path) continue;
    const resolved = new URL(path, new URL(relative, siteRoot));
    let target = resolved;
    if (target.pathname.endsWith('/')) target = new URL('index.html', target);
    try {
      await readFile(target, 'utf8');
    } catch {
      assert.fail(`${relative} contains unresolved internal href ${href}`);
    }
  }
}

function collectKeys(value, keys = new Set()) {
  if (!value || typeof value !== 'object') return keys;
  if (Array.isArray(value)) {
    for (const item of value) collectKeys(item, keys);
    return keys;
  }
  for (const [key, nested] of Object.entries(value)) {
    keys.add(key);
    collectKeys(nested, keys);
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
  assert.match(page, /name="robots" content="noindex,follow"/);

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

test('legacy indicator registry hands users to the maintained data catalog', async () => {
  const page = await readSite('indicators/index.html');
  assert.match(page, /name="robots" content="noindex,follow"/);
  assert.match(page, /rel="canonical" href="https:\/\/worlddiscoverydata\.com\/data\/"/);
  assert.match(page, /This indicator page has moved\./);
  assert.match(page, /href="\.\.\/data\/"/);
  assert.doesNotMatch(page, /Three indicator products are now published/i);
  assert.doesNotMatch(page, /World Discovery Engine|World Discovery Data/);
});

test('robots and sitemap expose the canonical release surface only', async () => {
  const robots = await readSite('robots.txt');
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, new RegExp(`^Sitemap: ${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}sitemap\\.xml$`, 'm'));

  const sitemap = await readSite('sitemap.xml');
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.ok(locations.length > 0);
  assert.ok(locations.every((url) => url.startsWith(baseUrl)));
  assert.ok(!locations.some((url) => /\/indicators\/(?:$|gdp\/$|gdp-per-capita\/$|internet-use\/$|real-gdp\/$)/.test(url.replace(baseUrl, '/'))));
});
