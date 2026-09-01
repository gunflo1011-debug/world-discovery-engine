import { readFile, writeFile } from 'node:fs/promises';

const path = new URL('../site/data/index.html', import.meta.url);
let html = await readFile(path, 'utf8');
html = html.replace(/<nav class="catalog-topics"[\s\S]*?<\/nav>/, '');

const topics = [
  ['People', 'population'],
  ['Economy', 'economy'],
  ['Health', 'health'],
  ['Jobs', 'jobs'],
  ['Technology', 'technology'],
  ['Energy & climate', 'energy environment'],
];
const links = topics.map(([label, query]) => `<a href="?q=${encodeURIComponent(query)}#catalog-search">${label}</a>`).join(' · ');
const nav = `<nav class="catalog-topics" aria-label="Browse indicators by topic"><strong>Browse by topic:</strong> ${links}</nav>`;
html = html.replace('<p class="muted">You do not need the official indicator name. Describe the question or topic you have in mind.</p>', `<p class="muted">You do not need the official indicator name. Describe the question or topic you have in mind.</p>${nav}`);

await writeFile(path, html, 'utf8');
console.log('Added plain-language topic shortcuts to the public WDI catalog.');
