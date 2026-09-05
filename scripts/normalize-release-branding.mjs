import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = fileURLToPath(new URL('../site/', import.meta.url));
const legacyBrand = /World Discovery (?:Engine|Data)/g;
const legacyOrigins = [
  'https://gunflo1011-debug.github.io/world-discovery-engine',
  'http://gunflo1011-debug.github.io/world-discovery-engine'
];

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
let brandReplacements = 0;
let originReplacements = 0;

for (const file of await walk(siteRoot)) {
  const before = await readFile(file, 'utf8');
  let after = before.replace(legacyBrand, () => {
    brandReplacements += 1;
    return 'World Discovery';
  });

  for (const origin of legacyOrigins) {
    if (!after.includes(origin)) continue;
    const parts = after.split(origin);
    originReplacements += parts.length - 1;
    after = parts.join('https://worlddiscoverydata.com');
  }

  if (after === before) continue;
  await writeFile(file, after, 'utf8');
  changed += 1;
}

console.log(`Normalized final release branding on ${changed} HTML pages (${brandReplacements} brand replacements, ${originReplacements} legacy-origin replacements).`);
