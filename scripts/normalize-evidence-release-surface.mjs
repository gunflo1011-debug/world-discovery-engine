import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const evidenceRoot = fileURLToPath(new URL('../site/evidence/', import.meta.url));
const LEGACY_ORIGIN = 'https://gunflo1011-debug.github.io/world-discovery-engine';
const CANONICAL_ORIGIN = 'https://worlddiscoverydata.com';
const LEGACY_BRANDS = ['World Discovery Engine', 'World Discovery Data'];

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

let changed = 0;
const files = await htmlFiles(evidenceRoot);
for (const file of files) {
  const before = await readFile(file, 'utf8');
  let after = before.replaceAll(LEGACY_ORIGIN, CANONICAL_ORIGIN);
  for (const legacy of LEGACY_BRANDS) after = after.replaceAll(legacy, 'World Discovery');
  if (after !== before) {
    await writeFile(file, after, 'utf8');
    changed += 1;
  }
  for (const legacy of LEGACY_BRANDS) {
    if (after.includes(legacy)) throw new Error(`${path.relative(evidenceRoot, file)} still contains ${legacy}`);
  }
  if (after.includes(LEGACY_ORIGIN)) throw new Error(`${path.relative(evidenceRoot, file)} still contains the legacy GitHub Pages origin`);
}

console.log(`Normalized evidence release branding/domain in ${changed}/${files.length} HTML pages.`);
