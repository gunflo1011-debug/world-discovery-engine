import assert from 'node:assert/strict';
import test from 'node:test';
import { access, readFile } from 'node:fs/promises';

const root = new URL('../site/', import.meta.url);

test('every homepage-generated topic and country suggestion resolves to a built page', async () => {
  const home = await readFile(new URL('index.html', root), 'utf8');
  const catalog = JSON.parse(await readFile(new URL('data/wdi/index.json', root), 'utf8'));
  const countries = JSON.parse(await readFile(new URL('countries/index.json', root), 'utf8'));

  assert.match(home, /url:'\.\/data\/'\+x\.slug\+'\/'/, 'topic suggestions must use the generated /data/<slug>/ route');
  assert.doesNotMatch(home, /url:'\.\/indicators\/'\+x\.slug\+'\/'/, 'generic topic suggestions must never target nonexistent /indicators/<slug>/ routes');

  for (const indicator of catalog.indicators ?? []) {
    await access(new URL(`data/${indicator.slug}/index.html`, root));
  }

  for (const country of countries.countries ?? []) {
    const relative = String(country.url ?? '').replace(/^\//, '');
    assert.ok(relative, `country ${country.code ?? 'unknown'} must expose a URL`);
    const target = relative.endsWith('/') ? `${relative}index.html` : relative;
    await access(new URL(target, root));
  }
});
