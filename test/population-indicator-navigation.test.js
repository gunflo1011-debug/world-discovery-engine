import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../scripts/build-indicator-hub.py', import.meta.url), 'utf8');

test('population indicator page links Indicators nav back to the registry', () => {
  assert.match(source, /<nav class=\"nav\" aria-label=\"Primary\">/);
  assert.match(source, /<a href=\"\.\.\/index\.html\" aria-current=\"page\">Indicators<\/a>/);
  assert.doesNotMatch(source, /<a href=\"\.\/index\.html\" aria-current=\"page\">Indicators<\/a>/);
});
