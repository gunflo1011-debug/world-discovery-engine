import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const site = new URL('../site/', import.meta.url);
const siteRoot = resolve(process.cwd(), 'site');
const base = 'https://worlddiscoverydata.com';
const socialImage = `${base}/social-preview.png`;

function count(html, needle) {
  return html.split(needle).length - 1;
}

function matchValue(html, pattern, label) {
  const value = html.match(pattern)?.[1]?.trim();
  assert.ok(value, `${label} should be present`);
  return value;
}

function localPath(url) {
  const pathname = new URL(url).pathname;
  if (pathname.endsWith('/')) return resolve(siteRoot, pathname.slice(1), 'index.html');
  return resolve(siteRoot, pathname.slice(1));
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
  assert.ok(html.includes(`<meta property="og:image" content="${socialImage}">`));
  assert.match(html, /<meta property="og:image:width" content="1200">/);
  assert.match(html, /<meta property="og:image:height" content="630">/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
  assert.ok(html.includes(`<meta name="twitter:title" content="${title}">`));
  assert.ok(html.includes(`<meta name="twitter:description" content="${description}">`));
  assert.ok(html.includes(`<meta name="twitter:image" content="${socialImage}">`));
  assert.equal(count(html, 'property="og:title"'), 1);
  assert.equal(count(html, 'property="og:description"'), 1);
  assert.equal(count(html, 'property="og:url"'), 1);
  assert.equal(count(html, 'property="og:image"'), 1);
  assert.equal(count(html, 'name="twitter:card"'), 1);
  assert.equal(count(html, 'name="twitter:title"'), 1);
  assert.equal(count(html, 'name="twitter:description"'), 1);
  assert.equal(count(html, 'name="twitter:image"'), 1);
});

test('existing homepage social metadata is not duplicated by the SEO finalizer', async () => {
  const html = await readFile(new URL('index.html', site), 'utf8');
  assert.equal(count(html, 'property="og:title"'), 1);
  assert.equal(count(html, 'property="og:description"'), 1);
  assert.equal(count(html, 'property="og:url"'), 1);
  assert.equal(count(html, 'property="og:image"'), 1);
  assert.equal(count(html, 'name="twitter:card"'), 1);
  assert.equal(count(html, 'name="twitter:title"'), 1);
  assert.equal(count(html, 'name="twitter:description"'), 1);
  assert.equal(count(html, 'name="twitter:image"'), 1);
});

test('every sitemap HTML page carries complete Open Graph and Twitter metadata', async () => {
  const sitemap = await readFile(resolve(siteRoot, 'sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.ok(urls.length > 0, 'sitemap should contain URLs');

  for (const url of urls) {
    assert.ok(url.startsWith(base), `unexpected sitemap host: ${url}`);
    if (!url.endsWith('/') && !url.endsWith('.html')) continue;
    const html = await readFile(localPath(url), 'utf8');
    assert.match(html, /<meta\s+property=["']og:type["']\s+content=["']website["'][^>]*>/i, `missing og:type: ${url}`);
    assert.match(html, /<meta\s+property=["']og:title["']\s+content=["'][^"']+["'][^>]*>/i, `missing og:title: ${url}`);
    assert.match(html, /<meta\s+property=["']og:description["']\s+content=["'][^"']+["'][^>]*>/i, `missing og:description: ${url}`);
    assert.match(html, /<meta\s+property=["']og:url["']\s+content=["'][^"']+["'][^>]*>/i, `missing og:url: ${url}`);
    assert.match(html, /<meta\s+property=["']og:image["']\s+content=["']https:\/\/worlddiscoverydata\.com\/social-preview\.png["'][^>]*>/i, `missing og:image: ${url}`);
    assert.match(html, /<meta\s+property=["']og:image:alt["']\s+content=["'][^"']+["'][^>]*>/i, `missing og:image:alt: ${url}`);
    assert.match(html, /<meta\s+name=["']twitter:card["']\s+content=["']summary_large_image["'][^>]*>/i, `missing twitter:card: ${url}`);
    assert.match(html, /<meta\s+name=["']twitter:title["']\s+content=["'][^"']+["'][^>]*>/i, `missing twitter:title: ${url}`);
    assert.match(html, /<meta\s+name=["']twitter:description["']\s+content=["'][^"']+["'][^>]*>/i, `missing twitter:description: ${url}`);
    assert.match(html, /<meta\s+name=["']twitter:image["']\s+content=["']https:\/\/worlddiscoverydata\.com\/social-preview\.png["'][^>]*>/i, `missing twitter:image: ${url}`);
    assert.match(html, /<meta\s+name=["']twitter:image:alt["']\s+content=["'][^"']+["'][^>]*>/i, `missing twitter:image:alt: ${url}`);
  }
});
