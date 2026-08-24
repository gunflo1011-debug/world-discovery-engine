import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';

const root = resolve(process.cwd(), 'site');
const baseUrl = 'https://worlddiscoverydata.com';

function page({ title, description, canonical, body }) {
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><link rel="stylesheet" href="../styles.css"></head><body><header class="topbar"><div class="wrap"><div class="brand">World Discovery Engine</div><nav class="nav"><a href="../index.html">Home</a><a href="../evidence/index.html">Evidence</a><a href="../indicators/index.html">Indicators</a><a href="../explore/index.html">Explore</a><a href="../methodology/index.html">Methodology</a><a href="../sources/index.html">Sources</a><a href="../archive/index.html">Archive</a><a href="../status/index.html">Status</a></nav></div></header><main><section class="section"><div class="wrap">${body}</div></section></main><footer class="footer"><div class="wrap">World Discovery Engine · Reproducible evidence from official public data. · <a href="../impressum/index.html">Impressum</a> · <a href="../datenschutz/index.html">Datenschutz</a></div></footer></body></html>`;
}

const impressum = page({
  title: 'Impressum — World Discovery Engine',
  description: 'Impressum und Anbieterkennzeichnung für World Discovery Engine.',
  canonical: `${baseUrl}/impressum/`,
  body: `<div class="eyebrow">Rechtliche Informationen</div><h1>Impressum</h1><h2>Angaben gemäß § 5 DDG</h2><p>Florian Gundermann<br>Teichstraße 1a<br>76707 Hambrücken<br>Deutschland</p><h2>Kontakt</h2><p>E-Mail: <a href="mailto:gunflo1011@gmail.com">gunflo1011@gmail.com</a></p><p class="muted">Stand: 24. August 2026</p>`
});

const datenschutz = page({
  title: 'Datenschutz — World Discovery Engine',
  description: 'Datenschutzerklärung für World Discovery Engine.',
  canonical: `${baseUrl}/datenschutz/`,
  body: `<div class="eyebrow">Rechtliche Informationen</div><h1>Datenschutzerklärung</h1><h2>1. Verantwortlicher</h2><p>Florian Gundermann<br>Teichstraße 1a<br>76707 Hambrücken<br>Deutschland<br>E-Mail: <a href="mailto:gunflo1011@gmail.com">gunflo1011@gmail.com</a></p><h2>2. Hosting und technische Zugriffsdaten</h2><p>Diese Website wird über GitHub Pages bereitgestellt. Beim Aufruf der Website werden technisch erforderliche Verbindungs- und Zugriffsdaten durch die beteiligte Hosting-Infrastruktur verarbeitet, insbesondere IP-Adresse, Zeitpunkt des Zugriffs, aufgerufene Ressource, Browser-/Geräteinformationen und technische Statusdaten, soweit diese für Auslieferung, Sicherheit und Fehleranalyse erforderlich sind.</p><p>Die Verarbeitung erfolgt, soweit sie in unserer Verantwortlichkeit liegt, auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt im sicheren, stabilen und technisch fehlerfreien Betrieb der Website. Weitere Informationen zur Datenverarbeitung durch GitHub finden sich in den Datenschutzinformationen von GitHub.</p><h2>3. Cookies, Analytics und Tracking</h2><p>World Discovery Engine setzt nach aktuellem Stand keine eigenen Werbe-, Analyse- oder Tracking-Cookies ein und verwendet keine eingebundene Webanalyse. Sollte künftig ein zustimmungspflichtiger Dienst eingesetzt werden, wird diese Datenschutzerklärung vor dessen Aktivierung angepasst und – soweit rechtlich erforderlich – eine Einwilligung eingeholt.</p><h2>4. Externe Links und Datenquellen</h2><p>Die Website verlinkt auf externe Datenquellen und andere Websites. Beim Öffnen eines externen Links gelten die Datenschutzbestimmungen des jeweiligen Anbieters. Die bloße Darstellung eines Links überträgt auf dieser Website noch keine zusätzlichen personenbezogenen Daten an das verlinkte Ziel; eine Verbindung entsteht erst durch den Aufruf des externen Angebots.</p><h2>5. Kontaktaufnahme</h2><p>Wenn Sie uns per E-Mail kontaktieren, verarbeiten wir die von Ihnen übermittelten Angaben zur Bearbeitung der Anfrage. Rechtsgrundlage ist je nach Inhalt der Anfrage Art. 6 Abs. 1 lit. b DSGVO oder Art. 6 Abs. 1 lit. f DSGVO.</p><h2>6. Ihre Rechte</h2><p>Sie haben nach Maßgabe der DSGVO insbesondere Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch gegen bestimmte Verarbeitungen. Außerdem besteht das Recht, sich bei einer zuständigen Datenschutzaufsichtsbehörde zu beschweren.</p><h2>7. Änderungen dieser Datenschutzerklärung</h2><p>Diese Erklärung wird angepasst, wenn sich Funktionen, Hosting, Analytics, Werbung, eingebundene Dienste oder die Rechtslage ändern.</p><p class="muted">Stand: 24. August 2026</p>`
});

async function writePage(path, content) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, 'utf8');
}

function hrefFrom(file, targetDir) {
  const from = dirname(file);
  const target = resolve(root, targetDir, 'index.html');
  let href = relative(from, target).split(sep).join('/');
  if (!href.startsWith('.')) href = `./${href}`;
  return href;
}

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

async function injectLegalFooter() {
  for (const file of await htmlFiles(root)) {
    let html = await readFile(file, 'utf8');
    const imprintHref = hrefFrom(file, 'impressum');
    const privacyHref = hrefFrom(file, 'datenschutz');
    const legal = ` · <a href="${imprintHref}">Impressum</a> · <a href="${privacyHref}">Datenschutz</a>`;
    if (html.includes('>Impressum</a>') && html.includes('>Datenschutz</a>')) continue;
    if (/<footer\b[^>]*>[\s\S]*?<\/footer>/i.test(html)) {
      html = html.replace(/(<footer\b[^>]*>[\s\S]*?)(<\/footer>)/i, `$1${legal}$2`);
    } else {
      html = html.replace(/<\/body>/i, `<footer class="footer"><div class="wrap">World Discovery Engine${legal}</div></footer></body>`);
    }
    await writeFile(file, html, 'utf8');
  }
}

async function ensureSitemap() {
  const path = resolve(root, 'sitemap.xml');
  let xml = await readFile(path, 'utf8');
  for (const url of [`${baseUrl}/impressum/`, `${baseUrl}/datenschutz/`]) {
    if (xml.includes(`<loc>${url}</loc>`)) continue;
    xml = xml.replace(/<\/urlset>\s*$/i, `  <url><loc>${url}</loc></url>\n</urlset>\n`);
  }
  await writeFile(path, xml, 'utf8');
}

await writePage(resolve(root, 'impressum', 'index.html'), impressum);
await writePage(resolve(root, 'datenschutz', 'index.html'), datenschutz);
await injectLegalFooter();
await ensureSitemap();
console.log('Built legal pages and injected Impressum/Datenschutz links across HTML pages.');
