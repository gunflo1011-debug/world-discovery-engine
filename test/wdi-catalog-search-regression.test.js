import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const sourceUrl = new URL('../scripts/enrich-wdi-catalog-search.mjs', import.meta.url);
const builtUrl = new URL('../site/data/index.html', import.meta.url);

test('catalog filter script stays valid JavaScript', async () => {
  const built = await readFile(builtUrl, 'utf8');
  const script = built.match(/<script id="catalog-filter">([\s\S]*?)<\/script>/)?.[1];

  assert.ok(script, 'catalog filter script should be present in the built data catalog');
  assert.doesNotThrow(() => new Function(script));
});

test('catalog search keeps filtering, ?q state and Clear wired together', async () => {
  const source = await readFile(sourceUrl, 'utf8');
  const built = await readFile(builtUrl, 'utf8');

  assert.match(source, /input\.value=new URLSearchParams\(location\.search\)\.get\('q'\)\|\|''/);
  assert.match(source, /input\.addEventListener\('input',apply\)/);
  assert.match(source, /if\(q\)u\.searchParams\.set\('q',input\.value\.trim\(\)\);else u\.searchParams\.delete\('q'\);history\.replaceState\(null,'',u\)/);
  assert.match(source, /clear\.addEventListener\('click',\(\)=>\{input\.value='';apply\(\);input\.focus\(\)\}\)/);
  assert.match(source, /const apply=\(\)=>\{const q=normalize\(input\.value\)/);

  assert.match(built, /id="indicator-search"/);
  assert.match(built, /id="indicator-clear"/);
  assert.match(built, /id="catalog-filter"/);
  assert.match(built, /new URLSearchParams\(location\.search\)\.get\('q'\)\|\|''/);
  assert.match(built, /clear\.addEventListener\('click'/);
});
