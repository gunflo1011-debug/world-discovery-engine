import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeInternetUseSnapshot } from '../scripts/ingest-internet-use-wdi.mjs';

const countryPayload = [
  { page: 1, pages: 1, per_page: '4', total: 4 },
  [
    { id: 'DEU', name: 'Germany', region: { id: 'ECS', value: 'Europe & Central Asia' } },
    { id: 'USA', name: 'United States', region: { id: 'NAC', value: 'North America' } },
    { id: 'WLD', name: 'World', region: { id: 'NA', value: 'Aggregates' } },
    { id: 'FRA', name: 'France', region: { id: 'ECS', value: 'Europe & Central Asia' } }
  ]
];

const observation = (code, value, date = '2024') => ({
  indicator: { id: 'IT.NET.USER.ZS', value: 'Individuals using the Internet (% of population)' },
  country: { id: code, value: code },
  countryiso3code: code,
  date,
  value
});

test('normalizes an official same-year snapshot and excludes aggregates/nulls/other years', () => {
  const indicatorPayload = [
    { page: 1, pages: 1, per_page: 6, total: 6 },
    [
      observation('USA', 95),
      observation('WLD', 68),
      observation('DEU', 93),
      observation('FRA', null),
      observation('FRA', 88, '2023'),
      { ...observation('FRA', 89), indicator: { id: 'OTHER' } }
    ]
  ];

  const data = normalizeInternetUseSnapshot({
    indicatorPayload,
    countryPayload,
    year: 2024,
    retrievedAt: '2026-08-23',
    retrievalUrl: 'https://api.worldbank.org/v2/country/all/indicator/IT.NET.USER.ZS?date=2024&format=json&per_page=400&source=2'
  });

  assert.equal(data.schemaVersion, '1.1');
  assert.equal(data.status, 'CURRENT_VERIFIED');
  assert.equal(data.coverage.type, 'official_same_year_snapshot');
  assert.equal(data.coverage.countries, 2);
  assert.deepEqual(data.records, [
    { country: 'Germany', code: 'DEU', value: 93, year: 2024 },
    { country: 'United States', code: 'USA', value: 95, year: 2024 }
  ]);
  assert.match(data.coverage.note, /missing countries are not backfilled/i);
});

test('fails closed on an out-of-range official percentage', () => {
  const indicatorPayload = [
    { page: 1, pages: 1, per_page: 2, total: 2 },
    [observation('DEU', 101), observation('USA', 95)]
  ];
  assert.throws(() => normalizeInternetUseSnapshot({
    indicatorPayload,
    countryPayload,
    year: 2024,
    retrievedAt: '2026-08-23',
    retrievalUrl: 'https://api.worldbank.org/v2/country/all/indicator/IT.NET.USER.ZS?date=2024&format=json&per_page=400&source=2'
  }), /out-of-range percentage/);
});

test('fails closed on duplicate country observations', () => {
  const indicatorPayload = [
    { page: 1, pages: 1, per_page: 3, total: 3 },
    [observation('DEU', 93), observation('DEU', 92), observation('USA', 95)]
  ];
  assert.throws(() => normalizeInternetUseSnapshot({
    indicatorPayload,
    countryPayload,
    year: 2024,
    retrievedAt: '2026-08-23',
    retrievalUrl: 'https://api.worldbank.org/v2/country/all/indicator/IT.NET.USER.ZS?date=2024&format=json&per_page=400&source=2'
  }), /duplicate country observations/);
});
