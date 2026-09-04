import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const site = new URL('../site/', import.meta.url);

function count(html, needle) {
  return html.split(needle).length - 1;
}

test('current data catalog exposes complete non-duplicated social metadata', async () => {
  const html = await readFile(new URL('data/index.html', site), 'utf8');
  assert.match(html, /<title>Browse official global data — World Discovery<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/worlddiscoverydata\.com\/data\/">/);
  assert.match(html, /<meta property="og:type" content="website">/);
  assert.match(html, /<meta property="og:title" content="Browse official global data — World Discovery">/);
  assert.match(html, /<meta property="og:description" content="Search and browse 30 official World Development Indicators by everyday topic, with observation year, coverage and source context\.">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/worlddiscoverydata\.com\/data\/">/);
  assert.match(html, /<meta name="twitter:card" content="summary">/);
  assert.equal(count(html, 'property="og:title"'), 1);
  assert.equal(count(html, 'property="og:url"'), 1);
  assert.equal(count(html, 'name="twitter:card"'), 1);
});

test('existing homepage social metadata is not duplicated by the SEO finalizer', async () => {
  const html = await readFile(new URL('index.html', site), 'utf8');
  assert.equal(count(html, 'property="og:title"'), 1);
  assert.equal(count(html, 'property="og:description"'), 1);
  assert.equal(count(html, 'property="og:url"'), 1);
  assert.equal(count(html, 'name="twitter:card"'), 1);
});
