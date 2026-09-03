import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

for (const scriptName of ['build', 'build:internet-use']) {
  test(`${scriptName} formats human-visible numbers after every later HTML mutation`, () => {
    const script = packageJson.scripts[scriptName];
    const formatter = script.lastIndexOf('node scripts/format-human-numbers.mjs');
    const regionalContext = script.lastIndexOf('node scripts/enrich-internet-use-regional-context.mjs');
    const regionalHighlights = script.lastIndexOf('node scripts/enrich-internet-use-region-highlights.mjs');
    const consolidation = script.lastIndexOf('node scripts/consolidate-legacy-indicators.mjs');
    const incompleteLocales = script.lastIndexOf('node scripts/guard-incomplete-locales.mjs');

    assert.notEqual(formatter, -1, 'formatter must be present');
    assert.ok(formatter > regionalContext, 'formatter must run after regional context enrichment');
    assert.ok(formatter > regionalHighlights, 'formatter must run after regional highlights enrichment');
    assert.ok(formatter > consolidation, 'formatter must run after legacy consolidation');
    if (incompleteLocales !== -1) {
      assert.ok(formatter > incompleteLocales, 'formatter must run after incomplete-locale guarding');
    }
  });
}

test('formatter normalizes values that round to negative zero, including Unicode minus', async () => {
  const source = await readFile(new URL('../scripts/format-human-numbers.mjs', import.meta.url), 'utf8');
  assert.match(source, /replace\('−', '-'\)/);
  assert.match(source, /Number\(formatted\) === 0 \? '0' : formatted/);
  assert.match(source, /\[−-\]0/);
});

test('built human-visible pages contain no negative zero percentages', async () => {
  const paths = [
    '../site/indicators/internet-use/country/deu/index.html',
    '../site/countries/deu/index.html',
    '../site/evidence/index.html'
  ];
  for (const path of paths) {
    const html = await readFile(new URL(path, import.meta.url), 'utf8');
    const withoutScripts = html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
    assert.doesNotMatch(withoutScripts, /[−-]0(?:\.0+)?%/, `${path} must not expose negative zero percentages`);
  }
});

test('built internet-use country pages contain no long human-visible percentage precision', async () => {
  const html = await readFile(new URL('../site/indicators/internet-use/country/deu/index.html', import.meta.url), 'utf8');
  const withoutScripts = html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  assert.doesNotMatch(withoutScripts, /-?\d+\.\d{2,}(?=%|\s+(?:pp|percentage points?))/i);
});
