import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const generatorUrl = new URL('../scripts/build-internet-use-regions.mjs', import.meta.url);
const samplePageUrl = new URL('../site/indicators/internet-use/region/lcn/index.html', import.meta.url);

const legacyBranding = /World Discovery Data|World Discovery Engine/;

test('regional internet-use generator emits only current World Discovery branding', async () => {
  const source = await readFile(generatorUrl, 'utf8');
  assert.doesNotMatch(source, legacyBranding);
  assert.match(source, /\| World Discovery`/);
  assert.match(source, /name: 'World Discovery'/);
});

test('built regional internet-use page contains no legacy World Discovery branding', async () => {
  const html = await readFile(samplePageUrl, 'utf8');
  assert.doesNotMatch(html, legacyBranding);
  assert.match(html, /World Discovery/);
});
