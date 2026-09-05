import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const englishFallbacks = /Open in English|Auf Englisch öffnen|Abrir en inglés|Ouvrir en anglais|用英语打开/;

test('configured incomplete localized surfaces remain previews, not full search-language equivalents', async () => {
  const [localesRaw, catalogRaw, sitemap, englishHome] = await Promise.all([
    read('site/i18n/locales.json'),
    read('site/data/wdi/index.json'),
    read('site/sitemap.xml'),
    read('site/index.html')
  ]);
  const config = JSON.parse(localesRaw);
  const catalog = JSON.parse(catalogRaw);
  const slugs = (catalog.indicators ?? []).map((item) => item.slug);
  const incomplete = Object.entries(config.locales).filter(([locale, cfg]) =>
    locale !== config.defaultLocale && cfg.path && (cfg.fullSiteReady !== true || slugs.some((slug) => !cfg.indicatorNames?.[slug]))
  );

  for (const [locale, cfg] of incomplete) {
    const translated = slugs.filter((slug) => cfg.indicatorNames?.[slug]).length;
    assert.equal(translated, slugs.length, `${locale} should retain complete published-indicator translations while full-site work continues`);
    assert.notEqual(cfg.fullSiteReady, true, `${locale} must not claim full-site readiness before all required sections exist`);

    const [localizedHome, localizedData] = await Promise.all([
      read(`site/${cfg.path}/index.html`),
      read(`site/${cfg.path}/data/index.html`)
    ]);
    assert.match(localizedData, /<meta name="robots" content="noindex,follow">/, `${locale} catalog must be noindex,follow while incomplete`);
    assert.match(localizedData, /data-locale-preview="true"/, `${locale} catalog must disclose preview status`);
    assert.ok(localizedHome.includes(`href="/${cfg.path}/countries/"`), `${locale} home must keep users in the localized country directory`);
    assert.doesNotMatch(localizedHome, englishFallbacks, `${locale} home must not describe its localized country directory as English-only`);
    assert.doesNotMatch(sitemap, new RegExp(`<loc>https://worlddiscoverydata\\.com/${cfg.path}/`), `${locale} preview URLs must not be in sitemap`);

    const escapedLang = cfg.htmlLang.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const alternateHreflang = new RegExp(`<link\\s+[^>]*rel=["']alternate["'][^>]*hreflang=["']${escapedLang}["']`, 'i');
    assert.doesNotMatch(englishHome, alternateHreflang, `${locale} must not be advertised as an equivalent hreflang target`);
  }
});
