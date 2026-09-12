import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const sourceUrl = new URL('../scripts/build-wdi-country-compare.mjs', import.meta.url);
const localizedSourceUrl = new URL('../scripts/build-localized-country-compare.mjs', import.meta.url);
const countryActionsUrl = new URL('../scripts/enrich-wdi-country-actions.mjs', import.meta.url);
const countryHubLinkerUrl = new URL('../scripts/link-country-hubs-to-compare.mjs', import.meta.url);
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

test('generated compare navigation keeps missing/null state out of the pathname', async () => {
  const [english, localized, actions, linker, built] = await Promise.all([
    readFile(sourceUrl, 'utf8'),
    readFile(localizedSourceUrl, 'utf8'),
    readFile(countryActionsUrl, 'utf8'),
    readFile(countryHubLinkerUrl, 'utf8'),
    readFile(builtUrl, 'utf8'),
  ]);

  // Exercise the routing behavior used by the generated compare page. Even if a
  // future caller passes missing/null state, URLSearchParams can only place that
  // state in the query; the compare pathname remains fixed.
  const compareUrl = (base, a, b) => new URL(`compare/?${new URLSearchParams({ a, b })}`, base);
  for (const base of ['https://worlddiscoverydata.com/', 'https://worlddiscoverydata.com/de/']) {
    for (const state of [null, undefined, '']) {
      const url = compareUrl(base, state, state);
      assert.match(url.pathname, /\/compare\/$/);
      assert.doesNotMatch(url.pathname, /null|undefined/i);
    }
  }

  // Generated output must use the same query-state contract, not a dynamic
  // pathname. Cover English and localized builders plus both link producers.
  assert.match(english, /new URLSearchParams\(\{a:codeA,b:codeB\}\)/);
  assert.match(localized, /new URLSearchParams\(\{a:codeA,b:codeB\}\)/);
  assert.match(actions, /new URLSearchParams\(\{a:code\}\)/);
  assert.match(linker, /if \(!code\) continue;/);
  assert.match(linker, /compare\/\?a=\$\{encodeURIComponent\(code\)\}/);
  assert.match(built, /history\.replaceState\(null,'','\?'\+new URLSearchParams\(\{a:codeA,b:codeB\}\)\.toString\(\)\)/);

  // Inspect emitted HTML as a final-output guard, including absolute URLs.
  for (const output of [built]) {
    assert.doesNotMatch(output, /(?:https?:\/\/[^"'\s]+)?\/(?:[a-z-]+\/)?compare\/(?:null|undefined)(?:[/?#"'\s]|$)/i);
  }
});
