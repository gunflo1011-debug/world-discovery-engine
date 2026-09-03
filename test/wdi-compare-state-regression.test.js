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

test('country compare formats negative US dollar differences with the sign before the currency symbol', async () => {
  const built = await readFile(builtUrl, 'utf8');
  const match = built.match(/(function fmt\(v,unit\)\{[\s\S]*?\})\nfunction suffix/);

  assert.ok(match, 'built compare formatter should be present');
  const fmt = new Function(`${match[1]}; return fmt;`)();

  assert.equal(fmt(-57794, 'current US$'), '-$57,794');
  assert.equal(fmt(57794, 'current US$'), '$57,794');
  assert.equal(fmt(-1200000, 'current US$'), '-$1.20M');
});
