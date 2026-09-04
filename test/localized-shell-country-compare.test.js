import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const run = (script) => execFileSync(process.execPath, [script], { stdio: 'pipe' });

test('localized shared shell keeps country and compare navigation inside the active locale', async () => {
  run('scripts/hydrate-localizations.mjs');
  run('scripts/build-localized-country-hubs.mjs');
  run('scripts/build-localized-country-compare.mjs');
  run('scripts/apply-shared-site-shell.mjs');

  const cases = [
    ['de', 'Länder', 'Vergleichen', 'Auf Englisch öffnen'],
    ['es', 'Países', 'Comparar', 'Abrir en inglés'],
    ['fr', 'Pays', 'Comparer', 'Ouvrir en anglais'],
    ['zh-hans', '国家', '比较', '用英语打开'],
  ];

  for (const [locale, countriesLabel, compareLabel, englishSuffix] of cases) {
    const countries = await readFile(`site/${locale}/countries/index.html`, 'utf8');
    const compare = await readFile(`site/${locale}/compare/index.html`, 'utf8');

    assert.match(countries, new RegExp(`href="\\.\\/"[^>]*>${countriesLabel}<\\/a>`));
    assert.match(countries, new RegExp(`href="\\.\\.\\/compare/"[^>]*>${compareLabel}<\\/a>`));
    assert.doesNotMatch(countries, new RegExp(`${countriesLabel} · ${englishSuffix}`));
    assert.doesNotMatch(countries, new RegExp(`${compareLabel} · ${englishSuffix}`));

    assert.match(compare, new RegExp(`href="\\.\\.\\/countries/"[^>]*>${countriesLabel}<\\/a>`));
    assert.match(compare, new RegExp(`href="\\.\\/"[^>]*>${compareLabel}<\\/a>`));
    assert.doesNotMatch(compare, new RegExp(`${countriesLabel} · ${englishSuffix}`));
    assert.doesNotMatch(compare, new RegExp(`${compareLabel} · ${englishSuffix}`));
  }
});
