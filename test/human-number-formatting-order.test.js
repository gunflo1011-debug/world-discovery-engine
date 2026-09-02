import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

for (const scriptName of ['build', 'build:internet-use']) {
  test(`${scriptName} formats human-visible numbers after regional enrichments`, () => {
    const script = packageJson.scripts[scriptName];
    const formatter = script.lastIndexOf('node scripts/format-human-numbers.mjs');
    const regionalContext = script.lastIndexOf('node scripts/enrich-internet-use-regional-context.mjs');
    const regionalHighlights = script.lastIndexOf('node scripts/enrich-internet-use-region-highlights.mjs');

    assert.notEqual(formatter, -1, 'formatter must be present');
    assert.ok(formatter > regionalContext, 'formatter must run after regional context enrichment');
    assert.ok(formatter > regionalHighlights, 'formatter must run after regional highlights enrichment');
  });
}

test('formatter normalizes values that round to negative zero', async () => {
  const source = await readFile(new URL('../scripts/format-human-numbers.mjs', import.meta.url), 'utf8');
  assert.match(source, /Number\(formatted\) === 0 \? '0' : formatted/);
});

test('built country pages contain no long human-visible percentage precision or negative zero percentages', async () => {
  const html = await readFile(new URL('../site/indicators/internet-use/country/deu/index.html', import.meta.url), 'utf8');
  const withoutScripts = html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  assert.doesNotMatch(withoutScripts, /-?\d+\.\d{2,}(?=%|\s+(?:pp|percentage points?))/i);
  assert.doesNotMatch(withoutScripts, /-0(?:\.0+)?%/);
});
