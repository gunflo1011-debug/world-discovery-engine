import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const siteRoot = new URL('../site/', import.meta.url);

const cases = [
  ['de','de','Die Welt Land für Land und Territorium für Territorium entdecken.','Land, Territorium oder Code','Bevölkerung insgesamt','Wichtige Indikatoren','Länder- und Territorienprofile'],
  ['es','es','Explora el mundo país por país y territorio por territorio.','País, territorio o código','Población total','Indicadores clave','perfiles de países y territorios'],
  ['fr','fr','Explorez le monde pays par pays et territoire par territoire.','Pays, territoire ou code','Population totale','Indicateurs clés','profils de pays et territoires'],
  ['zh-hans','zh-Hans','逐个国家和地区探索世界。','国家、地区或代码','总人口','关键指标','国家和地区资料']
];

for (const [path,lang,hero,searchLabel,population,key,entityLabel] of cases) {
  test(`${lang} country directory and profile are localized preview surfaces`, async () => {
    const directory = await readFile(new URL(`${path}/countries/index.html`, siteRoot), 'utf8');
    const germany = await readFile(new URL(`${path}/countries/deu/index.html`, siteRoot), 'utf8');

    assert.match(directory, new RegExp(`<html lang="${lang}">`));
    assert.ok(directory.includes(hero));
    assert.ok(directory.includes(searchLabel));
    assert.ok(directory.includes(entityLabel));
    assert.ok(directory.includes('id="country-search"'));
    assert.ok(directory.includes('id="region-filter"'));
    assert.ok(directory.includes('data-locale-preview="true"'));
    assert.ok(directory.includes('noindex,follow'));

    assert.match(germany, new RegExp(`<html lang="${lang}">`));
    assert.ok(germany.includes(population));
    assert.ok(germany.includes(key));
    assert.ok(germany.includes('id="wd-main-content"'));
    assert.ok(germany.includes('data-locale-preview="true"'));
    assert.ok(germany.includes('noindex,follow'));
    assert.ok(!germany.includes('Key indicators'));
    assert.ok(!germany.includes('World ranking →'));
  });
}

test('localized country pages are not advertised in sitemap while locale coverage is incomplete', async () => {
  const sitemap = await readFile(new URL('sitemap.xml', siteRoot), 'utf8');
  for (const path of ['de','es','fr','zh-hans']) {
    assert.ok(!sitemap.includes(`https://worlddiscoverydata.com/${path}/countries/`));
  }
});
