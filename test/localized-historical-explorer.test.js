import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const cases = [
  ['de','de','Länder im Zeitverlauf vergleichen','Länder vergleichen','Länder durchsuchen'],
  ['es','es','Compara países a lo largo del tiempo','Comparar países','Buscar países'],
  ['fr','fr','Comparez les pays dans le temps','Comparer les pays','Rechercher des pays'],
  ['zh-hans','zh-Hans','按时间比较国家','比较国家','搜索国家']
];

test('localized historical explorer is a complete locale-aware interactive surface', async () => {
  for (const [path,lang,h1,compare,search] of cases) {
    const html = await readFile(new URL(`../site/${path}/explore/history.html`, import.meta.url),'utf8');
    assert.match(html,new RegExp(`<html lang="${lang}">`));
    assert.match(html,new RegExp(`<link rel="canonical" href="https://worlddiscoverydata.com/${path}/explore/history.html">`));
    assert.match(html,new RegExp(`<h1>${h1}</h1>`));
    assert.match(html,new RegExp(`>${compare}</button>`));
    assert.match(html,new RegExp(`placeholder="${search}"`));
    assert.match(html,/data-wd-shared-shell/);
    assert.match(html,/window\.WD_HISTORY_I18N=/);
    assert.match(html,/src="\.\.\/\.\.\/explore\/history\.js"/);
    assert.doesNotMatch(html,/>Compare countries</);
    assert.doesNotMatch(html,/>Search countries</);
    assert.doesNotMatch(html,/>From year</);
    assert.doesNotMatch(html,/>To year</);
    assert.doesNotMatch(html,/>Exact values for this comparison</);
  }
});

test('historical explorer runtime localizes dynamic states and uses locale-aware formatting', async () => {
  const js = await readFile(new URL('../site/explore/history.js', import.meta.url),'utf8');
  assert.match(js,/window\.WD_HISTORY_I18N/);
  assert.match(js,/Intl\.NumberFormat\(locale\)/);
  assert.match(js,/Intl\.DisplayNames\(\[locale\]/);
  assert.match(js,/i18n\.indicatorNames/);
  assert.match(js,/i18n\.unitNames/);
  assert.match(js,/statusEl\.textContent=i18n\.choose/);
  assert.match(js,/statusEl\.textContent=i18n\.none/);
  assert.match(js,/statusEl\.textContent=i18n\.unavailable/);
  assert.match(js,/fetch\(`\$\{root\}data\/wdi\/history-index\.json`\)/);
});
