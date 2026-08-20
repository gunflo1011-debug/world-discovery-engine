import { normalizeWorldBankObservation } from './world-bank-importer.js';

function clean(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function numeric(value) {
  if (typeof value === 'number') return value;
  const text = clean(value).replace(/,/g, '');
  if (!text || text === '..' || text === 'NA' || text === 'N/A') return null;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

export function normalizeWdiArchiveRows(rows, context = {}) {
  if (!Array.isArray(rows)) throw new Error('WDI archive rows must be an array');
  if (!context.vintage) throw new Error('WDI archive vintage is required');

  const observations = [];
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const indicator = clean(row['Indicator Code'] ?? row.indicatorCode ?? context.indicator);
    const indicatorName = clean(row['Indicator Name'] ?? row.indicatorName ?? context.indicatorName);
    const entity = clean(row['Country Code'] ?? row.countryCode ?? row.entity);
    const entityName = clean(row['Country Name'] ?? row.countryName ?? row.entityName);
    if (!indicator || !entity) continue;

    for (const [column, rawValue] of Object.entries(row)) {
      if (!/^\d{4}$/.test(column)) continue;
      const value = numeric(rawValue);
      if (value === null) continue;
      observations.push(normalizeWorldBankObservation({
        indicator,
        countryiso3code: entity,
        entity,
        date: column,
        value
      }, {
        ...context,
        indicator,
        indicatorName: indicatorName || context.indicatorName,
        entity,
        entityName: entityName || context.entityName,
        source: context.source ?? 'world-bank-wdi-archive'
      }));
    }
  }
  return observations;
}

export function selectComparableSeries(observations, { indicator, entity, period } = {}) {
  if (!Array.isArray(observations)) throw new Error('Observations must be an array');
  return observations
    .filter((o) => (!indicator || o.indicator === indicator)
      && (!entity || o.entity === entity)
      && (!period || o.period === String(period)))
    .sort((a, b) => String(a.vintage).localeCompare(String(b.vintage)));
}
