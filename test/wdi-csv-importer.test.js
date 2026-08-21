import test from 'node:test';
import assert from 'node:assert/strict';
import { importWdiArchiveCsv } from '../src/wdi-csv-importer.js';

test('imports a WDI archive CSV with metadata preamble', () => {
  const csv = [
    'Data Source,World Development Indicators',
    'Last Updated Date,2026-07-13',
    '',
    'Country Name,Country Code,Indicator Name,Indicator Code,2022,2023,2024',
    'Germany,DEU,GDP growth (annual %),NY.GDP.MKTP.KD.ZG,1.4,-0.3,..',
    'France,FRA,GDP growth (annual %),NY.GDP.MKTP.KD.ZG,2.5,0.9,1.1'
  ].join('\r\n');

  const observations = importWdiArchiveCsv(csv, {
    vintage: '2026-07-13',
    unit: 'percent',
    methodologyVersion: 'wdi-gdp-growth-definition-v1',
    sourceUrl: 'https://databank.worldbank.org/source/world-development-indicators'
  });

  assert.equal(observations.length, 5);
  const germany2023 = observations.find((o) => o.entity === 'DEU' && o.period === '2023');
  assert.ok(germany2023);
  assert.equal(germany2023.value, -0.3);
  assert.equal(germany2023.vintage, '2026-07-13');
  assert.equal(germany2023.indicator, 'NY.GDP.MKTP.KD.ZG');
});

test('rejects files without a recognizable WDI header', () => {
  assert.throws(() => importWdiArchiveCsv('foo,bar\n1,2', {
    vintage: '2026-07-13', unit: 'percent', methodologyVersion: 'x'
  }), /header/i);
});
