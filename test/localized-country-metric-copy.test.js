import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const site = new URL('../site/', import.meta.url);
const translations = JSON.parse(await readFile(new URL('i18n/catalog-translations.json', site), 'utf8'));
const catalog = JSON.parse(await readFile(new URL('data/wdi/index.json', site), 'utf8'));
const englishNames = Object.fromEntries((catalog.indicators ?? []).map((item) => [item.slug, item.name]));

async function pages(locale) {
  const dir = new URL(`${locale.toLowerCase()}/countries/`, site);
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => new URL(`${entry.name}/index.html`, dir));
}

test('localized country generator consumes the shared hydrated translation source', async () => {
  const hydrate = await readFile(new URL('scripts/hydrate-localizations.mjs', root), 'utf8');
  const generator = await readFile(new URL('scripts/build-localized-country-hubs.mjs', root), 'utf8');
  const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
  const build = pkg.scripts.build;

  assert.match(hydrate, /catalog-translations\.json/);
  assert.match(hydrate, /indicatorNames/);
  assert.match(hydrate, /unitNames/);
  assert.match(generator, /cfg\.indicatorNames\?\.\[m\.slug\]/);
  assert.match(generator, /cfg\.unitNames\?\.\[m\.unit\]/);
  assert.ok(build.indexOf('hydrate-localizations.mjs') < build.indexOf('build-localized-country-hubs.mjs'));
  assert.ok(!build.includes('finalize-localized-country-copy.mjs'));
});

test('released country profiles use localized indicator names and units without a repair pass', async () => {
  for (const locale of ['de', 'es', 'fr', 'zh-Hans']) {
    const t = translations[locale];
    const files = await pages(locale);
    assert.ok(files.length > 0, `${locale} should generate country profiles`);

    for (const file of files.slice(0, 8)) {
      const html = await readFile(file, 'utf8');

      for (const [slug, localized] of Object.entries(t.indicatorNames ?? {})) {
        const english = englishNames[slug];
        if (!english || english === localized) continue;
        assert.ok(!html.includes(`href=\"../../data/${slug}/\">${english}</a>`), `${locale} must not expose English indicator label ${english}`);
      }

      for (const [english, localized] of Object.entries(t.units ?? {})) {
        if (english === localized) continue;
        assert.ok(!html.includes(`<small>${english}</small>`), `${locale} must not expose English unit ${english}`);
        assert.ok(!html.includes(`<p class=\"muted\">${english}</p>`), `${locale} must not expose English featured unit ${english}`);
      }
    }
  }
});
