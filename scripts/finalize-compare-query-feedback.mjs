import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);

const surfaces = [
  {
    path: 'compare/index.html',
    message: 'One or more country codes in this URL were not recognized. The default comparison is shown instead.'
  },
  {
    path: 'de/compare/index.html',
    message: 'Mindestens ein Ländercode in dieser URL wurde nicht erkannt. Stattdessen wird der Standardvergleich angezeigt.'
  },
  {
    path: 'es/compare/index.html',
    message: 'No se reconoció uno o más códigos de país de esta URL. En su lugar se muestra la comparación predeterminada.'
  },
  {
    path: 'fr/compare/index.html',
    message: 'Un ou plusieurs codes pays de cette URL ne sont pas reconnus. La comparaison par défaut est affichée à la place.'
  },
  {
    path: 'zh-hans/compare/index.html',
    message: '此网址中的一个或多个国家代码无法识别，因此改为显示默认比较。'
  }
];

const captureMarker = 'data-compare-query-capture';
const feedbackMarker = 'data-compare-query-feedback';

for (const surface of surfaces) {
  const url = new URL(surface.path, siteRoot);
  let html = await readFile(url, 'utf8');

  if (!html.includes(captureMarker)) {
    const capture = `<script ${captureMarker}>window.__WD_COMPARE_QUERY__={a:new URLSearchParams(location.search).get('a'),b:new URLSearchParams(location.search).get('b')};</script>`;
    if (!html.includes('</head>')) throw new Error(`${surface.path}: missing </head> for compare query capture`);
    html = html.replace('</head>', `${capture}</head>`);
  }

  if (!html.includes('id="compare-query-warning"')) {
    const warning = `<p id="compare-query-warning" class="compare-hint muted" role="status" aria-live="polite" hidden>${surface.message}</p>`;
    const controlsEnd = /(<datalist id="country-options">[\s\S]*?<\/datalist><\/div>)(<\/div><\/section>)/;
    if (!controlsEnd.test(html)) throw new Error(`${surface.path}: compare controls marker not found`);
    html = html.replace(controlsEnd, `$1${warning}$2`);
  }

  if (!html.includes(feedbackMarker)) {
    const feedback = `<script ${feedbackMarker}>(()=>{const requested=window.__WD_COMPARE_QUERY__||{};const validCodes=new Set(DATA.countries.map(country=>country.code));const invalidA=Boolean(requested.a)&&!validCodes.has(String(requested.a).toUpperCase());const invalidB=Boolean(requested.b)&&!validCodes.has(String(requested.b).toUpperCase());if(invalidA||invalidB){const warning=document.getElementById('compare-query-warning');if(warning)warning.hidden=false;}})();</script>`;
    if (!html.includes('</body>')) throw new Error(`${surface.path}: missing </body> for compare query feedback`);
    html = html.replace('</body>', `${feedback}</body>`);
  }

  const captureCount = html.split(captureMarker).length - 1;
  const feedbackCount = html.split(feedbackMarker).length - 1;
  const warningCount = html.split('id="compare-query-warning"').length - 1;
  if (captureCount !== 1 || feedbackCount !== 1 || warningCount !== 1) {
    throw new Error(`${surface.path}: compare query feedback must remain idempotent`);
  }

  await writeFile(url, html, 'utf8');
}

console.log('Finalized invalid compare-query feedback across all released locales.');
