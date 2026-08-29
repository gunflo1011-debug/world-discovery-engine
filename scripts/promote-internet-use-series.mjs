import { access, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../site/indicators/internet-use/', import.meta.url);
const historyUrl = new URL('history.json', root);
const countriesRoot = new URL('country/', root);
const baseCanonical = 'https://worlddiscoverydata.com/indicators/internet-use/';

async function exists(url) {
  try { await access(url); return true; } catch { return false; }
}

function promoteHistoryHtml(html, record) {
  const slug = record.code.toLowerCase();
  const historyCanonical = `${baseCanonical}country/${slug}/history/`;
  const primaryCanonical = `${baseCanonical}country/${slug}/`;

  let output = html.replaceAll(historyCanonical, primaryCanonical);

  // The historical page is generated one directory deeper than the primary
  // country profile. Rebase its local links when promoting it to /country/{iso}/.
  output = output
    .replaceAll('href="../../../../../styles.css"', 'href="../../../../styles.css"')
    .replaceAll('href="../../../../../index.html"', 'href="../../../../index.html"')
    .replaceAll('href="../../../../index.html"', 'href="../../../index.html"')
    .replaceAll('href="../../../"', 'href="../../"')
    .replaceAll('href="../../../../../methodology/index.html"', 'href="../../../../methodology/index.html"')
    .replaceAll('href="../../../../../sources/index.html"', 'href="../../../../sources/index.html"')
    .replace(/href="\.\.\/\.\.\/([a-z]{3})\/history\/"/g, 'href="../$1/"')
    .replaceAll('href="../../../region/', 'href="../../region/');

  // The promoted root data.json is now the full verified series, so the
  // machine-readable link remains ./data.json. Remove wording that implies a
  // separate latest-only country product.
  output = output.replace(/ · <a href="\.\.\/">See [^<]+ latest profile and country comparison →<\/a>/, ' · <a href="../../">Compare countries →</a>');

  return output;
}

function legacyRedirect(record) {
  const slug = record.code.toLowerCase();
  const canonical = `${baseCanonical}country/${slug}/`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${record.country} internet use history moved | World Discovery Data</title><meta name="robots" content="noindex,follow"><link rel="canonical" href="${canonical}"><meta http-equiv="refresh" content="0; url=../"></head><body><main><p>The complete ${record.country} internet-use time series is now the primary country profile. <a href="../">Open ${record.country} internet use and penetration →</a></p></main></body></html>`;
}

if (!(await exists(historyUrl))) {
  console.log('No internet-use history.json found; primary series promotion skipped.');
  process.exit(0);
}

const data = JSON.parse(await readFile(historyUrl, 'utf8'));
if (data?.status !== 'CURRENT_VERIFIED_HISTORY' || !Array.isArray(data.records)) {
  throw new Error('invalid internet-use history dataset');
}

let promoted = 0;
for (const record of data.records) {
  if (!/^[A-Z]{3}$/.test(record.code) || !Array.isArray(record.observations) || record.observations.length < 2) continue;

  const countryDir = new URL(`${record.code.toLowerCase()}/`, countriesRoot);
  const historyDir = new URL('history/', countryDir);
  const historyPage = new URL('index.html', historyDir);
  const historyData = new URL('data.json', historyDir);
  if (!(await exists(historyPage)) || !(await exists(historyData))) continue;

  const [html, machineJson] = await Promise.all([
    readFile(historyPage, 'utf8'),
    readFile(historyData, 'utf8')
  ]);

  const machine = JSON.parse(machineJson);
  machine.schemaVersion = '1.1';
  machine.humanUrl = `${baseCanonical}country/${record.code.toLowerCase()}/`;
  machine.product = {
    type: 'country-time-series',
    primary: true,
    latestObservationIsSummary: true,
    missingYearsInterpolated: false
  };

  await Promise.all([
    writeFile(new URL('index.html', countryDir), promoteHistoryHtml(html, record), 'utf8'),
    writeFile(new URL('data.json', countryDir), `${JSON.stringify(machine, null, 2)}\n`, 'utf8'),
    writeFile(historyPage, legacyRedirect(record), 'utf8')
  ]);
  promoted += 1;
}

console.log(`Promoted ${promoted} internet-use country time series to primary country profiles.`);
