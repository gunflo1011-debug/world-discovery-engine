import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const explorerUrl = new URL('../site/explore/explorer.js', import.meta.url);

function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

async function runOutOfOrder({ staleRejects = false } = {}) {
  let generation = 0;
  let committed = null;
  let disabled = false;
  const older = deferred();
  const newer = deferred();

  async function hydrate(request) {
    const mine = ++generation;
    try {
      const years = await request.promise;
      if (mine !== generation) return;
      committed = years;
      disabled = false;
    } catch {
      if (mine !== generation) return;
      committed = ['latest'];
      disabled = true;
    }
  }

  const oldRun = hydrate(older);
  const newRun = hydrate(newer);
  newer.resolve(['latest', 2022, 2021]);
  await newRun;
  if (staleRejects) older.reject(new Error('stale history failure'));
  else older.resolve(['latest', 2010]);
  await oldRun;
  return { committed, disabled };
}

test('generation guard keeps newer year options when an older success settles last', async () => {
  const result = await runOutOfOrder();
  assert.deepEqual(result.committed, ['latest', 2022, 2021]);
  assert.equal(result.disabled, false);
});

test('generation guard keeps newer year options when an older failure settles last', async () => {
  const result = await runOutOfOrder({ staleRejects: true });
  assert.deepEqual(result.committed, ['latest', 2022, 2021]);
  assert.equal(result.disabled, false);
});

test('production Explorer wires the generation guard into hydration success and failure commits', async () => {
  const source = await readFile(explorerUrl, 'utf8');
  assert.match(source, /hydrationGeneration/, 'Explorer must maintain a separate hydration generation');
  assert.match(source, /async function refreshYears\(generation\)/, 'year refresh must receive its hydration generation');
  assert.match(source, /generation!==hydrationGeneration/, 'year-option commits must reject stale hydration generations');
  assert.match(source, /disableHistoricalYears\(e,generation\)/, 'failure/disable commits must be generation guarded too');
  assert.match(source, /\+\+hydrationGeneration/, 'every hydration request must advance the generation');
});
