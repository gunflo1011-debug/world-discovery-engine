import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

import { auditInternalLinks } from '../scripts/check-internal-links.mjs';

test('all sitemap pages have valid internal targets, fragments and inbound discovery paths', async () => {
  const result = await auditInternalLinks();
  const sitemap = await readFile(new URL('../site/sitemap.xml', import.meta.url), 'utf8');
  const sitemapPages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].length;
  assert.ok(sitemapPages > 180, 'sitemap must retain the complete public corpus');
  assert.equal(result.pages, sitemapPages);
  assert.ok(result.checkedLinks > 2000);
  assert.equal(result.orphanPages, 0);
});
