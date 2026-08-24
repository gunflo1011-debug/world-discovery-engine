import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const siteRoot = resolve(process.cwd(), 'site');
const oldBase = 'https://gunflo1011-debug.github.io/world-discovery-engine/';
const canonicalBase = 'https://worlddiscoverydata.com/';
const textExtensions = new Set(['.html', '.json', '.xml', '.txt', '.js', '.csv']);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (textExtensions.has(extname(entry.name)) || entry.name === 'CNAME') files.push(path);
  }
  return files;
}

const files = await walk(siteRoot);
let replacements = 0;
for (const path of files) {
  const source = await readFile(path, 'utf8');
  if (!source.includes(oldBase)) continue;
  const occurrences = source.split(oldBase).length - 1;
  const output = source.replaceAll(oldBase, canonicalBase);
  await writeFile(path, output, 'utf8');
  replacements += occurrences;
}

await writeFile(resolve(siteRoot, 'CNAME'), 'worlddiscoverydata.com\n', 'utf8');

const remaining = [];
for (const path of await walk(siteRoot)) {
  const source = await readFile(path, 'utf8');
  if (source.includes(oldBase)) remaining.push(path.replace(`${siteRoot}/`, ''));
}
if (remaining.length) {
  throw new Error(`legacy GitHub Pages base URL remains in generated site: ${remaining.join(', ')}`);
}

const homepage = await readFile(resolve(siteRoot, 'index.html'), 'utf8');
if (!homepage.includes('<link rel="canonical" href="https://worlddiscoverydata.com/">')) {
  throw new Error('homepage canonical does not use the custom domain');
}
const robots = await readFile(resolve(siteRoot, 'robots.txt'), 'utf8');
if (!robots.includes('Sitemap: https://worlddiscoverydata.com/sitemap.xml')) {
  throw new Error('robots.txt does not advertise the custom-domain sitemap');
}
const sitemap = await readFile(resolve(siteRoot, 'sitemap.xml'), 'utf8');
if (!sitemap.includes('<loc>https://worlddiscoverydata.com/</loc>')) {
  throw new Error('sitemap does not use the custom domain');
}

console.log(`Custom-domain contract enforced across generated site (${replacements} legacy URL replacements).`);
