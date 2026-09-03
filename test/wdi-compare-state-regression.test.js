import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const sourceUrl = new URL('../scripts/build-wdi-country-compare.mjs', import.meta.url);
const builtUrl = new URL('../site/compare/index.html', import.meta.url);

test('country compare keeps swapped country metadata in sync', async () => {
  const source = await readFile(sourceUrl, 'utf8');

  assert.match(source, /function syncInput\(input,side,code\)/);
  assert.match(source, /syncInput\(a,'a',codeA\);syncInput\(b,'b',codeB\);render\(\);a\.focus\(\);/);
  assert.doesNotMatch(source, /a\.value=byCode\[codeA\]\.country;b\.value=byCode\[codeB\]\.country;render\(\);a\.focus\(\);/);
});

test('country compare rejects invalid manual input instead of silently restoring the previous country', async () => {
  const source = await readFile(sourceUrl, 'utf8');

  assert.match(source, /function resolve\(input\).*\|\|null/);
  assert.doesNotMatch(source, /function resolve\(input,fallback\)/);
  assert.match(source, /if\(!c\)\{hint\.textContent='Choose one of the suggested countries\.';return false\}/);
});

test('country compare normalizes valid lowercase query country codes', async () => {
  const source = await readFile(sourceUrl, 'utf8');
  const built = await readFile(builtUrl, 'utf8');

  assert.match(source, /qa=\(q\.get\('a'\)\|\|''\)\.toUpperCase\(\),qb=\(q\.get\('b'\)\|\|''\)\.toUpperCase\(\)/);
  assert.match(built, /Choose one of the suggested countries\./);
  assert.match(built, /function syncInput\(input,side,code\)/);
});
