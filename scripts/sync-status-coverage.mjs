import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('data/wdi/index.json', siteRoot), 'utf8'));
const countryIndex = JSON.parse(await readFile(new URL('countries/index.json', siteRoot), 'utf8'));

const indicatorCount = Array.isArray(catalog?.indicators)
  ? catalog.indicators.filter((item) => item?.status === 'CURRENT_VERIFIED').length
  : 0;
const countryCount = Array.isArray(countryIndex?.countries) ? countryIndex.countries.length : 0;

if (!indicatorCount) throw new Error('status coverage sync requires at least one CURRENT_VERIFIED indicator');
if (!countryCount) throw new Error('status coverage sync requires at least one generated country profile');

const pages = [
  'status/index.html',
  'de/status/index.html',
  'es/status/index.html',
  'fr/status/index.html',
  'zh-hans/status/index.html'
];

function syncFacts(html, path) {
  let factIndex = 0;
  const output = html.replace(/<article class="fact">([\s\S]*?)<\/article>/g, (article) => {
    const index = factIndex++;
    if (index > 1) return article;
    const expected = index === 0 ? indicatorCount : countryCount;
    if (!/<div class="value">[\s\S]*?<\/div>/.test(article)) {
      throw new Error(`${path}: fact ${index + 1} has no value element`);
    }
    return article.replace(/<div class="value">[\s\S]*?<\/div>/, `<div class="value">${expected}</div>`);
  });

  if (factIndex < 2) throw new Error(`${path}: expected at least two status facts`);
  return output;
}

for (const path of pages) {
  const url = new URL(path, siteRoot);
  const html = await readFile(url, 'utf8');
  const output = syncFacts(html, path);
  await writeFile(url, output, 'utf8');
}

console.log(`Synced status coverage to ${indicatorCount} verified indicators and ${countryCount} generated country profiles.`);
