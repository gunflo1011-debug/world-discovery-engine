import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const internetUsePage = new URL('../site/data/internet-use/index.html', import.meta.url);
const populationPage = new URL('../site/data/population/index.html', import.meta.url);

test('internet-use ranking explains broad human search language without changing the official metric identity', async () => {
  const html = await readFile(internetUsePage, 'utf8');

  assert.match(html, /data-broad-intent-explainer="internet-use"/);
  assert.match(html, /<h2>Internet penetration explained<\/h2>/);
  assert.match(html, /share of individuals who used the internet/);
  assert.match(html, /not<\/strong> the absolute number of internet users/);
  assert.match(html, /does not measure household access, connection speed, fixed-broadband subscriptions or mobile subscriptions/);
  assert.match(html, /<h1>Individuals using the Internet \(% of population\)<\/h1>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/worlddiscoverydata\.com\/data\/internet-use\/">/);
});

test('internet-use broad-intent explainer does not leak onto unrelated WDI ranking pages', async () => {
  const html = await readFile(populationPage, 'utf8');
  assert.doesNotMatch(html, /data-broad-intent-explainer="internet-use"/);
  assert.doesNotMatch(html, /Internet penetration explained/);
});
