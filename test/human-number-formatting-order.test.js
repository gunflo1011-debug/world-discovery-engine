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

test('formatter preserves meaningful small percentage direction while preventing negative zero', async () => {
  const source = await readFile(new URL('../scripts/format-human-numbers.mjs', import.meta.url), 'utf8');
  assert.match(source, /replace\('−', '-'\)/);
  assert.match(source, /absolute < 0\.01 \? 3 : absolute < 0\.1 \? 2 : 1/);
  assert.match(source, /Number\(formatted\) === 0 \? '0' : formatted/);
  assert.match(source, /\[−-\]0/);
});

test('built human-visible pages contain no negative zero percentages and keep small negative changes visible', async () => {
  const paths = [
    '../site/indicators/internet-use/country/deu/index.html',
    '../site/countries/deu/index.html',
    '../site/evidence/index.html',
    '../site/data/population-growth/index.html'
  ];
  for (const path of paths) {
    const html = await readFile(new URL(path, import.meta.url), 'utf8');
    const withoutScripts = html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
    assert.doesNotMatch(withoutScripts, /[−-]0(?:\.0+)?%/, `${path} must not expose negative zero percentages`);
  }

  const germany = await readFile(new URL('../site/countries/deu/index.html', import.meta.url), 'utf8');
  const visibleGermany = germany.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  assert.match(visibleGermany, /Population growth[\s\S]{0,800}-0\.\d+%/i, 'Germany population growth must retain its negative direction');
});

test('built internet-use country pages avoid gratuitous long percentage precision', async () => {
  const html = await readFile(new URL('../site/indicators/internet-use/country/deu/index.html', import.meta.url), 'utf8');
  const withoutScripts = html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  assert.doesNotMatch(withoutScripts, /-?\d+\.\d{4,}(?=%|\s+(?:pp|percentage points?))/i);
});
