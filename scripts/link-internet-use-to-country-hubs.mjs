import { access, readdir, readFile, writeFile } from 'node:fs/promises';

const internetCountries = new URL('../site/indicators/internet-use/country/', import.meta.url);
const countryHubs = new URL('../site/countries/', import.meta.url);

const entries = await readdir(internetCountries, { withFileTypes: true });
let linked = 0;

for (const entry of entries) {
  if (!entry.isDirectory() || !/^[a-z]{3}$/.test(entry.name)) continue;

  const hub = new URL(`${entry.name}/index.html`, countryHubs);
  try {
    await access(hub);
  } catch {
    continue;
  }

  const pageUrl = new URL(`${entry.name}/index.html`, internetCountries);
  let html = await readFile(pageUrl, 'utf8');
  if (html.includes(`href="../../../../countries/${entry.name}/"`)) continue;

  const h1 = html.match(/<h1>([^<]+?) internet use rate:/i);
  const country = h1?.[1] ?? entry.name.toUpperCase();
  const bridge = `<section class="section section-soft"><div class="wrap"><div class="eyebrow">Keep exploring</div><h2>Explore more data for ${country}</h2><p>Internet use is one part of the picture. Continue to the full ${country} profile for population, economy, health, technology and environment indicators, with the observation year shown for every value.</p><p><a href="../../../../countries/${entry.name}/">Explore ${country} country data →</a></p></div></section>`;
  const marker = '<section class="section"><div class="wrap"><h2>Definition and provenance</h2>';
  if (!html.includes(marker)) throw new Error(`Definition marker missing for ${entry.name}`);
  html = html.replace(marker, `${bridge}${marker}`);
  await writeFile(pageUrl, html, 'utf8');
  linked += 1;
}

console.log(`Linked ${linked} internet-use country pages to comprehensive country hubs.`);
