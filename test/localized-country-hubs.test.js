import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const config = JSON.parse(await readFile(new URL('i18n/locales.json', siteRoot), 'utf8'));

const cases = [
  ['de','de','de','Die Welt Land für Land und Territorium für Territorium entdecken.','Land, Territorium oder Code','Bevölkerung insgesamt','Wichtige Indikatoren','Länder- und Territorienprofile','Deutschland'],
  ['es','es','es','Explora el mundo país por país y territorio por territorio.','País, territorio o código','Población total','Indicadores clave','perfiles de países y territorios','Alemania'],
  ['fr','fr','fr','Explorez le monde pays par pays et territoire par territoire.','Pays, territoire ou code','Population totale','Indicateurs clés','profils de pays et territoires','Allemagne'],
  ['zh-Hans','zh-hans','zh-Hans','逐个国家和地区探索世界。','国家、地区或代码','总人口','关键指标','国家和地区资料','德国']
];

for (const [locale,path,lang,hero,searchLabel,population,key,entityLabel,germanyName] of cases) {
  test(`${lang} country directory and profile match the configured locale release state`, async () => {
    const directory = await readFile(new URL(`${path}/countries/index.html`, siteRoot), 'utf8');
    const germany = await readFile(new URL(`${path}/countries/deu/index.html`, siteRoot), 'utf8');
    const released = config.locales[locale]?.fullSiteReady === true;

    assert.match(directory, new RegExp(`<html lang="${lang}">`));
    assert.ok(directory.includes(hero));
    assert.ok(directory.includes(searchLabel));
    assert.ok(directory.includes(entityLabel));
    assert.ok(directory.includes(`>${germanyName}</a>`));
    assert.ok(directory.includes('id="country-search"'));
    assert.ok(directory.includes('id="region-filter"'));

    assert.match(germany, new RegExp(`<html lang="${lang}">`));
    assert.ok(germany.includes(`<h1>${germanyName}</h1>`));
    assert.ok(germany.includes(`<title>${germanyName} —`));
    assert.ok(germany.includes(population));
    assert.ok(germany.includes(key));
    assert.ok(germany.includes('id="wd-main-content"'));
    assert.ok(!germany.includes('<h1>Germany</h1>'));
    assert.ok(!germany.includes('<title>Germany —'));
    assert.ok(!germany.includes('Key indicators'));
    assert.ok(!germany.includes('World ranking →'));

    if (released) {
      assert.ok(!directory.includes('data-locale-preview="true"'));
      assert.ok(!directory.includes('noindex,follow'));
      assert.ok(!germany.includes('data-locale-preview="true"'));
      assert.ok(!germany.includes('noindex,follow'));
    } else {
      assert.ok(directory.includes('data-locale-preview="true"'));
      assert.ok(directory.includes('noindex,follow'));
      assert.ok(germany.includes('data-locale-preview="true"'));
      assert.ok(germany.includes('noindex,follow'));
    }
  });
}

test('localized country sitemap exposure follows the English indexed-route policy after release', async () => {
  const sitemap = await readFile(new URL('sitemap.xml', siteRoot), 'utf8');
  const englishDirectoryIndexed = sitemap.includes('https://worlddiscoverydata.com/countries/');

  for (const [locale,path] of cases.map(([locale,path]) => [locale,path])) {
    const present = sitemap.includes(`https://worlddiscoverydata.com/${path}/countries/`);
    if (config.locales[locale]?.fullSiteReady === true) {
      assert.equal(present, englishDirectoryIndexed, `${locale} country directory sitemap exposure must mirror the indexed English equivalent`);
    } else {
      assert.equal(present, false, `${locale} preview country directory must stay out of sitemap`);
    }
  }
});
