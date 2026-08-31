import { readFile, writeFile } from 'node:fs/promises';

const htmlUrl = new URL('../site/indicators/internet-use/index.html', import.meta.url);
const html = await readFile(htmlUrl, 'utf8');

const normalized = html
  .replaceAll('<article class="card">', '<div class="card">')
  .replaceAll('</article>', '</div>');

if (normalized !== html) {
  await writeFile(htmlUrl, normalized);
  console.log('Normalized internet-use informational cards to non-article containers.');
} else {
  console.log('Internet-use informational card semantics already normalized.');
}
