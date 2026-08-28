import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../site/indicators/internet-use/', import.meta.url);
const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

export async function buildInternetUseRegionDirectory() {
  const data = JSON.parse(await readFile(new URL('data.json', root), 'utf8'));
  const index = JSON.parse(await readFile(new URL('region/index.json', root), 'utf8'));

  if (data?.status !== 'CURRENT_VERIFIED' || index?.status !== 'CURRENT_VERIFIED' || index?.indicator !== 'IT.NET.USER.ZS') {
    throw new Error('region directory requires verified Internet-use data');
  }
  if (data.observationYear !== index.observationYear || !Array.isArray(index.regions) || index.regions.length < 2) {
    throw new Error('region directory index is inconsistent');
  }

  const canonical = 'https://worlddiscoverydata.com/indicators/internet-use/region/';
  const cards = index.regions.map((region) => {
    const records = data.records.filter((record) => record.region?.code === region.code).sort((a, b) => b.value - a.value);
    const average = records.reduce((sum, record) => sum + record.value, 0) / records.length;
    return `<article class="card"><span class="pill">${esc(region.code)} · ${region.countries} countries</span><h2><a href="./${esc(region.code.toLowerCase())}/">${esc(region.name)}</a></h2><p>Average across included ${data.observationYear} observations: <strong>${average.toFixed(1)}%</strong>. Highest included country: ${esc(records[0].country)} at ${records[0].value}%.</p><p><a href="./${esc(region.code.toLowerCase())}/">Open ${esc(region.name)} ranking →</a></p></article>`;
  }).join('');

  const structured = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Internet penetration and use by region — ${data.observationYear}`,
    description: `Browse verified ${data.observationYear} regional comparisons for the share of people using the internet, a measure commonly described as internet penetration rate.`,
    url: canonical,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: index.regions.map((region, i) => ({ '@type': 'ListItem', position: i + 1, name: region.name, url: `${canonical}${region.code.toLowerCase()}/` }))
    }
  };

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Internet penetration and use by region — ${data.observationYear} | World Discovery Engine</title><meta name="description" content="Compare verified ${data.observationYear} internet penetration and internet-use rates across ${index.regions.length} World Bank regions, with country rankings and official ITU/WDI provenance."><link rel="canonical" href="${canonical}"><link rel="alternate" type="application/json" href="./index.json"><link rel="stylesheet" href="../../../styles.css"><script type="application/ld+json">${JSON.stringify(structured)}</script></head><body><header class="topbar"><div class="wrap"><div class="brand">World Discovery Engine</div><nav class="nav" aria-label="Primary"><a href="../../../index.html">Home</a><a href="../../../evidence/index.html">Evidence</a><a href="../../index.html" aria-current="page">Indicators</a><a href="../../../explore/index.html">Explore</a><a href="../../../methodology/index.html">Methodology</a><a href="../../../sources/index.html">Sources</a></nav></div></header><main><section class="hero hero-compact"><div class="wrap"><div class="eyebrow">Internet use · regional discovery · ${data.observationYear}</div><h1>Compare internet penetration and use by region</h1><p>Browse ${index.regions.length} regional views built from the same verified ${data.observationYear} country snapshot. The underlying indicator is the share of individuals using the internet (% of population), a measure often described in searches as the internet penetration rate.</p><span class="pill">${data.observationYear} · ${data.records.length} VERIFIED COUNTRIES · ITU VIA WDI</span></div></section><section class="section"><div class="wrap"><h2>Regional internet-use comparisons</h2><p>These pages compare people actually reported as using the internet. They do not measure household subscriptions, mobile-network coverage or whether internet service is physically available at an address.</p><div class="grid">${cards}</div><p><a href="../">Compare all ${data.records.length} countries →</a> · <a href="./index.json">Regional JSON index →</a></p></div></section><section class="section section-soft"><div class="wrap"><h2>How to read these pages</h2><p>Regional summaries use only countries with a verified ${data.observationYear} observation. Missing countries are not filled with older values. Region membership comes from the official World Bank country metadata used by the normalized source.</p></div></section></main><footer class="footer"><div class="wrap">World Discovery Engine · Same-year comparisons with explicit provenance.</div></footer></body></html>`;

  await writeFile(new URL('region/index.html', root), html, 'utf8');
  console.log(`Built Internet-use region directory for ${index.regions.length} regions.`);
  return { regions: index.regions.length, observationYear: data.observationYear };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await buildInternetUseRegionDirectory();
}
