import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../site/', import.meta.url);
const locales = [
  ['de','de','Datenstatus — World Discovery','Aktuell verifizierte Abdeckung'],
  ['es','es','Estado de los datos — World Discovery','Cobertura verificada actual'],
  ['fr','fr','État des données — World Discovery','Couverture vérifiée actuelle'],
  ['zh-hans','zh-Hans','数据状态 — World Discovery','当前已验证覆盖范围']
];

test('localized status pages are language-specific trust surfaces with stable canonicals', async () => {
  for (const [path, lang, title, heading] of locales) {
    const html = await readFile(new URL(`${path}/status/index.html`, root), 'utf8');
    assert.match(html, new RegExp(`<html lang="${lang}">`));
    assert.match(html, new RegExp(`<title>${title}</title>`));
    assert.match(html, new RegExp(`<link rel="canonical" href="https://worlddiscoverydata\\.com/${path}/status/">`));
    assert.match(html, new RegExp(`<h1>${heading}</h1>`));
    assert.match(html, /href="\.\.\/data\/"/);
    assert.match(html, /href="\.\.\/countries\/"/);
    assert.match(html, /href="\.\.\/compare\/"/);
    assert.match(html, /href="\.\.\/methodology\/"/);
    assert.match(html, /href="\.\.\/sources\/"/);
    assert.match(html, /data-wd-shell-locale=/);
    assert.doesNotMatch(html, /Current verified coverage|What “verified” means here|Current public surfaces|Limits to keep in mind/);
  }
});

test('localized status is built before the shared shell and SEO finalizers', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  const build = pkg.scripts.build;
  const status = build.indexOf('node scripts/build-localized-status.mjs');
  const shell = build.indexOf('node scripts/apply-shared-site-shell.mjs');
  const seo = build.indexOf('node scripts/finalize-seo-discovery.mjs');
  assert.ok(status > -1 && shell > status && seo > shell);
});
