const base = (process.env.BASE_URL || 'https://worlddiscoverydata.com').replace(/\/$/, '');
const release = process.env.GITHUB_SHA || String(Date.now());
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function localUrl(path) {
  const raw = path.startsWith('http') ? path : `${base}${path}`;
  if (!raw.startsWith(base)) return raw;
  const url = new URL(raw);
  url.searchParams.set('release', release);
  return url.href;
}

async function get(path, type = 'text') {
  const url = localUrl(path);
  let last;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: { 'cache-control': 'no-cache', pragma: 'no-cache' },
      });
      if (!response.ok) throw new Error(`${response.status} ${url}`);
      const text = await response.text();
      if (!text) throw new Error(`empty ${url}`);
      return type === 'json' ? JSON.parse(text) : text;
    } catch (error) {
      last = error;
      await wait((attempt + 1) * 2000);
    }
  }
  throw last;
}

function csv(line) {
  const out = [];
  let current = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') { current += '"'; i += 1; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      out.push(current.trim());
      current = '';
    } else current += char;
  }
  out.push(current.trim());
  return out;
}

const critical = [
  '/index.html', '/indicators/', '/indicators/real-gdp/', '/indicators/real-gdp/status.json',
  '/indicators/internet-use/', '/indicators/internet-use/data.json', '/indicators/internet-use/data.csv',
  '/indicators/internet-use/history.json', '/indicators/internet-use/country/index.json',
  '/indicators/internet-use/country/deu/', '/indicators/internet-use/country/deu/data.json',
  '/indicators/internet-use/country/deu/data.csv', '/indicators/internet-use/region/index.json',
  '/build.json', '/evidence/', '/evidence/index.json', '/sitemap.xml', '/robots.txt',
];
await Promise.all(critical.map(path => get(path)));

const [home, robots, sitemap, gdp, source, history, index, build, parent] = await Promise.all([
  get('/index.html'), get('/robots.txt'), get('/sitemap.xml'), get('/indicators/real-gdp/status.json', 'json'),
  get('/indicators/internet-use/data.json', 'json'), get('/indicators/internet-use/history.json', 'json'),
  get('/indicators/internet-use/country/index.json', 'json'), get('/build.json', 'json'), get('/indicators/internet-use/'),
]);

