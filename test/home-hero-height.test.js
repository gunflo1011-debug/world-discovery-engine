import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

const root = new URL('../site/', import.meta.url);

test('homepage discovery hero stays deliberately more compact than the generic hero', async () => {
  const css = await readFile(new URL('styles.css', root), 'utf8');

  assert.match(css, /\.discovery-hero\{[^}]*padding:68px 0 54px[^}]*\}/, 'desktop discovery hero should use the compact audited spacing');
  assert.match(css, /@media\(max-width:760px\)[\s\S]*?\.discovery-hero\{padding:44px 0 36px\}/, 'mobile discovery hero should avoid consuming most of the first viewport');
  assert.match(css, /\.discovery-search\{[^}]*margin:24px auto 0[^}]*\}/, 'homepage search should sit closer to the hero copy');
});
