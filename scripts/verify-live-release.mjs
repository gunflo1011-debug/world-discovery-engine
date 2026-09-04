const base = (process.env.BASE_URL || 'https://worlddiscoverydata.com').replace(/\/$/, '');
const release = process.env.RELEASE_SHA || process.env.GITHUB_SHA || String(Date.now());
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
      const response = await fetch(url, { redirect: 'follow', headers: { 'cache-control': 'no-cache', pragma: 'no-cache' } });
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

const critical = [
  '/', '/index.html', '/countries/', '/countries/deu/', '/data/', '/data/population/', '/data/gdp-per-capita/',
  '/data/life-expectancy/', '/data/internet-use/', '/compare/', '/indicators/', '/indicators/internet-use/',
  '/indicators/internet-use/data.json', '/indicators/internet-use/data.csv', '/indicators/internet-use/history.json',
  '/indicators/internet-use/country/index.json', '/indicators/internet-use/country/deu/', '/build.json',
  '/evidence/', '/evidence/index.json', '/sitemap.xml', '/robots.txt'
];
await Promise.all(critical.map(path => get(path)));

const [home, countries, robots, sitemap, source, history, index, build, parent, evidence] = await Promise.all([
  get('/index.html'), get('/countries/'), get('/robots.txt'), get('/sitemap.xml'), get('/indicators/internet-use/data.json', 'json'),
  get('/indicators/internet-use/history.json', 'json'), get('/indicators/internet-use/country/index.json', 'json'),
  get('/build.json', 'json'), get('/indicators/internet-use/'), get('/evidence/')
]);

if (!/rel="canonical"/i.test(home)) throw new Error('home canonical missing');
if (!countries.includes('COUNTRY &amp; TERRITORY PROFILES')) throw new Error('country directory territory wording missing');
if (/Showing all \d+ country profiles\./i.test(countries)) throw new Error('country directory still labels all profiles as countries');
if (!robots.includes(`Sitemap: ${base}/sitemap.xml`)) throw new Error('robots sitemap mismatch');
if (source?.status !== 'CURRENT_VERIFIED' || source?.indicator?.code !== 'IT.NET.USER.ZS' || !Array.isArray(source.records)) throw new Error('internet-use snapshot contract mismatch');
if (history?.status !== 'CURRENT_VERIFIED_HISTORY' || history?.indicator?.code !== source.indicator.code || !Array.isArray(history.records)) throw new Error('internet-use history contract mismatch');
if (index?.status !== 'CURRENT_VERIFIED' || index?.indicator !== source.indicator.code || index?.observationYear !== source.observationYear) throw new Error('internet-use country index contract mismatch');
if (build.internetUseCountryProfiles !== index.countries.length) throw new Error('build.json country count mismatch');
if (parent.includes('id="country-profiles"')) throw new Error('duplicate country-card directory returned to parent page');
if (/[−-]0(?:\.0+)?%/.test(evidence)) throw new Error('evidence contains a negative-zero percentage');

const sitemapLocations = new Set([...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(match => match[1]));
for (const expected of [`${base}/countries/`, `${base}/data/`, `${base}/data/population/`, `${base}/compare/`]) {
  if (!sitemapLocations.has(expected)) throw new Error(`sitemap missing ${expected}`);
}

console.log(`LIVE RELEASE CONTRACT VERIFIED: critical discovery routes reachable, precise country/territory wording, ${index.countries.length} internet-use country profiles, no negative-zero evidence percentages`);
