import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const historyUrl = new URL('data/wdi/population-growth/history.json', siteRoot);
const pageUrl = new URL('countries/png/index.html', siteRoot);

const history = JSON.parse(await readFile(historyUrl, 'utf8'));
if (history?.status !== 'VERIFIED_HISTORY' || history?.indicator?.code !== 'SP.POP.GROW') {
  throw new Error('PNG evidence experiment requires VERIFIED_HISTORY for SP.POP.GROW.');
}

const observation = (history.records ?? []).find(
  (record) => record?.code === 'PNG' && Number(record?.year) === 2023 && Number.isFinite(record?.value),
);
if (!observation) throw new Error('Missing verified PNG SP.POP.GROW observation for 2023.');

const formatPercent = (value) => Number(value).toLocaleString('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

let html = await readFile(pageUrl, 'utf8');
const marker = '<div id="topics">';
if (!html.includes(marker)) throw new Error('PNG country page topics marker not found.');
if (html.includes('id="png-historical-population-growth"')) {
  throw new Error('PNG historical population growth answer was already injected.');
}

const value = formatPercent(observation.value);
const answer = `<section class="section" id="png-historical-population-growth"><div class="wrap"><div class="eyebrow">Exact historical answer</div><h2>Papua New Guinea population growth in 2023</h2><p><strong>${value}%</strong> — Papua New Guinea's population growth rate in 2023, according to World Bank World Development Indicators (<code>SP.POP.GROW</code>).</p><p class="muted">Observation year: 2023 · Source: World Bank WDI · Indicator: SP.POP.GROW. This is the published historical observation, not an estimate created by World Discovery.</p><p><a href="../../data/population-growth/">Explore Papua New Guinea population growth history and global comparisons →</a></p></div></section>`;

html = html.replace(marker, `${answer}${marker}`);
await writeFile(pageUrl, html, 'utf8');
console.log(`Injected PNG 2023 population-growth evidence answer (${value}%).`);
