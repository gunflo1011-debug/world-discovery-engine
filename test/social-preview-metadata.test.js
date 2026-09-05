import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../site/', import.meta.url);
const imageUrl = 'https://worlddiscoverydata.com/social-preview.png';
const pages = [
  'index.html',
  'data/gdp-per-capita/index.html',
  'de/data/gdp-per-capita/index.html',
  'es/countries/deu/index.html',
  'fr/compare/index.html',
  'zh-hans/methodology/index.html',
];

test('released pages advertise the shared large social preview', async () => {
  for (const page of pages) {
    const html = await readFile(new URL(page, root), 'utf8');
    assert.match(html, new RegExp(`<meta property="og:image" content="${imageUrl.replaceAll('.', '\\.')}">`), page);
    assert.match(html, /<meta property="og:image:width" content="1200">/, page);
    assert.match(html, /<meta property="og:image:height" content="630">/, page);
    assert.match(html, /<meta property="og:image:alt" content="[^"]+">/, page);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image">/, page);
    assert.match(html, new RegExp(`<meta name="twitter:image" content="${imageUrl.replaceAll('.', '\\.')}">`), page);
    assert.match(html, /<meta name="twitter:image:alt" content="[^"]+">/, page);
  }
});

test('social preview asset is a 1200 by 630 PNG', async () => {
  const png = await readFile(new URL('social-preview.png', root));
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});
