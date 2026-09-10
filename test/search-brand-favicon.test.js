import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function read(relativePath) {
  return readFile(new URL(`../site/${relativePath}`, import.meta.url), 'utf8');
}

const origin = 'https://worlddiscoverydata.com';

test('released locale entrypoints advertise one clear branded favicon without stale ICO fallback', async () => {
  for (const page of ['index.html', 'de/index.html', 'es/index.html', 'fr/index.html', 'zh-hans/index.html']) {
    const html = await read(page);
    assert.equal((html.match(/href="https:\/\/worlddiscoverydata\.com\/favicon\.svg"/g) || []).length, 1, `${page} primary favicon`);
    assert.equal((html.match(/href="https:\/\/worlddiscoverydata\.com\/favicon\.ico"/g) || []).length, 0, `${page} stale ICO fallback`);
    assert.match(html, new RegExp(`rel="icon" href="${origin.replaceAll('.', '\\.')}/favicon\\.svg" type="image/svg\\+xml" data-wd-search-branding="primary"`));
    assert.doesNotMatch(html, /rel="alternate icon"[^>]*favicon\.ico/i);
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
