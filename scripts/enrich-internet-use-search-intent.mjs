import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../site/indicators/internet-use/', import.meta.url);
const data = JSON.parse(await readFile(new URL('data.json', root), 'utf8'));

if (data?.status !== 'CURRENT_VERIFIED' || data?.indicator?.code !== 'IT.NET.USER.ZS') {
  throw new Error('search-intent enrichment requires verified IT.NET.USER.ZS data');
}

const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const marker = 'data-search-intent="internet-penetration"';
let changed = 0;

for (const record of data.records) {
  const code = String(record.code).toLowerCase();
  const pageUrl = new URL(`country/${code}/index.html`, root);
  let html = await readFile(pageUrl, 'utf8');
  if (html.includes(marker)) continue;

  const country = esc(record.country);
  const year = data.observationYear;
  const value = record.value;

  const oldTitle = `<title>${country} internet use rate in ${year}: ${value}% | World Discovery Engine</title>`;
  const newTitle = `<title>${country} internet penetration rate ${year}: ${value}% | World Discovery Engine</title>`;
  if (!html.includes(oldTitle)) throw new Error(`expected title not found for ${record.code}`);
  html = html.replace(oldTitle, newTitle);

  const oldH1 = `<h1>${country} internet use rate: ${value}%</h1>`;
  const newH1 = `<h1>${country} internet penetration rate in ${year}: ${value}%</h1>`;
  if (!html.includes(oldH1)) throw new Error(`expected H1 not found for ${record.code}`);
  html = html.replace(oldH1, newH1);

  const oldLead = `<p><strong>${value}%</strong> of people in ${country} used the internet in ${record.year}. Among the`;
  const newLead = `<p><strong>${value}%</strong> of people in ${country} used the internet in ${record.year}. This population share is commonly described as ${country}'s <strong>internet penetration rate</strong>. Among the`;
  if (!html.includes(oldLead)) throw new Error(`expected lead not found for ${record.code}`);
  html = html.replace(oldLead, newLead);

  const compareSection = `<section class="section"><div class="wrap"><h2>How ${country} compares</h2>`;
  const intentSection = `<section class="section section-soft" ${marker}><div class="wrap"><h2>What does “internet penetration rate” mean here?</h2><p>On this page, “internet penetration rate” means the percentage of individuals who used the internet, matching World Development Indicators code <strong>${esc(data.indicator.code)}</strong>. It is a population-use measure; it is not the same as fixed-broadband subscriptions, mobile subscriptions, connection speed or household access.</p><p>The observation shown here is <strong>${year}</strong>. The retrieval date is kept separately in the provenance section so a newer download date is never presented as a newer observation year.</p></div></section>`;
  if (!html.includes(compareSection)) throw new Error(`comparison section not found for ${record.code}`);
  html = html.replace(compareSection, `${intentSection}${compareSection}`);

  await writeFile(pageUrl, html, 'utf8');
  changed += 1;
}

console.log(`Internet-use search-intent enrichment complete: ${changed} country pages updated.`);
