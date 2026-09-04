import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const CASES = [
  ['de', 'de', 'Weltdaten entdecken', 'Möglichkeiten zum Entdecken', 'Datenstatus ansehen (derzeit auf Englisch)', 'Entdecken'],
  ['es', 'es', 'Explorar datos mundiales', 'Formas de explorar', 'Ver el estado de los datos (actualmente en inglés)', 'Explorar'],
  ['fr', 'fr', 'Explorer les données mondiales', 'Façons d’explorer', 'Voir l’état des données (actuellement en anglais)', 'Explorer'],
  ['zh-hans', 'zh-Hans', '探索全球数据', '探索方式', '查看数据状态（当前仅提供英文版）', '探索']
];

test('localized Explore pages are language-specific, canonical and routed through the locale-aware shell', async () => {
  for (const [path, lang, title, section, statusText, navLabel] of CASES) {
    const html = await readFile(new URL(`../site/${path}/explore/index.html`, import.meta.url), 'utf8');
    assert.match(html, new RegExp(`<html lang="${lang}">`));
    assert.match(html, new RegExp(`<link rel="canonical" href="https://worlddiscoverydata\\.com/${path}/explore/">`));
    assert.match(html, new RegExp(title));
    assert.match(html, new RegExp(section));
    assert.match(html, new RegExp(statusText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(html, new RegExp(`data-wd-shell-locale="${path}"`));
    assert.match(html, new RegExp(`href="(?:\\.\\./)*explore/" aria-current="page">${navLabel}<\\/a>`));
    assert.doesNotMatch(html, /Start with a question, not a database code|Ways to explore|Understand the data|Browse the data catalog/);
  }
});

test('production build wires localized Explore before the shared shell', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  const build = pkg.scripts.build;
  const localized = build.indexOf('node scripts/build-localized-explore.mjs');
  const shell = build.indexOf('node scripts/apply-shared-site-shell.mjs');
  assert.ok(localized >= 0, 'localized Explore builder must run in production build');
  assert.ok(shell > localized, 'shared shell must run after localized Explore builder');
});
