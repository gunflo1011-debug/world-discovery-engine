import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv } from '../src/csv.js';

test('parses WDI-style CSV rows including quoted commas and missing values', () => {
  const rows = parseCsv('\uFEFF"Country Name","Country Code","Indicator Name","Indicator Code","2022","2023"\r\n"Korea, Rep.","KOR","GDP growth (annual %)","NY.GDP.MKTP.KD.ZG","2.7",".."\r\n');
  assert.equal(rows.length, 1);
  assert.equal(rows[0]['Country Name'], 'Korea, Rep.');
  assert.equal(rows[0]['Indicator Code'], 'NY.GDP.MKTP.KD.ZG');
  assert.equal(rows[0]['2023'], '..');
});

test('supports escaped quotes and embedded newlines in quoted fields', () => {
  const rows = parseCsv('name,description\n"Example","A ""quoted""\nvalue"\n');
  assert.equal(rows[0].description, 'A "quoted"\nvalue');
});

test('rejects malformed unterminated CSV', () => {
  assert.throws(() => parseCsv('a,b\n"x,y\n'), /Unterminated quoted CSV record/);
});
