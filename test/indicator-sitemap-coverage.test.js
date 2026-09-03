import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readdir, readFile, stat } from 'node:fs/promises';
import { promisify } from 'node:util';
import test from 'node:test';

const execFileAsync = promisify(execFile);
const siteRoot = new URL('../site/', import.meta.url);
const indicatorsRoot = new URL('indicators/', siteRoot);
const sitemapUrl = new URL('sitemap.xml', siteRoot);
const sitemapEnricherUrl = new URL('../scripts/add-wdi-pages-to-sitemap.mjs', import.meta.url);
const legacyConsolidatorUrl = new URL('../scripts/consolidate-legacy-indicators.mjs', import.meta.url);
const base = 'https://worlddiscoverydata.com';

function extractCanonical(html) {
  const match = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  return match?.[1] || null;
}

function isNoindex(html) {
  return /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html);
}

test('every indexable indicator landing page is present in sitemap.xml', async () => {
  // Earlier tests intentionally rebuild portions of site/ and can restore the base
  // sitemap. Reapply the production sitemap steps so this regression test validates
  // the deployable build contract rather than depending on test order.
  await execFileAsync(process.execPath, [sitemapEnricherUrl.pathname]);
  await execFileAsync(process.execPath, [legacyConsolidatorUrl.pathname]);

  const entries = await readdir(indicatorsRoot, { withFileTypes: true });
  const sitemap = await readFile(sitemapUrl, 'utf8');
  const missing = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const indexUrl = new URL(`${entry.name}/index.html`, indicatorsRoot);
    let html;
    try {
      const info = await stat(indexUrl);
      if (!info.isFile()) continue;
      html = await readFile(indexUrl, 'utf8');
    } catch (error) {
      if (error?.code === 'ENOENT') continue;
      throw error;
    }

    if (isNoindex(html)) continue;
    const canonical = extractCanonical(html);
    const expected = `${base}/indicators/${entry.name}/`;
    if (canonical !== expected) continue;

    const loc = `<loc>${canonical}</loc>`;
    if (!sitemap.includes(loc)) missing.push(`/indicators/${entry.name}/`);
  }

  assert.deepEqual(
    missing,
    [],
    `Indexable indicator pages missing from sitemap.xml: ${missing.join(', ')}`
  );
});

test('legacy indicator routes are noindex and excluded from sitemap', async () => {
  await execFileAsync(process.execPath, [sitemapEnricherUrl.pathname]);
  await execFileAsync(process.execPath, [legacyConsolidatorUrl.pathname]);

  const sitemap = await readFile(sitemapUrl, 'utf8');
  const routes = ['/', '/gdp/', '/gdp-per-capita/', '/internet-use/', '/real-gdp/'];

  for (const suffix of routes) {
    const html = await readFile(new URL(`indicators${suffix}index.html`, siteRoot), 'utf8');
    assert.equal(isNoindex(html), true, `Expected /indicators${suffix} to be noindex`);
    assert.equal(
      sitemap.includes(`<loc>${base}/indicators${suffix}</loc>`),
      false,
      `Expected /indicators${suffix} to be excluded from sitemap.xml`
    );
  }

  const catalog = await readFile(new URL('indicators/index.html', siteRoot), 'utf8');
  const internet = await readFile(new URL('indicators/internet-use/index.html', siteRoot), 'utf8');
  assert.equal(extractCanonical(catalog), `${base}/data/`);
  assert.equal(extractCanonical(internet), `${base}/data/internet-use/`);
});

test('maintained Internet-use landing page keeps regional explorer discoverable', async () => {
  await execFileAsync(process.execPath, [legacyConsolidatorUrl.pathname]);
  const page = await readFile(new URL('data/internet-use/index.html', siteRoot), 'utf8');
  assert.match(page, /data-internet-use-region-discovery/);
  assert.match(page, /href="\.\.\/\.\.\/indicators\/internet-use\/region\/"/);
});
