import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const siteRoot = new URL('../site/', import.meta.url);
const indicatorsRoot = new URL('indicators/', siteRoot);
const sitemapUrl = new URL('sitemap.xml', siteRoot);
const base = 'https://worlddiscoverydata.com';

test('every public indicator landing page is present in sitemap.xml', async () => {
  const entries = await readdir(indicatorsRoot, { withFileTypes: true });
  const sitemap = await readFile(sitemapUrl, 'utf8');
  const missing = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const indexUrl = new URL(`${entry.name}/index.html`, indicatorsRoot);
    try {
      const info = await stat(indexUrl);
      if (!info.isFile()) continue;
    } catch (error) {
      if (error?.code === 'ENOENT') continue;
      throw error;
    }

    const loc = `<loc>${base}/indicators/${entry.name}/</loc>`;
    if (!sitemap.includes(loc)) missing.push(`/indicators/${entry.name}/`);
  }

  assert.deepEqual(
    missing,
    [],
    `Public indicator pages missing from sitemap.xml: ${missing.join(', ')}`
  );
});
