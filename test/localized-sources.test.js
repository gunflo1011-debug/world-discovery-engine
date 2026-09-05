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
    ['de','de','Quellen und Herkunft','Wisse, woher jeder veröffentlichte Wert stammt.',['Nachweis-JSON','KI-Index-JSON','Internetnutzung','BIP pro Kopf']],
    ['es','es','Fuentes y procedencia','Conoce el origen de cada valor publicado.',['JSON de evidencia','JSON del índice para IA','Uso de Internet','PIB per cápita']],
    ['fr','fr','Sources et provenance','Sachez d’où vient chaque valeur publiée.',['JSON des preuves','JSON de l’index IA','Utilisation d’Internet','PIB par habitant']],
    ['zh-hans','zh-Hans','来源与数据溯源','了解每个已发布数值来自哪里。',['证据 JSON','AI 索引 JSON','互联网使用率','人均 GDP']]
  ];
  for (const [path,lang,label,headline,machineLabels] of cases) {
    const html = await readFile(new URL(`${path}/sources/index.html`, site), 'utf8');
    assert.match(html, new RegExp(`<html lang="${lang}"`));
    assert.ok(html.includes(label));
    assert.ok(html.includes(headline));
    assert.ok(html.includes(`https://worlddiscoverydata.com/${path}/sources/`));
    assert.ok(html.includes('href="../methodology/"'));
    assert.ok(html.includes('href="../status/"'), `${path}: status trust link must remain inside the active locale`);
    assert.ok(html.includes('href="../data/"'));
    for (const machineLabel of machineLabels) assert.ok(html.includes(machineLabel), `${path}: missing localized machine-readable label ${machineLabel}`);
    assert.doesNotMatch(html, /<h3>Internet Use<\/h3>|<h3>GDP per capita<\/h3>|>Evidence JSON<|>AI index JSON</, `${path}: released sources page must not leave machine-readable cards in English`);
    assert.doesNotMatch(html, /href="\.\.\/\.\.\/status\/"/, `${path}: status trust link must not escape to the English root status page`);
    assert.doesNotMatch(html, /status[^<]*·\s*English|datos[^<]*·\s*English|données[^<]*·\s*English|状态[^<]*·\s*English/i, `${path}: released sources page must not advertise its status link as English-only`);
    assert.match(html, /data-wd-shell-locale=/);
    assert.doesNotMatch(html, /World Discovery Data|three verified product families|MVP rule|demo values/i);
  }
});