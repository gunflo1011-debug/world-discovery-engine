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

test('released country profiles use localized indicator names and units', async () => {
  await import('../scripts/finalize-localized-country-copy.mjs');
  // The pass is intentionally idempotent.
  await import(`../scripts/finalize-localized-country-copy.mjs?again=${Date.now()}`);

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
