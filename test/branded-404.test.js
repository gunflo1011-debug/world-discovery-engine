import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd(), 'site');

test('build emits a branded, non-indexed 404 with path-safe recovery links', async () => {
  const html = await readFile(resolve(root, '404.html'), 'utf8');

  assert.match(html, /<title>Page not found · World Discovery<\/title>/);
  assert.match(html, /<meta name="robots" content="noindex,follow">/);
  assert.match(html, /data-wd-shared-shell/);
  assert.match(html, /404 · Page not found/);
  assert.match(html, /href="\/"[^>]*>Home<\/a>/);
  assert.match(html, /href="\/data\/"[^>]*>Data catalog<\/a>/);
  assert.match(html, /href="\/countries\/"[^>]*>Countries<\/a>/);
  assert.match(html, /href="\/compare\/"[^>]*>Compare<\/a>/);
  assert.doesNotMatch(html, /href="\.\.?\//);
});

test('404 remains outside the sitemap', async () => {
  const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
  assert.doesNotMatch(sitemap, /\/404(?:\.html)?(?:<|\/)/);
});
