import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);

test('fun facts page is generated, indexable, discoverable and wired to navigation', async () => {
  const [html, detail, explore, navScript, sitemapScript] = await Promise.all([
    readFile(new URL('fun-facts/index.html', siteRoot), 'utf8'),
    readFile(new URL('fun-facts/horned-lizard-shoots-blood-from-eyes/index.html', siteRoot), 'utf8'),
    readFile(new URL('explore/index.html', siteRoot), 'utf8'),
    readFile(new URL('../scripts/add-trends-navigation.mjs', import.meta.url), 'utf8'),
    readFile(new URL('../scripts/add-wdi-pages-to-sitemap.mjs', import.meta.url), 'utf8')
  ]);

  assert.match(html, /<link rel="canonical" href="https:\/\/worlddiscoverydata\.com\/fun-facts\/">/);
  assert.match(html, /One genuinely weird fact a day/);
  assert.match(html, /This lizard can shoot blood from its eyes/);
  assert.match(html, /Read the checked explanation/);
  assert.match(html, /property="og:type" content="website"/);
  assert.match(detail, /<link rel="canonical" href="https:\/\/worlddiscoverydata\.com\/fun-facts\/horned-lizard-shoots-blood-from-eyes\/">/);
  assert.match(detail, /Yes, really\./);
  assert.match(detail, /National Park Service/);
  assert.match(detail, /"@type":"Article"/);
  assert.match(explore, /href="\.\.\/fun-facts\/"/);
  assert.match(navScript, /Fun Facts/);
  assert.match(sitemapScript, /'\/fun-facts\/'/);
});
