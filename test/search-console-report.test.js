import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSearchConsoleReport } from '../scripts/report-search-console.mjs';

test('zero data stays honest', () => {
  assert.deepEqual(buildSearchConsoleReport([]), {status:'NO_DEMAND_EVIDENCE', rows:0, opportunities:[]});
});

test('aggregates page/query across dates and ranks near-page-one demand', () => {
  const report = buildSearchConsoleReport([
    {page:'/a',query:'internet use germany',date:'2026-08-01',clicks:1,impressions:50,ctr:.02,position:9},
    {page:'/a',query:'internet use germany',date:'2026-08-02',clicks:2,impressions:100,ctr:.02,position:7},
    {page:'/b',query:'other',date:'2026-08-02',clicks:0,impressions:5,ctr:0,position:40}
  ]);
  assert.equal(report.status, 'ACTIONABLE_DEMAND_EVIDENCE');
  assert.equal(report.rows, 3);
  assert.equal(report.opportunities.length, 1);
  assert.equal(report.opportunities[0].category, 'NEAR_PAGE_ONE');
  assert.equal(report.opportunities[0].impressions, 150);
  assert.equal(report.opportunities[0].clicks, 3);
  assert.equal(report.opportunities[0].ctr, .02);
  assert.equal(report.opportunities[0].position, 7.67);
  assert.equal(report.opportunities[0].firstDate, '2026-08-01');
  assert.equal(report.opportunities[0].lastDate, '2026-08-02');
});

test('reports demand without inventing an opportunity', () => {
  const report = buildSearchConsoleReport([
    {page:'/a',query:'brand',date:'2026-08-01',clicks:8,impressions:10,ctr:.8,position:1}
  ]);
  assert.equal(report.status, 'DEMAND_EVIDENCE_NO_ACTIONABLE_OPPORTUNITY');
  assert.deepEqual(report.opportunities, []);
});
