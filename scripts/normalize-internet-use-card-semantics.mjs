import { readFile, writeFile } from 'node:fs/promises';

const htmlUrl = new URL('../site/indicators/internet-use/index.html', import.meta.url);
const html = await readFile(htmlUrl, 'utf8');

const normalized = html.replace(
  /<article class="card">([\s\S]*?)<\/article>/g,
  '<div class="card">$1</div>',
);

if (normalized !== html) {
  await writeFile(htmlUrl, normalized);
  console.log('Normalized internet-use informational cards to non-article containers.');
} else {
  console.log('Internet-use informational card semantics already normalized.');
}
