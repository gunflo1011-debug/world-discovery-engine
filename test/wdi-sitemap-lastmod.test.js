import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import test from 'node:test';

const execFileAsync = promisify(execFile);
const siteRoot = new URL('../site/', import.meta.url);
const catalogUrl = new URL('data/wdi/index.json', siteRoot);
const sitemapUrl = new URL('sitemap.xml', siteRoot);
const sitemapEnricherUrl = new URL('../scripts/add-wdi-pages-to-sitemap.mjs', import.meta.url);
const base = 'https://worlddiscoverydata.com';

test('WDI sitemap routes use catalog freshness for truthful lastmod metadata', async () => {
  await execFileAsync(process.execPath, [sitemapEnricherUrl.pathname]);

  const catalog = JSON.parse(await readFile(catalogUrl, 'utf8'));
  const expectedLastmod = new Date(catalog.generatedAt).toISOString().slice(0, 10);
  const sitemap = await readFile(sitemapUrl, 'utf8');
  const firstCurrent = (catalog.indicators ?? []).find((indicator) => indicator.status === 'CURRENT_VERIFIED');
  assert.ok(firstCurrent, 'Expected at least one current WDI indicator');

  const paths = ['/data/', `/data/${firstCurrent.slug}/`, '/countries/', '/compare/'];
  for (const path of paths) {
    const row = `<url><loc>${base}${path}</loc><lastmod>${expectedLastmod}</lastmod></url>`;
    assert.equal(sitemap.includes(row), true, `Expected truthful lastmod row for ${path}`);
  }

  await execFileAsync(process.execPath, [sitemapEnricherUrl.pathname]);
  const secondPass = await readFile(sitemapUrl, 'utf8');
  assert.equal(secondPass, sitemap, 'Expected sitemap lastmod enrichment to be idempotent');
});
