import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../site/indicators/internet-use/', import.meta.url);
const dataUrl = new URL('data.json', root);
const htmlUrl = new URL('index.html', root);
const START = '<!-- internet-use-region-highlights:start -->';
const END = '<!-- internet-use-region-highlights:end -->';

const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function formatPercent(value) {
  return `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
}

function buildHighlights(data) {
  const regions = [...data.records.reduce((map, record) => {
    const code = record?.region?.code;
    const name = record?.region?.name?.trim();
    if (!/^[A-Z]{3}$/.test(code) || !name) throw new Error(`invalid region metadata for ${record?.code ?? 'unknown country'}`);
    if (!map.has(code)) map.set(code, { code, name, records: [] });
    const region = map.get(code);
    if (region.name !== name) throw new Error(`inconsistent region name for ${code}`);
    region.records.push(record);
    return map;
  }, new Map()).values()].sort((a, b) => a.name.localeCompare(b.name));

  const cards = regions.map((region) => {
    const values = region.records.map((record) => record.value);
    const regionMedian = median(values);
    const topValue = Math.max(...values);
    const leaders = region.records
      .filter((record) => record.value === topValue)
      .map((record) => record.country)
      .sort((a, b) => a.localeCompare(b));
    const leaderText = leaders.length <= 2 ? leaders.join(' and ') : `${leaders.slice(0, 2).join(', ')} +${leaders.length - 2} tied`;
    return `<article class="card region-highlight"><span class="pill">${esc(region.records.length)} COUNTRIES</span><h3>${esc(region.name)}</h3><p><strong>Median:</strong> ${formatPercent(regionMedian)} · <strong>Highest:</strong> ${formatPercent(topValue)} (${esc(leaderText)})</p><p><a href="./region/${esc(region.code.toLowerCase())}/">Explore ${esc(region.name)} →</a></p></article>`;
  }).join('');

  return `${START}<section class="section section-soft" aria-labelledby="region-highlights-heading"><div class="wrap"><h2 id="region-highlights-heading">Compare internet use by region</h2><p>Use regional medians and highest observed values to choose where to explore next. Every figure below is calculated from the same verified ${data.observationYear} country snapshot used by the table.</p><div class="grid">${cards}</div></div></section>${END}`;
}

const data = JSON.parse(await readFile(dataUrl, 'utf8'));
if (data?.status !== 'CURRENT_VERIFIED' || data?.indicator?.code !== 'IT.NET.USER.ZS') throw new Error('internet-use data must be current and verified');
if (!Array.isArray(data.records) || data.records.length < 2) throw new Error('internet-use records are missing');
if (!data.records.every((record) => record.year === data.observationYear && typeof record.value === 'number' && record.value >= 0 && record.value <= 100)) throw new Error('internet-use records must be same-year percentages');

let html = await readFile(htmlUrl, 'utf8');
html = html.replace(new RegExp(`${START}[\\s\\S]*?${END}`), '');
const anchor = '<nav class="region-directory"';
if (!html.includes(anchor)) throw new Error('region directory anchor not found');
html = html.replace(anchor, `${buildHighlights(data)}${anchor}`);
await writeFile(htmlUrl, html);
console.log(`Added ${new Set(data.records.map((record) => record.region.code)).size} regional highlights to internet-use landing page.`);