if (!/rel="canonical"/i.test(home)) throw new Error('home canonical missing');
if (!robots.includes(`Sitemap: ${base}/sitemap.xml`)) throw new Error('robots sitemap mismatch');
if (!sitemap.includes(`${base}/evidence/germany-population-revision-2025/`)) throw new Error('Germany REAL evidence missing from sitemap');
if (/\/indicators\/internet-use\/country\/[a-z]{3}\/history\//.test(sitemap)) throw new Error('legacy country history route returned to sitemap');
if (gdp?.indicator?.code !== 'NY.GDP.MKTP.KD' || gdp?.screeningStatus !== 'BLOCKED_METHODOLOGY_COMPARABILITY' || gdp?.publishableRevisionData !== false) throw new Error('GDP fail-closed contract violated');

if (source?.status !== 'CURRENT_VERIFIED' || source?.indicator?.code !== 'IT.NET.USER.ZS' || !Array.isArray(source.records)) throw new Error('internet-use snapshot contract mismatch');
if (history?.status !== 'CURRENT_VERIFIED_HISTORY' || history?.indicator?.code !== source.indicator.code || !Array.isArray(history.records)) throw new Error('internet-use history contract mismatch');
if (index?.schemaVersion !== '1.2' || index?.status !== 'CURRENT_VERIFIED' || index?.indicator !== source.indicator.code || index?.observationYear !== source.observationYear) throw new Error('internet-use country index contract mismatch');
if (!index.provenance?.publisher || !index.provenance?.metadataUrl || !index.provenance?.retrievalUrl || !index.provenance?.license) throw new Error('internet-use provenance incomplete');
if (index.countries?.length !== source.records.length || history.records.length !== index.countries.length) throw new Error('internet-use country coverage mismatch');
if (build.internetUseCountryProfiles !== index.countries.length) throw new Error('build.json country count mismatch');

if (parent.includes('id="country-profiles"')) throw new Error('duplicate country-card directory returned to parent page');
if (Buffer.byteLength(parent, 'utf8') >= 125000) throw new Error('internet-use parent exceeds HTML performance budget');
const jsonLd = [...parent.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(match => JSON.parse(match[1]));
const itemList = jsonLd.find(node => node['@type'] === 'ItemList');
if (!itemList || itemList.numberOfItems !== index.countries.length || itemList.itemListElement?.length !== index.countries.length) throw new Error('country ItemList mismatch');
const listed = new Set(itemList.itemListElement.map(item => item.url));
const sitemapLocations = new Set([...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(match => match[1]));
const historyByCode = new Map(history.records.map(record => [record.code, record]));
const seen = new Set();

for (const country of index.countries) {
  if (!/^[A-Z]{3}$/.test(country.code) || !country.url || !country.machineDataUrl || !country.machineCsvUrl) throw new Error(`malformed country ${country.code || 'unknown'}`);
  if (seen.has(country.code)) throw new Error(`duplicate country ${country.code}`);
  seen.add(country.code);
  const historical = historyByCode.get(country.code);
  if (!historical) throw new Error(`history missing ${country.code}`);
  const human = `${base}${country.url}`;
  if (!sitemapLocations.has(human)) throw new Error(`sitemap missing ${country.code}`);
  if (!listed.has(human)) throw new Error(`ItemList missing ${country.code}`);

  const [html, payload, csvText] = await Promise.all([
    get(country.url), get(country.machineDataUrl, 'json'), get(country.machineCsvUrl),
  ]);
  const observations = payload.observations;
  const latest = Array.isArray(observations) && observations.length ? observations.at(-1) : null;
  const first = Array.isArray(observations) && observations.length ? observations[0] : null;

  if (payload.schemaVersion !== '1.1' || payload.status !== 'CURRENT_VERIFIED' || payload.indicator?.code !== source.indicator.code || payload.entity?.code !== country.code || payload.entity?.name !== historical.country) throw new Error(`country identity mismatch ${country.code}`);
  if (payload.entity?.region?.code !== historical.region?.code || payload.entity?.region?.name !== historical.region?.name) throw new Error(`country history-region mismatch ${country.code}`);
  if (!first || !latest || observations.length !== historical.observations.length || first.year !== historical.firstYear || latest.year !== historical.latestYear || Number(latest.value) !== Number(historical.latestValue)) throw new Error(`country time-series coverage mismatch ${country.code}`);
  if (payload.period?.firstYear !== first.year || payload.period?.latestYear !== latest.year) throw new Error(`country time-series period mismatch ${country.code}`);
  if (payload.observation?.year !== latest.year || Number(payload.observation?.value) !== Number(latest.value)) throw new Error(`country latest-summary mismatch ${country.code}`);
  if (payload.product?.type !== 'country-time-series' || payload.product?.primary !== true || payload.product?.latestObservationIsSummary !== true || payload.product?.missingYearsInterpolated !== false) throw new Error(`country product contract mismatch ${country.code}`);
  if (payload.scope?.completeGlobalRanking !== false || payload.scope?.historicalRevisionProduct !== false || payload.humanUrl !== human) throw new Error(`country scope mismatch ${country.code}`);
  if (!html.includes(`rel="canonical" href="${human}"`) || !html.includes('./data.json') || !html.includes('./data.csv') || !/internet penetration over time/i.test(html)) throw new Error(`country HTML time-series contract mismatch ${country.code}`);

  const lines = csvText.trim().split(/\r?\n/).map(csv);
  const cols = lines[0];
  const row = lines[1];
  for (const key of ['entity_code', 'indicator_code', 'reference_year', 'value']) if (!cols.includes(key)) throw new Error(`country CSV missing ${key}: ${country.code}`);
  const value = key => row[cols.indexOf(key)];
  if (value('entity_code') !== country.code || value('indicator_code') !== source.indicator.code || Number(value('reference_year')) !== Number(latest.year) || Number(value('value')) !== Number(latest.value) || lines.length - 1 !== observations.length) throw new Error(`country CSV time-series mismatch ${country.code}`);
}

const regionIndex = await get('/indicators/internet-use/region/index.json', 'json');
if (regionIndex.schemaVersion !== '1.0' || regionIndex.status !== 'CURRENT_VERIFIED' || regionIndex.indicator !== source.indicator.code || regionIndex.observationYear !== source.observationYear || !Array.isArray(regionIndex.regions) || regionIndex.regions.length !== 7) throw new Error('internet-use region index contract mismatch');
if (build.internetUseRegionalPages !== regionIndex.regions.length) throw new Error('build.json regional page count mismatch');
const indexedRegionCodes = new Set(index.countries.map(country => country.region?.code));
let regionCountryTotal = 0;
for (const region of regionIndex.regions) {
  regionCountryTotal += region.countries;
  const [html, payload] = await Promise.all([get(region.url), get(region.machineDataUrl, 'json')]);
  if (!indexedRegionCodes.has(region.code) || payload.region?.code !== region.code || payload.region?.name !== region.name || payload.observationYear !== source.observationYear || payload.records?.length !== region.countries) throw new Error(`region identity mismatch ${region.code}`);
  if (!html.includes('./data.json') || !html.includes('Regional picture') || !html.includes('How to use this comparison')) throw new Error(`region HTML contract mismatch ${region.code}`);
}
if (regionCountryTotal !== index.countries.length) throw new Error('regional coverage mismatch');

const evidence = await get('/evidence/index.json', 'json');
if (evidence.schemaVersion !== '1.2' || !Array.isArray(evidence.evidence) || !evidence.evidence.length) throw new Error('evidence index mismatch');
let germany = false;
for (const record of evidence.evidence) {
  if (record.status !== 'REAL' || record.discoveryReady !== true || !record.machineReadable?.json || !record.machineReadable?.csv) throw new Error(`non-ready evidence ${record.slug}`);
  const payload = await get(record.machineReadable.json, 'json');
  if (payload.status !== 'REAL' || payload.indicator?.code !== record.indicator?.code || payload.entity?.code !== record.entity?.code || payload.referenceYear !== record.referenceYear) throw new Error(`evidence JSON identity mismatch ${record.slug}`);
  if (record.indicator?.code === 'SP.POP.TOTL' && record.entity?.code === 'DEU') germany = true;
}
if (!germany) throw new Error('Germany population sentinel missing');

console.log(`LIVE RELEASE CONTRACT VERIFIED: ${index.countries.length} primary country time series, ${regionIndex.regions.length} snapshot regions, ${evidence.evidence.length} REAL evidence records`);
