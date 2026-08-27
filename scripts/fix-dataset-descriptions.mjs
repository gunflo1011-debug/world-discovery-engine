import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const siteRoot = new URL('../site/', import.meta.url);

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

function metaDescription(html) {
  return html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1]?.trim() ?? '';
}

function walk(value, visit) {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, visit);
    return;
  }
  if (!value || typeof value !== 'object') return;
  visit(value);
  for (const child of Object.values(value)) walk(child, visit);
}

let changedFiles = 0;
let fixedDatasets = 0;

for (const path of await htmlFiles(siteRoot.pathname)) {
  let html = await readFile(path, 'utf8');
  const fallback = metaDescription(html);
  if (!fallback) continue;
  let fileChanged = false;

  html = html.replace(/(<script\s+type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi, (full, open, raw, close) => {
    let json;
    try { json = JSON.parse(raw); } catch { return full; }
    let changed = false;
    walk(json, (node) => {
      const type = node?.['@type'];
      const isDataset = type === 'Dataset' || (Array.isArray(type) && type.includes('Dataset'));
      if (isDataset && !String(node.description ?? '').trim()) {
        node.description = fallback;
        fixedDatasets += 1;
        changed = true;
      }
    });
    if (!changed) return full;
    fileChanged = true;
    return `${open}${JSON.stringify(json)}${close}`;
  });

  if (fileChanged) {
    await writeFile(path, html, 'utf8');
    changedFiles += 1;
  }
}

console.log(`Dataset description repair: ${fixedDatasets} Dataset nodes fixed across ${changedFiles} files.`);
