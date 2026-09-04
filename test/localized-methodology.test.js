import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const site = new URL('../site/', import.meta.url);
const run = (script) => execFileSync(process.execPath, [script], { cwd: root, stdio: 'pipe' });

test('English methodology uses production wording without MVP/demo or legacy-domain language', async () => {
  const html = await readFile(new URL('methodology/index.html', site), 'utf8');
  assert.match(html, /<title>Methodology — World Discovery<\/title>/);
  assert.match(html, /https:\/\/worlddiscoverydata\.com\/methodology\//);
  assert.match(html, /Official data, explicit years, reproducible comparisons\./);
  assert.doesNotMatch(html, /\bMVP\b/i);
  assert.doesNotMatch(html, /demo values/i);
  assert.doesNotMatch(html, /gunflo1011-debug\.github\.io/i);
  assert.doesNotMatch(html, /World Discovery Engine/);
});

test('localized methodology pages are language-specific preview equivalents with locale-internal shell links', async () => {
  run('scripts/build-localized-methodology.mjs');
  run('scripts/apply-shared-site-shell.mjs');

  const cases = [
    ['de', 'de', 'Methodik', 'Offizielle Daten, klare Jahre', 'Über World Discovery'],
    ['es', 'es', 'Metodología', 'Datos oficiales, años explícitos', 'Acerca de World Discovery'],
    ['fr', 'fr', 'Méthodologie', 'Données officielles, années explicites', 'À propos de World Discovery'],
    ['zh-hans', 'zh-Hans', '方法', '官方数据、明确年份、可复现比较', '关于 World Discovery'],
  ];

  for (const [path, lang, label, headline, navLabel] of cases) {
    const html = await readFile(new URL(`${path}/methodology/index.html`, site), 'utf8');
    assert.match(html, new RegExp(`<html lang="${lang}"`));
    assert.ok(html.includes(label), `${path} methodology label should be localized`);
    assert.ok(html.includes(headline), `${path} methodology headline should be localized`);
    assert.ok(html.includes(`https://worlddiscoverydata.com/${path}/methodology/`));
    assert.ok(html.includes(`href="./">${navLabel}</a>`), `${path} shared shell should keep Methodology inside locale`);
    assert.doesNotMatch(html, /Every claim should be reproducible|MVP rule|demo values|World Discovery Engine/);
  }
});
