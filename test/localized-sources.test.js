import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const site = new URL('../site/', import.meta.url);
const run = (script) => execFileSync(process.execPath, [script], { cwd: root, stdio: 'pipe' });

test('localized sources pages preserve locale, production branding and locale-internal trust links', async () => {
  run('scripts/build-localized-sources.mjs');
  run('scripts/apply-shared-site-shell.mjs');

  const cases = [
    ['de','de','Quellen und Herkunft','Wisse, woher jeder veröffentlichte Wert stammt.','Methodik'],
    ['es','es','Fuentes y procedencia','Conoce el origen de cada valor publicado.','Metodología'],
    ['fr','fr','Sources et provenance','Sachez d’où vient chaque valeur publiée.','Méthodologie'],
    ['zh-hans','zh-Hans','来源与数据溯源','了解每个已发布数值来自哪里。','方法']
  ];

  for (const [path,lang,label,headline,methodology] of cases) {
    const html = await readFile(new URL(`${path}/sources/index.html`, site), 'utf8');
    assert.match(html, new RegExp(`<html lang="${lang}"`));
    assert.ok(html.includes(label));
    assert.ok(html.includes(headline));
    assert.ok(html.includes(`https://worlddiscoverydata.com/${path}/sources/`));
    assert.match(html, new RegExp(`href="\.\.\/methodology\/"[^>]*>${methodology}<\/a>`));
    assert.match(html, /data-wd-shell-locale=/);
    assert.doesNotMatch(html, /World Discovery Data|three verified product families|MVP rule|demo values/i);
  }
});
