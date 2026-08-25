import test from 'node:test';
import assert from 'node:assert/strict';
import { analyze } from '../scripts/analyze-search-console.mjs';

test('zero data yields no fabricated demand', () => assert.deepEqual(analyze([]), []));

test('ranks high-impression near-page-one opportunities first', () => {
  const rows=[
    {page:'/a',query:'internet use germany',date:'2026-08-25',clicks:2,impressions:200,ctr:0.01,position:8},
    {page:'/b',query:'internet users france',date:'2026-08-25',clicks:1,impressions:50,ctr:0.02,position:6},
    {page:'/c',query:'unranked',date:'2026-08-25',clicks:0,impressions:1000,ctr:0,position:45}
  ];
  const out=analyze(rows);
  assert.equal(out.length,2);
  assert.equal(out[0].page,'/a');
  assert.ok(out[0].opportunityScore > out[1].opportunityScore);
});

test('invalid or zero-impression rows are ignored', () => {
  assert.deepEqual(analyze([{page:'/a',query:'x',date:'2026-08-25',clicks:0,impressions:0,ctr:0,position:8}]), []);
});
