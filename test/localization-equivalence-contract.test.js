import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const execFileAsync = promisify(execFile);
const SITE = path.resolve('site');
const ORIGIN = 'https://worlddiscoverydata.com';
const config = JSON.parse(await readFile(path.join(SITE, 'i18n/locales.json'), 'utf8'));
const released = Object.entries(config.locales).filter(([key, locale]) => key === config.defaultLocale || locale.fullSiteReady);

const routes = [
  'index.html',
  'data/internet-use/index.html',
  'countries/deu/index.html',
];

const localeFile = (key, route) => path.join(SITE, ...(config.locales[key].path ? [config.locales[key].path] : []), ...route.split('/'));
const suffixFor = (route) => route === 'index.html' ? '' : route.endsWith('/index.html') ? route.slice(0, -'index.html'.length) : route;
const publicUrl = (key, route) => {
  const localePath = config.locales[key].path;
  const prefix = localePath ? `/${localePath}/` : '/';
  return `${ORIGIN}${prefix}${suffixFor(route)}`;
};

// Earlier contract tests intentionally rebuild subsets of the generated site. Recreate
// the real release surface once here so this contract measures final-build output,
// not intermediate state left behind by another test.
await execFileAsync('npm', ['run', 'build']);

for (const route of routes) {
  test(`final build keeps reciprocal locale signals for ${route}`, async () => {
    const supported = [];
    for (const [key, locale] of released) {
      try {
        await access(localeFile(key, route));
        supported.push([key, locale]);
      } catch {}
    }

    assert.equal(supported.length, released.length, `${route} must genuinely exist in every released locale before this contract advertises five-way equivalence`);
    const expectedAlternates = new Map(supported.map(([key, locale]) => [locale.htmlLang, publicUrl(key, route)]));
    expectedAlternates.set('x-default', publicUrl(config.defaultLocale, route));

    for (const [key, locale] of supported) {
      const html = await readFile(localeFile(key, route), 'utf8');
      const alternatePairs = [...html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)">/g)]
        .map((match) => [match[1], match[2]]);
      assert.deepEqual(new Map(alternatePairs), expectedAlternates, `${key}:${route} hreflang set must match released route equivalence`);

      const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
      assert.equal(canonical, publicUrl(key, route), `${key}:${route} must self-canonicalize`);

      const switcherBlock = html.match(/<div class="wd-language-options">([\s\S]*?)<\/div>/)?.[1] ?? '';
      const switcherPairs = [...switcherBlock.matchAll(/<a\s+data-wd-language-link\s+href="([^"]+)"\s+hreflang="([^"]+)"/g)]
        .map((match) => [match[2], `${ORIGIN}${match[1]}`]);
      const expectedSwitcher = new Map(supported.map(([targetKey, targetLocale]) => [targetLocale.htmlLang, publicUrl(targetKey, route)]));
      assert.deepEqual(new Map(switcherPairs), expectedSwitcher, `${key}:${route} language switcher must preserve equivalent-route destinations`);

      assert.match(html, new RegExp(`<html[^>]+lang="${locale.htmlLang.replace('-', '\\-')}"`, 'i'), `${key}:${route} must retain locale html lang`);
    }
  });
}
