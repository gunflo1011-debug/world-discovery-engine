import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../site/', import.meta.url));
const baseUrl = 'https://worlddiscoverydata.com';

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

function localizeMarketShell(html, file, rel) {
  const market = rel.startsWith('trends/de/') ? 'de' : rel.startsWith('trends/br/') ? 'br' : null;
  if (!market) return html;

  const copy = market === 'de'
    ? {
        nav: 'Hauptnavigation',
        trends: 'Deutschland-Trends',
        data: 'Daten',
        countries: 'Länder',
        footer: 'Suchtrends mit verifizierten Antworten.'
      }
    : {
        nav: 'Navegação principal',
        trends: 'Tendências do Brasil',
        data: 'Dados',
        countries: 'Países',
        footer: 'Tendências de busca com respostas verificadas.'
      };

  const trendsHref = relativeHref(file, market === 'de' ? 'trends/de' : 'trends/br');
  const dataHref = relativeHref(file, 'data');
  const countriesHref = relativeHref(file, 'countries');
  const homeHref = relativeHref(file, '');
  const header = `<header class="topbar"><div class="wrap"><a class="brand" href="${homeHref}">World Discovery</a><nav class="nav" aria-label="${copy.nav}"><a href="${trendsHref}">${copy.trends}</a><a href="${dataHref}">${copy.data}</a><a href="${countriesHref}">${copy.countries}</a></nav></div></header>`;
  const footer = `<footer class="footer"><div class="wrap">World Discovery · ${copy.footer}</div></footer>`;

  return html
    .replace(/<header\b[^>]*class="[^"]*topbar[^"]*"[^>]*>[\s\S]*?<\/header>/i, header)
    .replace(/<footer\b[^>]*class="[^"]*footer[^"]*"[^>]*>[\s\S]*?<\/footer>/i, footer)
    .replace(/<style\b[^>]*id="wd-language-menu-style"[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<style\b[^>]*id="wd-shared-shell-style"[^>]*>[\s\S]*?<\/style>/gi, '');
}

for (const file of await walk(root)) {
  if (path.basename(file) === '404.html') continue;
  let html = await readFile(file, 'utf8');
  const rel = path.relative(root, file).replaceAll(path.sep, '/');
  html = localizeMarketShell(html, file, rel);

  const navMatch = html.match(/<nav class="nav"[^>]*>[\s\S]*?<\/nav>/i);
  if (!navMatch) continue;

  let nav = navMatch[0];

  if (!/^trends\/(?:de|br)\//.test(rel) && !/href="[^"]*trends\/?"[^>]*>Trends<\/a>/i.test(nav)) {
    const href = relativeHref(file, 'trends');
    const link = `<a href="${href}"${rel === 'trends/index.html' ? ' aria-current="page"' : ''}>Trends</a>`;
    nav = nav.replace(/(<a[^>]*>Data<\/a>)/i, `$1${link}`);
  }

  if (!/^trends\/(?:de|br)\//.test(rel) && !/href="[^"]*fun-facts\/?"[^>]*>Fun Facts<\/a>/i.test(nav)) {
    const href = relativeHref(file, 'fun-facts');
    const link = `<a href="${href}"${rel === 'fun-facts/index.html' ? ' aria-current="page"' : ''}>Fun Facts</a>`;
    const trend = nav.match(/<a[^>]*>Trends<\/a>/i)?.[0];
    if (trend) nav = nav.replace(trend, `${trend}${link}`);
    else nav = nav.replace(/(<a[^>]*>Data<\/a>)/i, `$1${link}`);
  }

  if (nav !== navMatch[0]) {
    html = html.replace(navMatch[0], nav);
  }
  await writeFile(file, html, 'utf8');
}

const trendsRoot = path.join(root, 'trends');
const trendIndexFiles = (await walk(trendsRoot)).filter(file => path.basename(file) === 'index.html');
const trendUrls = trendIndexFiles
  .map(file => path.relative(root, path.dirname(file)).replaceAll(path.sep, '/'))
  .map(relativeDir => `${baseUrl}/${relativeDir}/`)
  .sort();

const sitemapPath = path.join(root, 'sitemap.xml');
let sitemap = await readFile(sitemapPath, 'utf8');
const sitemapLocations = new Set([...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(match => match[1]));
const missingTrendUrls = trendUrls.filter(url => !sitemapLocations.has(url));

if (missingTrendUrls.length > 0) {
  const entries = missingTrendUrls.map(url => `<url><loc>${url}</loc></url>`).join('\n');
  sitemap = sitemap.replace(/\s*<\/urlset>\s*$/i, `\n${entries}\n</urlset>\n`);
  await writeFile(sitemapPath, sitemap, 'utf8');
}

console.log(`Ensured Trends and Fun Facts are present in the primary navigation; localized DE/BR trend shells; ${trendUrls.length} trend routes are present in the sitemap.`);
