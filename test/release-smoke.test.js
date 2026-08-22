import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const siteRoot = resolve(process.cwd(), 'site');

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

test('critical navigation and indicator discovery links resolve', async () => {
  await assertInternalLinksResolve('index.html');
  await assertInternalLinksResolve('indicators/index.html');
  await assertInternalLinksResolve('indicators/real-gdp/index.html');
});

test('GDP screening remains fail-closed and machine-readable', async () => {
  const page = await readSite('indicators/real-gdp/index.html');
  assert.match(page, /NY\.GDP\.MKTP\.KD/);
  assert.match(page, /SCREENING · FAIL CLOSED/);
  assert.match(page, /No GDP revision values are published/i);
  assert.match(page, /rel="canonical" href="https:\/\/gunflo1011-debug\.github\.io\/world-discovery-engine\/indicators\/real-gdp\/"/);

  const status = JSON.parse(await readSite('indicators/real-gdp/status.json'));
  assert.equal(status.indicator.code, 'NY.GDP.MKTP.KD');
  assert.equal(status.publishableRevisionData, false);
  assert.equal(status.screeningStatus, 'BLOCKED_METHODOLOGY_COMPARABILITY');
  assert.ok(!('revisionValue' in status));
});

test('indicator registry is canonical and does not advertise a missing population hub', async () => {
  const page = await readSite('indicators/index.html');
  assert.match(page, /rel="canonical" href="https:\/\/gunflo1011-debug\.github\.io\/world-discovery-engine\/indicators\/"/);
  assert.match(page, /Population, total/);
  assert.match(page, /Real GDP/);
  assert.doesNotMatch(page, /href="\.\/population-total\/index\.html"/);
});

test('demo and legacy duplicate pages are explicitly noindex', async () => {
  const demo = await readSite('evidence/germany-gdp-growth-revision/index.html');
  assert.match(demo, /name="robots" content="noindex,follow"/);
  assert.match(demo, /DEMO FIXTURE · NOT REAL WDI EVIDENCE/);

  const legacy = await readSite('evidence/real-wdi-population-revision-2025/index.html');
  assert.match(legacy, /name="robots" content="noindex,follow"/);
  assert.match(legacy, /rel="canonical" href="https:\/\/gunflo1011-debug\.github\.io\/world-discovery-engine\/evidence\/germany-population-revision-2025\/"/);
  await assertExists('evidence/germany-population-revision-2025/index.html');
});
