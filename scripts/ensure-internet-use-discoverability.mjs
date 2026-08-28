import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const internetRoot = new URL('indicators/internet-use/', siteRoot);
const data = JSON.parse(await readFile(new URL('data.json', internetRoot), 'utf8'));
const sitemapUrl = new URL('sitemap.xml', siteRoot);

if (data?.status !== 'CURRENT_VERIFIED') throw new Error('discoverability requires CURRENT_VERIFIED internet-use data');
if (!Array.isArray(data?.records) || data.records.length < 2) throw new Error('discoverability requires country records');

const base = 'https://worlddiscoverydata.com/indicators/internet-use/';
const expected = [base, ...data.records.map((record) => `${base}country/${String(record.code).toLowerCase()}/`)];

function enrichCountrySearchIntent(page, record) {
  const country = String(record.country);
  const value = Number(record.value);
  const year = Number(record.year);
  const regionCode = String(record.region?.code ?? '').toLowerCase();
  const marker = `Internet access in ${country}: quick answer`;

  page = page.replace(
    `<title>${country} internet use rate in ${year}:`,
    `<title>${country} internet penetration and internet use in ${year}:`
  );
  page = page.replace(
    `<h1>${country} internet use rate: ${value}%</h1>`,
    `<h1>${country} internet penetration / internet use rate: ${value}%</h1>`
  );

  if (!page.includes(marker)) {
    const heroEnd = '</section><section class="section"><div class="wrap"><h2>How ';
    const regionalContext = regionCode
      ? ` <a href="../../region/${regionCode}/">See the regional internet-use comparison for additional same-year context →</a>`
      : '';
    const answer = `</section><section class="section"><div class="wrap"><h2>${marker}</h2><p><strong>${value}%</strong> of people in ${country} used the internet in ${year} in this verified ITU/WDI observation. This measure is often described as an <strong>internet penetration rate</strong>. It measures people using the internet; it does not mean household access, subscriptions, network coverage or availability at a specific address.</p>${regionalContext ? `<p>${regionalContext}</p>` : ''}</div></section><section class="section"><div class="wrap"><h2>How `;
    if (!page.includes(heroEnd)) throw new Error(`country search-intent insertion point missing for ${record.code}`);
    page = page.replace(heroEnd, answer);
  }

  // Existing generated pages may already contain the quick-answer block from an
  // earlier build. Backfill the regional link idempotently. Do not assume an
  // exact <h2> shape because prior generators may have added heading attributes.
  if (regionCode) {
    const regionalHref = `../../region/${regionCode}/`;
    if (!page.includes(`href="${regionalHref}"`)) {
      const markerIndex = page.indexOf(marker);
      const headingEndIndex = markerIndex >= 0 ? page.indexOf('</h2>', markerIndex) : -1;
      if (markerIndex < 0 || headingEndIndex < 0) throw new Error(`country search-intent heading missing for ${record.code}`);
      const insertAt = headingEndIndex + '</h2>'.length;
      const regionalParagraph = `<p><a href="${regionalHref}">See the regional internet-use comparison for additional same-year context →</a></p>`;
      page = `${page.slice(0, insertAt)}${regionalParagraph}${page.slice(insertAt)}`;
    }
  }

  return page;
}

for (const record of data.records) {
  const slug = String(record.code).toLowerCase();
  const pageUrl = new URL(`country/${slug}/index.html`, internetRoot);
  let page = await readFile(pageUrl, 'utf8');
  const canonical = `${base}country/${slug}/`;
  if (!page.includes(`<link rel="canonical" href="${canonical}">`)) throw new Error(`canonical missing for ${record.code}`);

  page = enrichCountrySearchIntent(page, record);
  if (!page.includes(`Internet access in ${record.country}: quick answer`)) throw new Error(`search-intent answer missing for ${record.code}`);
  const regionCode = String(record.region?.code ?? '').toLowerCase();
  if (regionCode && !page.includes(`href="../../region/${regionCode}/"`)) throw new Error(`regional context link missing for ${record.code}`);
  await writeFile(pageUrl, page, 'utf8');
}

let parent = await readFile(new URL('index.html', internetRoot), 'utf8');
for (const record of data.records) {
  const href = `./country/${String(record.code).toLowerCase()}/`;
  if (!parent.includes(href)) throw new Error(`parent directory link missing for ${record.code}`);
}

parent = parent.replace(
  /<title>Internet use by country — ([^<]+)<\/title>/,
  '<title>Internet penetration and internet use by country — $1</title>'
);
parent = parent.replace(
  /<h2>Internet use by country — ([^<]+)<\/h2>/,
  '<h2>Internet penetration and internet use by country — $1</h2>'
);
if (!parent.includes('What does “internet penetration” mean here?')) {
  const parentMarker = '<div class="internet-tools" id="internet-tools" hidden>';
  const explanation = '<aside class="sourcebox"><strong>What does “internet penetration” mean here?</strong> On this site it refers to the World Bank/ITU indicator <em>Individuals using the Internet (% of population)</em>. It is a usage measure, not household access, subscriptions, internet traffic or network coverage.</aside>';
  if (!parent.includes(parentMarker)) throw new Error('parent search-intent insertion point missing');
  parent = parent.replace(parentMarker, `${explanation}${parentMarker}`);
}
await writeFile(new URL('index.html', internetRoot), parent, 'utf8');

let sitemap = await readFile(sitemapUrl, 'utf8');
const closing = '</urlset>';
if (!sitemap.includes(closing)) throw new Error('sitemap closing tag missing');
for (const url of expected) {
  const entry = `<url><loc>${url}</loc></url>`;
  if (!sitemap.includes(entry)) sitemap = sitemap.replace(closing, `${entry}\n${closing}`);
}
await writeFile(sitemapUrl, sitemap, 'utf8');

console.log(`Verified canonical/internal-link discoverability, search-intent coverage and sitemap coverage for ${data.records.length} internet-use country pages.`);
