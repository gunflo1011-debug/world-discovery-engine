import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const siteRoot = new URL('../site/', import.meta.url);
const CC_BY_4 = 'https://creativecommons.org/licenses/by/4.0/';

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await htmlFiles(path));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(path);
  }
  return out;
}

function datasetNodes(json) {
  if (!json || typeof json !== 'object') return [];
  const nodes = Array.isArray(json) ? json : json['@graph'] ?? [json];
  return nodes.filter((node) => {
    const type = node?.['@type'];
    return type === 'Dataset' || (Array.isArray(type) && type.includes('Dataset'));
  });
}

function metaDescription(html) {
  return html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1]?.trim() ?? '';
}

function normalizeDataset(dataset, html, fallbackDescription) {
  if (!dataset.description && fallbackDescription) dataset.description = fallbackDescription;

  // Creator attribution is provenance, not presentation metadata. Never invent it.
  // A Dataset without an explicit source-backed creator is downgraded below.
  if (typeof dataset.license === 'object' && typeof dataset.license?.url === 'string') {
    dataset.license = dataset.license.url;
  }
  if (!dataset.license && /Source license:\s*CC BY 4\.0\b/i.test(html)) dataset.license = CC_BY_4;

  const validCreator = dataset.creator && ['Organization', 'Person'].includes(dataset.creator['@type']) && String(dataset.creator.name ?? '').trim();
  const eligible = String(dataset.description ?? '').trim().length >= 20 && validCreator && typeof dataset.license === 'string' && /^https:\/\//.test(dataset.license);
  if (!eligible) {
    // Do not advertise a Google Dataset enhancement when required source-backed
    // metadata is unavailable. Preserve the JSON-LD entity as a CreativeWork.
    dataset['@type'] = 'CreativeWork';
  }
}

let changedFiles = 0;
let eligibleDatasets = 0;
let downgradedDatasets = 0;
for (const path of await htmlFiles(siteRoot.pathname)) {
  let html = await readFile(path, 'utf8');
  const description = metaDescription(html);
  let changed = false;
  html = html.replace(/(<script\s+type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi, (full, open, raw, close) => {
    let json;
    try { json = JSON.parse(raw); } catch { return full; }
    const datasets = datasetNodes(json);
    if (!datasets.length) return full;
    for (const dataset of datasets) {
      const beforeType = dataset['@type'];
      normalizeDataset(dataset, html, description);
      if (dataset['@type'] === 'Dataset') eligibleDatasets += 1;
      else if (beforeType === 'Dataset') downgradedDatasets += 1;
    }
    changed = true;
    return `${open}${JSON.stringify(json)}${close}`;
  });
  if (changed) {
    await writeFile(path, html, 'utf8');
    changedFiles += 1;
  }
}
console.log(`Dataset structured-data normalization: ${changedFiles} files, ${eligibleDatasets} eligible Dataset nodes, ${downgradedDatasets} downgraded nodes.`);
