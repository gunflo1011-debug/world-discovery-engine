import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const pilot = new Map([
  ['prk', 'Código ISO3: PRK.'],
  ['ncl', 'Código ISO3: NCL.'],
]);

const read = (p) => readFile(path.join(ROOT, p), 'utf8');
const match = (html, re, label) => {
  const value = html.match(re)?.[1];
  assert.ok(value, `missing ${label}`);
  return value;
};

test('ISO3 pilot stays limited to PRK + NCL Spanish meta descriptions', async () => {
  const esRoot = path.join(ROOT, 'public/es/countries');
  const dirs = (await readdir(esRoot, { withFileTypes: true })).filter((d) => d.isDirectory());

  for (const dir of dirs) {
    const html = await read(`public/es/countries/${dir.name}/index.html`);
    const description = match(html, /<meta name="description" content="([^"]+)"/i, `${dir.name} description`);
    if (pilot.has(dir.name)) {
      assert.ok(description.includes(pilot.get(dir.name)), `${dir.name} must carry its frozen ISO3 suffix`);
    } else {
      assert.ok(!description.includes('Código ISO3:'), `${dir.name} must stay outside the frozen pilot`);
    }
  }
});

test('ISO3 pilot leaves critical PRK/NCL page invariants intact', async () => {
  const sitemap = await read('public/sitemap.xml');

  for (const [code, suffix] of pilot) {
    const html = await read(`public/es/countries/${code}/index.html`);
    const description = match(html, /<meta name="description" content="([^"]+)"/i, `${code} description`);
    assert.ok(description.endsWith(suffix), `${code} suffix must only decorate the description`);

    assert.ok(match(html, /<title>([^<]+)<\/title>/i, `${code} title`));
    assert.ok(match(html, /<h1[^>]*>([^<]+)<\/h1>/i, `${code} h1`));
    assert.equal(match(html, /<link rel="canonical" href="([^"]+)"/i, `${code} canonical`), `https://worlddiscoverydata.com/es/countries/${code}/`);
    assert.match(html, new RegExp(`>${code.toUpperCase()} ·`), `${code} visible hero ISO3 must remain`);
    assert.match(html, /hreflang="en"/i, `${code} English hreflang must remain`);
    assert.match(html, /hreflang="es"/i, `${code} Spanish hreflang must remain`);
    assert.match(html, /<table/i, `${code} indicator table must remain`);
    assert.match(html, /<td/i, `${code} indicator rows/data must remain`);
    assert.ok(sitemap.includes(`https://worlddiscoverydata.com/es/countries/${code}/`), `${code} must remain in sitemap`);
  }
});

test('ISO3 suffix never leaks into non-Spanish PRK/NCL descriptions', async () => {
  for (const locale of ['', 'de/', 'fr/', 'zh-hans/']) {
    for (const code of pilot.keys()) {
      const html = await read(`public/${locale}countries/${code}/index.html`);
      const description = match(html, /<meta name="description" content="([^"]+)"/i, `${locale || 'en/'}${code} description`);
      assert.ok(!description.includes('Código ISO3:'), `${locale || 'en/'}${code} must stay outside Spanish pilot`);
    }
  }
});
