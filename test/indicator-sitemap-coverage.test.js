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
const base = 'https://worlddiscoverydata.com';

function extractCanonical(html) {
  const match = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  return match?.[1] || null;
}

test('every public indicator landing page is present in sitemap.xml', async () => {
  // Earlier tests intentionally rebuild portions of site/ and can restore the base
  // sitemap. Reapply the production sitemap enrichment so this regression test
  // validates the deployable build contract rather than depending on test order.
  await execFileAsync(process.execPath, [sitemapEnricherUrl.pathname]);

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

    const canonical = extractCanonical(html);
    const expected = `${base}/indicators/${entry.name}/`;
    if (canonical !== expected) continue;

    const loc = `<loc>${canonical}</loc>`;
    if (!sitemap.includes(loc)) missing.push(`/indicators/${entry.name}/`);
  }

  assert.deepEqual(
    missing,
    [],
    `Public indicator pages missing from sitemap.xml: ${missing.join(', ')}`
  );
});
