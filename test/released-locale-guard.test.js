import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile, copyFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));

const runNode = (script, cwd) => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [script], { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (chunk) => { stdout += chunk; });
  child.stderr.on('data', (chunk) => { stderr += chunk; });
  child.on('error', reject);
  child.on('close', (code) => code === 0
    ? resolve({ stdout, stderr })
    : reject(new Error(`guard exited ${code}\n${stdout}\n${stderr}`)));
});

const releasedLocales = {
  de: { path: 'de', htmlLang: 'de', nativeName: 'Deutsch', indicatorName: 'Bevölkerung insgesamt' },
  es: { path: 'es', htmlLang: 'es', nativeName: 'Español', indicatorName: 'Población total' },
  fr: { path: 'fr', htmlLang: 'fr', nativeName: 'Français', indicatorName: 'Population totale' },
  'zh-Hans': { path: 'zh-hans', htmlLang: 'zh-Hans', nativeName: '简体中文', indicatorName: '总人口' }
};

test('full-site-ready locales keep reciprocal hreflang, sitemap entries and indexability', async () => {
  const root = await mkdtemp(join(tmpdir(), 'wd-released-locales-'));
  try {
    await mkdir(join(root, 'scripts'), { recursive: true });
    await mkdir(join(root, 'site', 'i18n'), { recursive: true });
    await mkdir(join(root, 'site', 'data', 'wdi'), { recursive: true });
    await copyFile(join(repoRoot, 'scripts', 'guard-incomplete-locales.mjs'), join(root, 'scripts', 'guard-incomplete-locales.mjs'));

    const config = {
      defaultLocale: 'en',
      locales: {
        en: { path: '', htmlLang: 'en', nativeName: 'English', indicatorNames: {} },
        ...Object.fromEntries(Object.entries(releasedLocales).map(([locale, settings]) => [locale, {
          path: settings.path,
          htmlLang: settings.htmlLang,
          nativeName: settings.nativeName,
          fullSiteReady: true,
          indicatorNames: { population: settings.indicatorName }
        }]))
      }
    };
    await writeFile(join(root, 'site', 'i18n', 'locales.json'), JSON.stringify(config));
    await writeFile(join(root, 'site', 'data', 'wdi', 'index.json'), JSON.stringify({ indicators: [{ slug: 'population' }] }));

    const alternateLinks = [
      '<link rel="alternate" hreflang="en" href="https://worlddiscoverydata.com/">',
      ...Object.values(releasedLocales).map(({ htmlLang, path }) => `<link rel="alternate" hreflang="${htmlLang}" href="https://worlddiscoverydata.com/${path}/">`)
    ].join('');
    const languageLinks = Object.values(releasedLocales)
      .map(({ path, nativeName }) => `<a href="/${path}/">${nativeName}</a>`)
      .join('');
    const english = `<!doctype html><html lang="en"><head><link rel="canonical" href="https://worlddiscoverydata.com/">${alternateLinks}</head><body><header>${languageLinks}</header></body></html>`;
    await writeFile(join(root, 'site', 'index.html'), english);

    const localizedBefore = new Map();
    for (const [locale, settings] of Object.entries(releasedLocales)) {
      await mkdir(join(root, 'site', settings.path), { recursive: true });
      const html = `<!doctype html><html lang="${settings.htmlLang}"><head><link rel="canonical" href="https://worlddiscoverydata.com/${settings.path}/">${alternateLinks}</head><body><header><a href="/">English</a></header></body></html>`;
      localizedBefore.set(locale, html);
      await writeFile(join(root, 'site', settings.path, 'index.html'), html);
    }

    const sitemapEntries = [
      '<url><loc>https://worlddiscoverydata.com/</loc></url>',
      ...Object.values(releasedLocales).map(({ path }) => `<url><loc>https://worlddiscoverydata.com/${path}/</loc></url>`)
    ].join('');
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset>${sitemapEntries}</urlset>\n`;
    await writeFile(join(root, 'site', 'sitemap.xml'), sitemap);

    const { stdout } = await runNode(join(root, 'scripts', 'guard-incomplete-locales.mjs'), root);
    const afterEnglish = await readFile(join(root, 'site', 'index.html'), 'utf8');
    const afterSitemap = await readFile(join(root, 'site', 'sitemap.xml'), 'utf8');

    assert.match(stdout, /Guarded 0 incomplete locales/);
    assert.equal(afterEnglish, english, 'released locales must not have hreflang or language-switch labels rewritten on English');

    for (const [locale, settings] of Object.entries(releasedLocales)) {
      const localized = await readFile(join(root, 'site', settings.path, 'index.html'), 'utf8');
      assert.equal(localized, localizedBefore.get(locale), `${locale} must remain indexable and free of preview rewrites`);
      assert.match(afterEnglish, new RegExp(`hreflang="${settings.htmlLang}" href="https:\\/\\/worlddiscoverydata\\.com\\/${settings.path}\\/"`));
      assert.match(localized, /hreflang="en" href="https:\/\/worlddiscoverydata\.com\/"/);
      assert.doesNotMatch(localized, /noindex,follow|data-locale-preview/);
      assert.match(afterSitemap, new RegExp(`<loc>https:\\/\\/worlddiscoverydata\\.com\\/${settings.path}\\/<\\/loc>`));
      assert.doesNotMatch(afterEnglish, new RegExp(`${settings.nativeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} · (?:Vorschau|Vista previa|Aperçu|预览)`));
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
