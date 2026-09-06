import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../site/', import.meta.url));

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function relativeHref(file) {
  let href = path.relative(path.dirname(file), path.join(root, 'trends')).replaceAll(path.sep, '/');
  if (!href) href = '.';
  if (!href.startsWith('.')) href = `./${href}`;
  return href.endsWith('/') ? href : `${href}/`;
}

for (const file of await walk(root)) {
  if (path.basename(file) === '404.html') continue;
  let html = await readFile(file, 'utf8');
  const navMatch = html.match(/<nav class="nav"[^>]*>[\s\S]*?<\/nav>/i);
  if (!navMatch || /href="[^"]*trends\/?"[^>]*>Trends<\/a>/i.test(navMatch[0])) continue;

  const href = relativeHref(file);
  const isTrends = path.relative(root, file).replaceAll(path.sep, '/') === 'trends/index.html';
  const trendLink = `<a href="${href}"${isTrends ? ' aria-current="page"' : ''}>Trends</a>`;
  const updatedNav = navMatch[0].replace(/(<a[^>]*>Data<\/a>)/i, `$1${trendLink}`);
  if (updatedNav === navMatch[0]) continue;
  html = html.replace(navMatch[0], updatedNav);
  await writeFile(file, html, 'utf8');
}

console.log('Ensured Trends is present in the primary navigation.');
