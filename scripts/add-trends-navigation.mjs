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

function relativeHref(file, targetDir) {
  let href = path.relative(path.dirname(file), path.join(root, targetDir)).replaceAll(path.sep, '/');
  if (!href) href = '.';
  if (!href.startsWith('.')) href = `./${href}`;
  return href.endsWith('/') ? href : `${href}/`;
}

for (const file of await walk(root)) {
  if (path.basename(file) === '404.html') continue;
  let html = await readFile(file, 'utf8');
  const navMatch = html.match(/<nav class="nav"[^>]*>[\s\S]*?<\/nav>/i);
  if (!navMatch) continue;

  let nav = navMatch[0];
  const rel = path.relative(root, file).replaceAll(path.sep, '/');

  if (!/href="[^"]*trends\/?"[^>]*>Trends<\/a>/i.test(nav)) {
    const href = relativeHref(file, 'trends');
    const link = `<a href="${href}"${rel === 'trends/index.html' ? ' aria-current="page"' : ''}>Trends</a>`;
    nav = nav.replace(/(<a[^>]*>Data<\/a>)/i, `$1${link}`);
  }

  if (!/href="[^"]*fun-facts\/?"[^>]*>Fun Facts<\/a>/i.test(nav)) {
    const href = relativeHref(file, 'fun-facts');
    const link = `<a href="${href}"${rel === 'fun-facts/index.html' ? ' aria-current="page"' : ''}>Fun Facts</a>`;
    const trend = nav.match(/<a[^>]*>Trends<\/a>/i)?.[0];
    if (trend) nav = nav.replace(trend, `${trend}${link}`);
    else nav = nav.replace(/(<a[^>]*>Data<\/a>)/i, `$1${link}`);
  }

  if (nav !== navMatch[0]) {
    html = html.replace(navMatch[0], nav);
    await writeFile(file, html, 'utf8');
  }
}

console.log('Ensured Trends and Fun Facts are present in the primary navigation.');
