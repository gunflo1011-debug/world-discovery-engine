import { readFile, readdir, writeFile } from 'node:fs/promises';

const countryRoot = new URL('../site/indicators/internet-use/country/', import.meta.url);
const legacyBranding = /World Discovery Data|World Discovery Engine/g;

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const url = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, dir);
    if (entry.isDirectory()) files.push(...await htmlFiles(url));
    else if (entry.name.endsWith('.html')) files.push(url);
  }
  return files;
}

let changed = 0;
for (const file of await htmlFiles(countryRoot)) {
  const html = await readFile(file, 'utf8');
  const normalized = html.replace(legacyBranding, 'World Discovery');
  if (normalized === html) continue;
  await writeFile(file, normalized, 'utf8');
  changed += 1;
}

console.log(`Normalized current World Discovery branding on ${changed} internet-use country pages.`);
