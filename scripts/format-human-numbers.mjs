import './hydrate-localizations.mjs';
import './finalize-localizations.mjs';
import { readdir, readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);

function formatNumber(raw) {
  const value = Number(String(raw).replace('−', '-'));
  if (!Number.isFinite(value)) return raw;
  const formatted = value.toFixed(1).replace(/\.0$/, '');
  return Number(formatted) === 0 ? '0' : formatted;
}

function formatVisibleSegment(segment) {
  return segment
    .replace(/([−-]?\d+\.\d{2,})(?=%)/g, (_, value) => formatNumber(value))
    .replace(/([−-]?\d+\.\d{2,})(?=\s+(?:pp|percentage points?))/gi, (_, value) => formatNumber(value))
    .replace(/[−-]0(?:\.0+)?(?=%)/g, '0')
    .replace(/[−-]0(?:\.0+)?(?=\s+(?:pp|percentage points?))/gi, '0');
}

function formatHtml(html) {
  const parts = html.split(/(<script\b[\s\S]*?<\/script>)/gi);
  return parts.map((part) => /^<script\b/i.test(part) ? part : formatVisibleSegment(part)).join('');
}

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const url = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory);
    if (entry.isDirectory()) files.push(...await htmlFiles(url));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(url);
  }
  return files;
}

const files = await htmlFiles(siteRoot);
let changed = 0;
for (const file of files) {
  const before = await readFile(file, 'utf8');
  const after = formatHtml(before);
  if (after !== before) {
    await writeFile(file, after, 'utf8');
    changed += 1;
  }
}

console.log(`Formatted human-facing percentage precision in ${changed} HTML files; scripts and machine-readable JSON/CSV were left unchanged.`);
