import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd(), 'site');

test('build emits a branded, non-indexed 404 with path-safe recovery links', async () => {
  const html = await readFile(resolve(root, '404.html'), 'utf8');

  assert.match(html, /<title>Page not found · World Discovery<\/title>/);
  assert.match(html, /<meta name="robots" content="noindex,follow">/);
  assert.match(html, /data-wd-shared-shell/);
  assert.match(html, /404 · Page not found/);
  assert.match(html, /href="\/"[^>]*>Home<\/a>/);
  assert.match(html, /href="\/data\/"[^>]*>Data catalog<\/a>/);
  assert.match(html, /href="\/countries\/"[^>]*>Countries<\/a>/);
  assert.match(html, /href="\/compare\/"[^>]*>Compare<\/a>/);
  assert.doesNotMatch(html, /href="\.\.?\//);
});

test('404 localizes the full error and recovery surface from the requested locale path', async () => {
  const html = await readFile(resolve(root, '404.html'), 'utf8');

  for (const [path, lang, title, data, countries, compare] of [
    ['de', 'de', 'Seite nicht gefunden', 'Datenkatalog', 'Länder', 'Vergleichen'],
    ['es', 'es', 'Página no encontrada', 'Catálogo de datos', 'Países', 'Comparar'],
    ['fr', 'fr', 'Page introuvable', 'Catalogue de données', 'Pays', 'Comparer'],
    ['zh-hans', 'zh-Hans', '未找到页面', '数据目录', '国家', '比较']
  ]) {
    assert.ok(html.includes(`${path}:{lang:'${lang}'`), `${path}: missing runtime locale definition`);
    assert.ok(html.includes(title), `${path}: missing localized 404 title`);
    assert.ok(html.includes(data), `${path}: missing localized data recovery label`);
    assert.ok(html.includes(countries), `${path}: missing localized countries recovery label`);
    assert.ok(html.includes(compare), `${path}: missing localized compare recovery label`);
  }

  assert.match(html, /location\.pathname\.split\('\/'\)\.filter\(Boolean\)\[0\]\?\.toLowerCase\(\)/);
  assert.match(html, /document\.documentElement\.lang=c\.lang/);
  assert.match(html, /const prefix=key==='en'\?'':\('\/'\+key\)/);
  assert.match(html, /a\.href=prefix\+\(route\?\('\/'\+route\+'\/'\):'\/'\)/);
});

test('404 remains outside the sitemap', async () => {
  const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
  assert.doesNotMatch(sitemap, /\/404(?:\.html)?(?:<|\/)/);
});
