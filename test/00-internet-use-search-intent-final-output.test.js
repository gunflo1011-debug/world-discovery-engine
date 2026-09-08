import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../site/indicators/internet-use/country/', import.meta.url);

for (const { code, country } of [
  { code: 'aut', country: 'Austria' },
  { code: 'bgd', country: 'Bangladesh' }
]) {
  test(`${country} final internet-use profile keeps intent wording and canonical`, async () => {
    const html = await readFile(new URL(`${code}/index.html`, root), 'utf8');

    assert.match(html, /data-search-intent="internet-penetration"/);
    assert.match(html, /“internet penetration rate” and “internet users” both refer to the share of individuals who used the internet/);
    assert.match(html, /href="\/data\/internet-use\/">Compare internet users by country and year/);
    assert.match(html, /href="\.\.\/\.\.\/">Explore the \d{4} internet-use ranking/);
    assert.match(
      html,
      new RegExp(`<link rel="canonical" href="https://worlddiscoverydata\\.com/indicators/internet-use/country/${code}/">`)
    );
  });
}
