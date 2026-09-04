import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const site = new URL('../site/', import.meta.url);

function count(html, needle) {
  return html.split(needle).length - 1;
}

function matchValue(html, pattern, label) {
  const value = html.match(pattern)?.[1]?.trim();
  assert.ok(value, `${label} should be present`);
  return value;
}

test('current data catalog exposes complete non-duplicated social metadata', async () => {
  const html = await readFile(new URL('data/index.html', site), 'utf8');
  const title = matchValue(html, /<title>([^<]+)<\/title>/i, 'title');
  const description = matchValue(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["'][^>]*>/i, 'description');
  const canonical = matchValue(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/i, 'canonical');

  assert.match(html, /<meta property="og:type" content="website">/);
  assert.ok(html.includes(`<meta property="og:title" content="${title}">`));
  assert.ok(html.includes(`<meta property="og:description" content="${description}">`));
  assert.ok(html.includes(`<meta property="og:url" content="${canonical}">`));
  assert.match(html, /<meta name="twitter:card" content="summary">/);
  assert.equal(count(html, 'property="og:title"'), 1);
  assert.equal(count(html, 'property="og:description"'), 1);
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
