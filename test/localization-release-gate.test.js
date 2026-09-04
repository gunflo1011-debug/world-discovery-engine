import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile } from 'node:fs/promises';

const exec = promisify(execFile);
const site = new URL('../site/', import.meta.url);

test('translated indicator catalogs remain preview-only until full-site locale coverage is explicitly ready', async () => {
  await exec(process.execPath, ['scripts/hydrate-localizations.mjs']);
  await exec(process.execPath, ['scripts/build-localized-entrypoints.mjs']);
  await exec(process.execPath, ['scripts/guard-incomplete-locales.mjs']);

  const config = JSON.parse(await readFile(new URL('i18n/locales.json', site), 'utf8'));
  const catalog = JSON.parse(await readFile(new URL('data/wdi/index.json', site), 'utf8'));
  const sitemap = await readFile(new URL('sitemap.xml', site), 'utf8');
  const englishHome = await readFile(new URL('index.html', site), 'utf8');

  for (const locale of ['de', 'es', 'fr', 'zh-Hans']) {
    const cfg = config.locales[locale];
    const translated = catalog.indicators.filter((item) => cfg.indicatorNames?.[item.slug]).length;
    assert.equal(translated, catalog.indicators.length, `${locale} should retain complete indicator translations`);
    assert.notEqual(cfg.fullSiteReady, true, `${locale} must not claim full-site readiness before all required sections exist`);

    const home = await readFile(new URL(`${cfg.path}/index.html`, site), 'utf8');
    assert.match(home, /<meta name="robots" content="noindex,follow">/);
    assert.match(home, /data-locale-preview="true"/);
    assert.doesNotMatch(sitemap, new RegExp(`<loc>https://worlddiscoverydata\\.com/${cfg.path}/`));
    assert.doesNotMatch(englishHome, new RegExp(`hreflang="${cfg.htmlLang}"`));
  }
});
