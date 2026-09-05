import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../site/', import.meta.url));
const marker = 'data-wd-search-branding';
const origin = 'https://worlddiscoverydata.com';
const links = `<link rel="icon" href="${origin}/favicon.svg" type="image/svg+xml" ${marker}="primary"><link rel="alternate icon" href="${origin}/favicon.ico" sizes="any" ${marker}="fallback">`;

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(file));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(file);
  }
  return files;
}

function finalize(html, file) {
  if (!/<head\b/i.test(html) || !/<\/head>/i.test(html)) return html;
  const withoutManagedLinks = html.replace(new RegExp(`<link\\b[^>]*${marker}=["'][^"']+["'][^>]*>`, 'gi'), '');
  const next = withoutManagedLinks.replace(/<\/head>/i, `${links}</head>`);
  if (!next.includes(`href="${origin}/favicon.svg"`) || !next.includes(`href="${origin}/favicon.ico"`)) {
    throw new Error(`Search-brand favicon links missing after finalization: ${path.relative(root, file)}`);
  }
  return next;
}

let changed = 0;
for (const file of await walk(root)) {
  const html = await readFile(file, 'utf8');
  const next = finalize(html, file);
  if (next !== html) {
    await writeFile(file, next);
    changed += 1;
  }
}

console.log(`Search branding finalized across ${changed} HTML files.`);
