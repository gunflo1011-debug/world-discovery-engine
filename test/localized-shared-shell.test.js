import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const site = new URL('../site/', import.meta.url);

const CASES = [
  ['de', 'Startseite', 'Daten', 'Länder · Auf Englisch öffnen', 'Vergleichen · Auf Englisch öffnen', 'Zum Hauptinhalt springen'],
  ['es', 'Inicio', 'Datos', 'Países · Abrir en inglés', 'Comparar · Abrir en inglés', 'Saltar al contenido principal'],
  ['fr', 'Accueil', 'Données', 'Pays · Ouvrir en anglais', 'Comparer · Ouvrir en anglais', 'Aller au contenu principal'],
  ['zh-hans', '首页', '数据', '国家 · 用英语打开', '比较 · 用英语打开', '跳到主要内容']
];

test('shared shell keeps localized entrypoints in-language and discloses English-only routes', async () => {
  execFileSync(process.execPath, ['scripts/apply-shared-site-shell.mjs'], { cwd: root, stdio: 'pipe' });

  for (const [locale, homeLabel, dataLabel, countryLabel, compareLabel, skipLabel] of CASES) {
    const home = await readFile(new URL(`${locale}/index.html`, site), 'utf8');
    const data = await readFile(new URL(`${locale}/data/index.html`, site), 'utf8');

    for (const html of [home, data]) {
      assert.match(html, new RegExp(`data-wd-shell-locale="${locale}"`));
      assert.ok(html.includes(`>${homeLabel}</a>`), `${locale} shell should localize Home`);
      assert.ok(html.includes(`>${dataLabel}</a>`), `${locale} shell should localize Data`);
      assert.ok(html.includes(`>${countryLabel}</a>`), `${locale} shell should disclose English Countries`);
      assert.ok(html.includes(`>${compareLabel}</a>`), `${locale} shell should disclose English Compare`);
      assert.ok(html.includes(`>${skipLabel}</a>`), `${locale} skip link should be localized`);
      assert.ok(!html.includes('>Home</a>'), `${locale} shell must not leave English Home`);
      assert.ok(!html.includes('>Countries</a>'), `${locale} shell must not leave undisclosed English Countries`);
      assert.ok(!html.includes('>Compare</a>'), `${locale} shell must not leave undisclosed English Compare`);
    }

    assert.ok(home.includes(`href="./data/">${dataLabel}</a>`), `${locale} home must keep Data inside the locale`);
    assert.ok(data.includes(`href="../">${homeLabel}</a>`), `${locale} data must keep Home inside the locale`);
  }
});
