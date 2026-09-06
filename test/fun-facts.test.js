import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);

test('fun facts page is generated, indexable, discoverable and wired to navigation', async () => {
  const [html, explore, navScript, sitemapScript] = await Promise.all([
    readFile(new URL('fun-facts/index.html', siteRoot), 'utf8'),
    readFile(new URL('explore/index.html', siteRoot), 'utf8'),
    readFile(new URL('../scripts/add-trends-navigation.mjs', import.meta.url), 'utf8'),
    readFile(new URL('../scripts/add-wdi-pages-to-sitemap.mjs', import.meta.url), 'utf8')
  ]);

  assert.match(html, /<link rel="canonical" href="https:\/\/worlddiscoverydata\.com\/fun-facts\/">/);
  assert.match(html, /The world is weird\. The data proves it\./);
  assert.match(html, /Did you know\?/);
  assert.match(html, /Explore the data →/);
  assert.match(html, /property="og:type" content="website"/);
  assert.match(explore, /href="\.\.\/fun-facts\/"/);
  assert.match(navScript, /Fun Facts/);
  assert.match(sitemapScript, /'\/fun-facts\/'/);
});
