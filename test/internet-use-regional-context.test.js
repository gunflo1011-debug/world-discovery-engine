import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const scriptUrl = new URL('../scripts/enrich-internet-use-regional-context.mjs', import.meta.url);

test('regional context enrichment stays source-backed and links same-region country profiles', async () => {
  const source = await readFile(scriptUrl, 'utf8');

  assert.match(source, /CURRENT_VERIFIED/);
  assert.match(source, /IT\.NET\.USER\.ZS/);
  assert.match(source, /record\.year !== data\.observationYear/);
  assert.match(source, /item\.region\.code === record\.region\.code/);
  assert.match(source, /median\(regional\.map/);
  assert.match(source, /Nearest same-region observations/);
  assert.match(source, /href=\\"\.\.\/\$\{slugFor\(peer\.code\)\}\//);
  assert.match(source, /dataset-slice comparison, not a claim about countries missing/);
  assert.doesNotMatch(source, /complete global rank/i);
  assert.doesNotMatch(source, /latest available/i);
  assert.doesNotMatch(source, /fetch\(/);
});
