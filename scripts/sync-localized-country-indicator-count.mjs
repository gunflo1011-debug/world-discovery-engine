import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = fileURLToPath(new URL('../site/', import.meta.url));
const catalogPath = path.join(siteRoot, 'data/wdi/index.json');
const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
const indicatorCount = (catalog.indicators ?? []).filter((item) => item.status === 'CURRENT_VERIFIED').length;

if (!Number.isInteger(indicatorCount) || indicatorCount <= 0) {
  throw new Error(`Invalid CURRENT_VERIFIED indicator count: ${indicatorCount}`);
}

const COPY = {
  de: (n) => `Alle ${n} Indikatoren erkunden`,
  es: (n) => `Explorar los ${n} indicadores`,
  fr: (n) => `Explorer les ${n} indicateurs`,
  'zh-hans': (n) => `探索全部 ${n} 个指标`
};

const LEGACY = {
  de: /Alle \d+ Indikatoren erkunden/g,
  es: /Explorar los \d+ indicadores/g,
  fr: /Explorer les \d+ indicateurs/g,
  'zh-hans': /探索全部 \d+ 个指标/g
};

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

let changed = 0;
for (const [locale, formatter] of Object.entries(COPY)) {
  const root = path.join(siteRoot, locale, 'countries');
  const files = await walk(root);
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const next = html.replace(LEGACY[locale], formatter(indicatorCount));
    if (next !== html) {
      await writeFile(file, next, 'utf8');
      changed += 1;
    }
  }
}

console.log(`Synchronized localized country CTAs to ${indicatorCount} verified indicators across ${changed} pages.`);
