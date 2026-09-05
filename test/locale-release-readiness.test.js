import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const config = JSON.parse(await readFile(new URL('i18n/locales.json', siteRoot), 'utf8'));

const localeCases = {
  de: {
    path: 'de', lang: 'de', shell: ['Daten', 'Länder', 'Vergleichen'],
    localTokens: ['Bevölkerung', 'Methodik', 'Datenschutz'],
    forbidden: ['Open in English', 'currently in English']
  },
  es: {
    path: 'es', lang: 'es', shell: ['Datos', 'Países', 'Comparar'],
    localTokens: ['Población', 'Metodología', 'Privacidad'],
    forbidden: ['Open in English', 'currently in English']
  },
  fr: {
    path: 'fr', lang: 'fr', shell: ['Données', 'Pays', 'Comparer'],
    localTokens: ['Population', 'Méthodologie', 'Confidentialité'],
    forbidden: ['Open in English', 'currently in English']
  },
  'zh-Hans': {
    path: 'zh-hans', lang: 'zh-Hans', shell: ['数据', '国家', '比较'],
    localTokens: ['人口', '方法', '隐私'],
    forbidden: ['Open in English', 'currently in English']
  }
};

const representativeRoutes = [
  'index.html',
  'data/index.html',
  'data/population/index.html',
  'data/life-expectancy/index.html',
  'countries/index.html',
  'countries/deu/index.html',
  'compare/index.html',
  'methodology/index.html',
  'sources/index.html',
  'status/index.html',
  'explore/index.html',
  'explore/history.html',
  'impressum/index.html',
  'datenschutz/index.html'
];

for (const [locale, expected] of Object.entries(localeCases)) {
  test(`${locale} has the complete representative release surface`, async () => {
    const cfg = config.locales[locale];
    assert.ok(cfg, `missing locale config for ${locale}`);
    assert.equal(cfg.path, expected.path);

    for (const route of representativeRoutes) {
      const url = new URL(`${expected.path}/${route}`, siteRoot);
      await access(url);
      const html = await readFile(url, 'utf8');

      assert.match(html, new RegExp(`<html[^>]+lang="${expected.lang}"`), `${locale}/${route}: wrong html lang`);
      assert.ok(
        html.includes(`https://worlddiscoverydata.com/${expected.path}/`) || route === 'explore/history.html',
        `${locale}/${route}: missing locale canonical/url context`
      );
      for (const phrase of expected.forbidden) {
        assert.ok(!html.includes(phrase), `${locale}/${route}: leaked English fallback copy: ${phrase}`);
      }
    }
  });

  test(`${locale} representative pages retain localized navigation and content`, async () => {
    const home = await readFile(new URL(`${expected.path}/index.html`, siteRoot), 'utf8');
    const data = await readFile(new URL(`${expected.path}/data/population/index.html`, siteRoot), 'utf8');
    const methodology = await readFile(new URL(`${expected.path}/methodology/index.html`, siteRoot), 'utf8');
    const privacy = await readFile(new URL(`${expected.path}/datenschutz/index.html`, siteRoot), 'utf8');
    const combined = `${home}\n${data}\n${methodology}\n${privacy}`;

    for (const label of expected.shell) {
      assert.ok(combined.includes(label), `${locale}: missing localized shell label ${label}`);
    }
    for (const token of expected.localTokens) {
      assert.ok(combined.includes(token), `${locale}: missing localized content token ${token}`);
    }
  });

  test(`${locale} remains guarded until explicit full-site release approval`, async () => {
    const cfg = config.locales[locale];
    const home = await readFile(new URL(`${expected.path}/index.html`, siteRoot), 'utf8');
    if (cfg.fullSiteReady === true) {
      assert.ok(!home.includes('noindex,follow'), `${locale}: released locale must not remain noindex`);
      assert.ok(!home.includes('data-locale-preview="true"'), `${locale}: released locale must not carry preview banner`);
    } else {
      assert.ok(home.includes('noindex,follow'), `${locale}: incomplete locale must remain noindex`);
      assert.ok(home.includes('data-locale-preview="true"'), `${locale}: incomplete locale must retain preview disclosure`);
    }
  });
}
