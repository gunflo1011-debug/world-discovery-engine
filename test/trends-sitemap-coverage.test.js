import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const siteRoot = fileURLToPath(new URL('../site/', import.meta.url));
const baseUrl = 'https://worlddiscoverydata.com';

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

test('every generated Trends hub and detail page is present in sitemap.xml', async () => {
  const sitemap = await readFile(path.join(siteRoot, 'sitemap.xml'), 'utf8');
  const locations = new Set([...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(match => match[1]));
  const trendPages = (await walk(path.join(siteRoot, 'trends'))).filter(file => path.basename(file) === 'index.html');

  assert.ok(trendPages.length > 1, 'expected Trends hub plus market/detail pages');

  for (const file of trendPages) {
    const relativeDir = path.relative(siteRoot, path.dirname(file)).replaceAll(path.sep, '/');
    const expected = `${baseUrl}/${relativeDir}/`;
    assert.ok(locations.has(expected), `sitemap missing generated Trends route: ${expected}`);
  }
});
