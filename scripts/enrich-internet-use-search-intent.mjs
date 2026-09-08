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
const measureHeading = '<h2>What this measure means</h2>';
let changed = 0;
let skipped = 0;

for (const record of data.records) {
  const code = String(record.code).toLowerCase();
  const pageUrl = new URL(`country/${code}/index.html`, root);
  let html = await readFile(pageUrl, 'utf8');
  if (html.includes(marker)) continue;

  // This enricher intentionally runs after promote-internet-use-series.mjs.
  // Only promoted time-series profiles contain this stable measure section.
  if (!html.includes(measureHeading)) {
    skipped += 1;
    continue;
  }

  const country = esc(record.country);
  const year = data.observationYear;
  const intentBlock = `<div ${marker}><p>On World Discovery Data, “internet penetration rate” and “internet users” both refer to the share of individuals who used the internet, matching World Development Indicators code <strong>${esc(data.indicator.code)}</strong>. It is a population-use measure; it is not the same as fixed-broadband subscriptions, mobile subscriptions, connection speed or household access.</p><p><a href="/data/internet-use/">Compare internet users by country and year →</a> · <a href="../../">Explore the ${year} internet-use ranking →</a></p></div>`;

  html = html.replace(measureHeading, `${measureHeading}${intentBlock}`);
  await writeFile(pageUrl, html, 'utf8');
  changed += 1;
}

console.log(`Internet-use search-intent enrichment complete: ${changed} promoted country pages updated, ${skipped} non-promoted pages skipped.`);
