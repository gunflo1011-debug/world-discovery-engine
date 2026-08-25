import fs from 'node:fs';

export const PROPERTY = 'sc-domain:worlddiscoverydata.com';
export const DIMENSIONS = ['date', 'page', 'query'];

export function normalizeSearchAnalyticsRows(payload) {
  const rows = Array.isArray(payload?.rows) ? payload.rows : [];
  return rows.flatMap((row) => {
    const keys = Array.isArray(row?.keys) ? row.keys : [];
    if (keys.length !== DIMENSIONS.length) return [];
    const [date, page, query] = keys;
    const clicks = Number(row.clicks);
    const impressions = Number(row.impressions);
    const ctr = Number(row.ctr);
    const position = Number(row.position);
    if (!date || !page || !query || ![clicks, impressions, ctr, position].every(Number.isFinite)) return [];
    return [{ date, page, query, clicks, impressions, ctr, position }];
  });
}

function csvEscape(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function toCsv(rows) {
  const headers = ['page', 'query', 'date', 'clicks', 'impressions', 'ctr', 'position'];
  return [headers.join(','), ...rows.map((row) => headers.map((key) => csvEscape(row[key])).join(','))].join('\n') + '\n';
}

if (process.argv[1]?.endsWith('extract-search-console.mjs')) {
  const [input, output = 'search-console.csv'] = process.argv.slice(2);
  if (!input) {
    console.error('Usage: node scripts/extract-search-console.mjs <api-response.json> [output.csv]');
    process.exit(2);
  }
  const payload = JSON.parse(fs.readFileSync(input, 'utf8'));
  const rows = normalizeSearchAnalyticsRows(payload);
  fs.writeFileSync(output, toCsv(rows));
  console.log(`SEARCH_CONSOLE_ROWS=${rows.length}`);
}
