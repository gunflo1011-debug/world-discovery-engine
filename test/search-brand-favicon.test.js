import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const site = fileURLToPath(new URL('../site/', import.meta.url));

async function read(relativePath) {
  return readFile(new URL(`../site/${relativePath}`, import.meta.url), 'utf8');
}

test('released entrypoints advertise one clear primary favicon and ICO fallback', async () => {
  for (const page of ['index.html', 'de/index.html', 'es/index.html', 'fr/index.html', 'zh-hans/index.html', '404.html']) {
    const html = await read(page);
    assert.equal((html.match(/href="\/favicon\.svg"/g) || []).length, 1, `${page} primary favicon`);
    assert.equal((html.match(/href="\/favicon\.ico"/g) || []).length, 1, `${page} ICO fallback`);
    assert.match(html, /rel="icon" href="\/favicon\.svg" type="image\/svg\+xml" data-wd-search-branding="primary"/);
    assert.match(html, /rel="alternate icon" href="\/favicon\.ico" sizes="any" data-wd-search-branding="fallback"/);
  }
});

test('search favicon is square, high-contrast vector artwork without font dependency', async () => {
  const svg = await read('favicon.svg');
  assert.match(svg, /width="48" height="48" viewBox="0 0 48 48"/);
  assert.match(svg, /fill="#111827"/);
  assert.match(svg, /stroke="#ffffff"/);
  assert.match(svg, /fill="#38bdf8"/);
  assert.doesNotMatch(svg, /<text\b/i);
  assert.ok(svg.length < 2048, `favicon.svg should stay lightweight; got ${svg.length} bytes`);
});
