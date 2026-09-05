import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const normalizerUrl = new URL('../scripts/normalize-internet-use-country-branding.mjs', import.meta.url);
const samplePageUrl = new URL('../site/indicators/internet-use/country/hrv/index.html', import.meta.url);
const packageUrl = new URL('../package.json', import.meta.url);
const legacyBranding = /World Discovery Data|World Discovery Engine/;

test('internet-use country branding normalizer removes legacy product names', async () => {
  const source = await readFile(normalizerUrl, 'utf8');
  assert.match(source, /World Discovery Data\|World Discovery Engine/);
  assert.match(source, /replace\(legacyBranding, 'World Discovery'\)/);
});

test('production builds run country branding cleanup after internet-use enrichers', async () => {
  const pkg = JSON.parse(await readFile(packageUrl, 'utf8'));
  assert.match(pkg.scripts.build, /normalize-internet-use-card-semantics\.mjs && node scripts\/normalize-internet-use-country-branding\.mjs/);
  assert.match(pkg.scripts['build:internet-use'], /normalize-internet-use-card-semantics\.mjs && node scripts\/normalize-internet-use-country-branding\.mjs/);
});

test('branding cleanup leaves a representative country page on current World Discovery branding', async () => {
  await import(`${normalizerUrl.href}?test=${Date.now()}`);
  const html = await readFile(samplePageUrl, 'utf8');
  assert.doesNotMatch(html, legacyBranding);
  assert.match(html, /World Discovery/);
});
