import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);

test('fun facts page is generated, indexable and linked in primary navigation', async () => {
  const [html, sitemap] = await Promise.all([
    readFile(new URL('fun-facts/index.html', siteRoot), 'utf8'),
    readFile(new URL('sitemap.xml', siteRoot), 'utf8')
  ]);

  assert.match(html, /<link rel="canonical" href="https:\/\/worlddiscoverydata\.com\/fun-facts\/">/);
  assert.match(html, /The world is weird\. The data proves it\./);
  assert.match(html, /Did you know\?/);
  assert.match(html, /Explore the data →/);
  assert.match(html, />Fun Facts<\/a>/);
  assert.match(sitemap, /https:\/\/worlddiscoverydata\.com\/fun-facts\//);
});
