import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const site = new URL('../site/', import.meta.url);
const run = (script) => execFileSync(process.execPath, [script], { cwd: root, stdio: 'pipe' });

test('localized sources pages preserve locale, branding and locale-internal trust links', async () => {
  run('scripts/build-localized-sources.mjs');
  run('scripts/apply-shared-site-shell.mjs');
  const cases = [
    ['de','de','Quellen und Herkunft','Wisse, woher jeder veröffentlichte Wert stammt.'],
    ['es','es','Fuentes y procedencia','Conoce el origen de cada valor publicado.'],
    ['fr','fr','Sources et provenance','Sachez d’où vient chaque valeur publiée.'],
    ['zh-hans','zh-Hans','来源与数据溯源','了解每个已发布数值来自哪里。']
  ];
  for (const [path,lang,label,headline] of cases) {
    const html = await readFile(new URL(`${path}/sources/index.html`, site), 'utf8');
    assert.match(html, new RegExp(`<html lang="${lang}"`));
    assert.ok(html.includes(label));
    assert.ok(html.includes(headline));
    assert.ok(html.includes(`https://worlddiscoverydata.com/${path}/sources/`));
    assert.ok(html.includes('href="../methodology/"'));
    assert.ok(html.includes('href="../status/"'), `${path}: status trust link must remain inside the active locale`);
    assert.ok(html.includes('href="../data/"'));
    assert.doesNotMatch(html, /href="\.\.\/\.\.\/status\/"/, `${path}: sources page must not escape to the English root status page`);
    assert.doesNotMatch(html, /status[^<]*·\s*English|datos[^<]*·\s*English|données[^<]*·\s*English|状态[^<]*·\s*English/i, `${path}: released sources page must not advertise its status link as English-only`);
    assert.match(html, /data-wd-shell-locale=/);
    assert.doesNotMatch(html, /World Discovery Data|three verified product families|MVP rule|demo values/i);
  }
});
