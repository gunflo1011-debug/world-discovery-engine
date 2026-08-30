import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../site/indicators/internet-use/', import.meta.url);
const dataUrl = new URL('data.json', root);
const countryRoot = new URL('country/', root);
const markers = [
  '<section class="section"><div class="wrap"><h2>Definition and provenance</h2>',
  '<section class="section"><div class="wrap"><h2>Source and methodology</h2>'
];

const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const slugFor = (code) => String(code).toLowerCase();
const formatNumber = (value) => Number(value.toFixed(2)).toString();

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function ordinal(value) {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function validate(data) {
  if (data?.status !== 'CURRENT_VERIFIED' || data?.indicator?.code !== 'IT.NET.USER.ZS') {
    throw new Error('regional context requires CURRENT_VERIFIED Internet-use data');
  }
  if (!Number.isInteger(data?.observationYear) || !Array.isArray(data?.records) || data.records.length < 2) {
    throw new Error('regional context requires a same-year country dataset');
  }
  for (const record of data.records) {
    if (record.year !== data.observationYear) throw new Error('regional context forbids mixed observation years');
    if (!/^[A-Z]{3}$/.test(record?.code) || !/^[A-Z]{3}$/.test(record?.region?.code) || !record?.region?.name || typeof record.value !== 'number') {
      throw new Error('regional context requires source-backed country, region and numeric value fields');
    }
  }
}

function sectionFor(record, records) {
  const regional = records
    .filter((item) => item.region.code === record.region.code)
    .sort((a, b) => b.value - a.value || a.country.localeCompare(b.country));
  const rank = 1 + regional.filter((item) => item.value > record.value).length;
  const regionMedian = median(regional.map((item) => item.value));
  const delta = record.value - regionMedian;
  const peers = regional
    .filter((item) => item.code !== record.code)
    .sort((a, b) => Math.abs(a.value - record.value) - Math.abs(b.value - record.value) || a.country.localeCompare(b.country))
    .slice(0, 3);

  const medianText = delta === 0
    ? `matches the regional median of ${formatNumber(regionMedian)}%`
    : `is ${formatNumber(Math.abs(delta))} percentage points ${delta > 0 ? 'above' : 'below'} the regional median of ${formatNumber(regionMedian)}%`;
  const peerLinks = peers.length
    ? `<p><strong>Closest same-region observations:</strong> ${peers.map((peer) => `<a href="../${slugFor(peer.code)}/">${esc(peer.country)} (${formatNumber(peer.value)}%)</a>`).join(' · ')}.</p>`
    : '<p>No additional same-region country is present in this verified dataset.</p>';

  return `<section class="section section-soft" data-regional-context="${esc(record.region.code)}"><div class="wrap"><h2>${esc(record.country)} in ${esc(record.region.name)}</h2><p>Among the ${regional.length} countries from ${esc(record.region.name)} present in this verified ${record.year} dataset, ${esc(record.country)} ranks ${ordinal(rank)}. Its ${formatNumber(record.value)}% observation ${medianText}. This comparison only describes countries present in this same-year dataset.</p>${peerLinks}</div></section>`;
}

const data = JSON.parse(await readFile(dataUrl, 'utf8'));
validate(data);

for (const record of data.records) {
  const pageUrl = new URL(`${slugFor(record.code)}/index.html`, countryRoot);
  const html = await readFile(pageUrl, 'utf8');
  const marker = markers.find((candidate) => html.includes(candidate));
  if (!marker) throw new Error(`source marker missing for ${record.code}`);

  const existingPattern = /<section class="section section-soft" data-regional-context="[A-Z]{3}">[\s\S]*?<\/section>/;
  const section = sectionFor(record, data.records);
  const cleaned = html.replace(existingPattern, '');
  await writeFile(pageUrl, cleaned.replace(marker, `${section}${marker}`), 'utf8');
}

console.log(`Added source-backed regional context to ${data.records.length} Internet-use country pages.`);
