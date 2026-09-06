import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const site = fileURLToPath(new URL('../site/', import.meta.url));
const manifestPath = fileURLToPath(new URL('./fun-facts-manifest.json', import.meta.url));
const localesPath = path.join(site, 'i18n', 'locales.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const localeConfig = JSON.parse(await readFile(localesPath, 'utf8'));
const facts = [...manifest.facts].sort((a,b)=>b.date.localeCompare(a.date));
if (!facts.length) throw new Error('Fun-facts manifest must contain at least one curated fact.');
const dates = new Set();
for (const fact of facts) {
  if (dates.has(fact.date)) throw new Error(`Daily limit violated: more than one fun fact for ${fact.date}`);
  dates.add(fact.date);
}

const ui = {
  en: {
    home:'Home', explore:'Explore', data:'Data', trends:'Trends', funFacts:'Fun Facts', countries:'Countries', compare:'Compare', about:'About', nav:'Main navigation',
    detailEyebrow:'Fun Fact', yes:'Yes, really.', why:'Why this is so weird', what:'What is actually happening?', sources:'Sources', published:'Published', checked:'Claims checked against the sources above.', more:'← More Fun Facts',
    hubEyebrow:'One genuinely weird fact a day', hubTitle:'Fun Facts that make you say “wait… what?”', hubIntro:'Curious, absurd or surprising facts — selected by hand and checked against serious sources. No population rankings pretending to be trivia.', read:'Read the checked explanation →',
    pageTitle:'Fun Facts that are actually fun · World Discovery', pageDescription:'One genuinely weird, source-checked fun fact every day.', collectionName:'World Discovery Fun Facts', footer:'World Discovery · Curious facts, checked against serious sources.', socialAlt:'World Discovery — source-checked global data and discoveries'
  },
  de: {
    home:'Startseite', explore:'Entdecken', data:'Daten', trends:'Trends', funFacts:'Fun Facts', countries:'Länder', compare:'Vergleichen', about:'Über uns', nav:'Hauptnavigation',
    detailEyebrow:'Fun Fact', yes:'Ja, wirklich.', why:'Warum das so erstaunlich ist', what:'Was passiert dabei eigentlich?', sources:'Quellen', published:'Veröffentlicht', checked:'Die Aussagen wurden anhand der oben genannten Quellen geprüft.', more:'← Mehr Fun Facts',
    hubEyebrow:'Jeden Tag ein wirklich erstaunlicher Fakt', hubTitle:'Fun Facts, bei denen man zweimal hinschaut', hubIntro:'Kuriose, absurde oder überraschende Fakten — von Hand ausgewählt und mit seriösen Quellen geprüft. Keine Rankings, die nur als Trivia verkleidet sind.', read:'Geprüfte Erklärung lesen →',
    pageTitle:'Fun Facts, die wirklich Spaß machen · World Discovery', pageDescription:'Jeden Tag ein erstaunlicher, mit Quellen geprüfter Fun Fact.', collectionName:'World Discovery Fun Facts', footer:'World Discovery · Kuriose Fakten, geprüft mit seriösen Quellen.', socialAlt:'World Discovery — geprüfte globale Daten und Entdeckungen'
  },
  es: {
    home:'Inicio', explore:'Explorar', data:'Datos', trends:'Tendencias', funFacts:'Datos curiosos', countries:'Países', compare:'Comparar', about:'Acerca de', nav:'Navegación principal',
    detailEyebrow:'Dato curioso', yes:'Sí, de verdad.', why:'Por qué resulta tan sorprendente', what:'¿Qué ocurre realmente?', sources:'Fuentes', published:'Publicado', checked:'Las afirmaciones se comprobaron con las fuentes anteriores.', more:'← Más datos curiosos',
    hubEyebrow:'Un dato realmente sorprendente cada día', hubTitle:'Datos curiosos que te hacen decir «espera… ¿qué?»', hubIntro:'Datos curiosos, absurdos o sorprendentes, seleccionados a mano y comprobados con fuentes serias. Sin rankings disfrazados de curiosidades.', read:'Leer la explicación verificada →',
    pageTitle:'Datos curiosos que de verdad sorprenden · World Discovery', pageDescription:'Un dato curioso sorprendente y verificado con fuentes cada día.', collectionName:'Datos curiosos de World Discovery', footer:'World Discovery · Datos curiosos comprobados con fuentes serias.', socialAlt:'World Discovery — datos globales y descubrimientos verificados'
  },
  fr: {
    home:'Accueil', explore:'Explorer', data:'Données', trends:'Tendances', funFacts:'Faits insolites', countries:'Pays', compare:'Comparer', about:'À propos', nav:'Navigation principale',
    detailEyebrow:'Fait insolite', yes:'Oui, vraiment.', why:'Pourquoi c’est si étonnant', what:'Que se passe-t-il réellement ?', sources:'Sources', published:'Publié', checked:'Les affirmations ont été vérifiées à partir des sources ci-dessus.', more:'← Plus de faits insolites',
    hubEyebrow:'Un fait vraiment étonnant chaque jour', hubTitle:'Des faits insolites qui font dire « attends… quoi ? »', hubIntro:'Des faits curieux, absurdes ou surprenants, sélectionnés à la main et vérifiés auprès de sources sérieuses. Pas de classements déguisés en anecdotes.', read:'Lire l’explication vérifiée →',
    pageTitle:'Des faits insolites vraiment étonnants · World Discovery', pageDescription:'Chaque jour, un fait étonnant vérifié auprès de sources sérieuses.', collectionName:'Faits insolites de World Discovery', footer:'World Discovery · Des faits curieux vérifiés auprès de sources sérieuses.', socialAlt:'World Discovery — données mondiales et découvertes vérifiées'
  },
  'zh-Hans': {
    home:'首页', explore:'探索', data:'数据', trends:'趋势', funFacts:'趣味事实', countries:'国家', compare:'比较', about:'关于', nav:'主导航',
    detailEyebrow:'趣味事实', yes:'没错，是真的。', why:'为什么这件事如此惊人', what:'它到底是怎么发生的？', sources:'来源', published:'发布于', checked:'以上说法已根据上述来源核实。', more:'← 查看更多趣味事实',
    hubEyebrow:'每天一个真正令人惊讶的事实', hubTitle:'让你忍不住说“等等……什么？”的趣味事实', hubIntro:'人工挑选有趣、离奇或令人惊讶的事实，并用可靠来源核实。这里不会把普通排名包装成冷知识。', read:'阅读已核实的解释 →',
    pageTitle:'真正有趣的趣味事实 · World Discovery', pageDescription:'每天一个令人惊讶、并经过可靠来源核实的趣味事实。', collectionName:'World Discovery 趣味事实', footer:'World Discovery · 用可靠来源核实有趣事实。', socialAlt:'World Discovery — 经核实的全球数据与发现'
  }
};

const locales = Object.entries(localeConfig.locales)
  .filter(([code,cfg]) => code === localeConfig.defaultLocale || cfg.fullSiteReady)
  .map(([code,cfg]) => ({ code, ...cfg }));
for (const locale of locales) {
  if (!ui[locale.code]) throw new Error(`Fun-facts UI copy missing for locale ${locale.code}`);
  for (const fact of facts) {
    if (locale.code !== 'en' && !fact.translations?.[locale.code]) throw new Error(`Fun-facts translation missing for ${fact.date} locale ${locale.code}`);
  }
}

const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const socialImage='https://worlddiscoverydata.com/social-preview.png';
const prefix=locale=>locale.path ? `/${locale.path}` : '';
const canonicalFor=(locale,slug='')=>`https://worlddiscoverydata.com${prefix(locale)}/fun-facts/${slug ? `${slug}/` : ''}`;
const localizedFact=(fact,locale)=>locale.code === 'en' ? fact : { ...fact, ...fact.translations[locale.code] };
const alternatesFor=slug=>locales.map(locale=>({ hreflang:locale.htmlLang, href:canonicalFor(locale,slug) }));
const alternateTags=slug=>[
  ...alternatesFor(slug),
  { hreflang:'x-default', href:canonicalFor(locales.find(l=>l.code===localeConfig.defaultLocale),slug) }
].map(a=>`<link rel="alternate" hreflang="${esc(a.hreflang)}" href="${a.href}">`).join('');

const shell=(locale,title,description,canonical,body,jsonLd,slug='')=>{
  const t=ui[locale.code];
  const p=prefix(locale);
  return `<!doctype html><html lang="${esc(locale.htmlLang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${canonical}">${alternateTags(slug)}<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${socialImage}"><meta property="og:image:alt" content="${esc(t.socialAlt)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${socialImage}"><meta name="twitter:image:alt" content="${esc(t.socialAlt)}"><link rel="stylesheet" href="/styles.css"><script type="application/ld+json">${JSON.stringify(jsonLd)}</script><style>.fact-emoji{font-size:58px}.fact-answer{font-size:1.25rem;max-width:800px}.fact-meta{font-size:.9rem}.fact-source{word-break:break-word}.fun-list{display:grid;gap:18px;margin-top:24px}</style></head><body><header class="topbar"><div class="wrap"><a class="brand" href="${p || '/'}/">World Discovery</a><nav class="nav" aria-label="${esc(t.nav)}"><a href="${p || ''}/">${esc(t.home)}</a><a href="${p}/explore/">${esc(t.explore)}</a><a href="${p}/data/">${esc(t.data)}</a><a href="${p}/trends/">${esc(t.trends)}</a><a href="${p}/fun-facts/">${esc(t.funFacts)}</a><a href="${p}/countries/">${esc(t.countries)}</a><a href="${p}/compare/">${esc(t.compare)}</a><a href="${p}/methodology/">${esc(t.about)}</a></nav></div></header>${body}<footer class="footer"><div class="wrap">${esc(t.footer)}</div></footer></body></html>`;
};

for (const locale of locales) {
  const t=ui[locale.code];
  const outDir=path.join(site, locale.path || '', 'fun-facts');
  await mkdir(outDir,{recursive:true});
  for (const f of facts) {
    const lf=localizedFact(f,locale);
    const dir=path.join(outDir,f.slug); await mkdir(dir,{recursive:true});
    const canonical=canonicalFor(locale,f.slug);
    const body=`<section class="hero hero-compact"><div class="wrap"><div class="fact-emoji" aria-hidden="true">${f.emoji}</div><div class="eyebrow">${esc(t.detailEyebrow)} · ${esc(f.date)}</div><h1>${esc(lf.title)}</h1><p class="fact-answer"><strong>${esc(t.yes)}</strong> ${esc(lf.dek)}</p></div></section><main><section class="section"><div class="wrap"><h2>${esc(t.why)}</h2><p>${esc(lf.why)}</p><h2>${esc(t.what)}</h2><p>${esc(lf.context)}</p><h2>${esc(t.sources)}</h2><p class="fact-source"><a href="${esc(f.sourceUrl)}" rel="noopener">${esc(f.sourceLabel)}</a></p><p class="fact-source"><a href="${esc(f.source2Url)}" rel="noopener">${esc(f.source2Label)}</a></p><p class="muted fact-meta">${esc(t.published)} ${esc(f.date)} · ${esc(t.checked)}</p><p><a href="${prefix(locale)}/fun-facts/">${esc(t.more)}</a></p></div></section></main>`;
    const ld={'@context':'https://schema.org','@type':'Article',inLanguage:locale.htmlLang,headline:lf.title,datePublished:f.date,dateModified:f.date,mainEntityOfPage:canonical,publisher:{'@type':'Organization',name:'World Discovery'},citation:[f.sourceUrl,f.source2Url]};
    await writeFile(path.join(dir,'index.html'),shell(locale,`${lf.title} · World Discovery`,lf.dek,canonical,body,ld,f.slug),'utf8');
  }

  const cards=facts.map(f=>{
    const lf=localizedFact(f,locale);
    return `<article class="card"><div class="fact-emoji" aria-hidden="true">${f.emoji}</div><span class="pill">${esc(f.date)}</span><h2>${esc(lf.title)}</h2><p>${esc(lf.dek)}</p><a href="${prefix(locale)}/fun-facts/${esc(f.slug)}/">${esc(t.read)}</a></article>`;
  }).join('');
  const hubCanonical=canonicalFor(locale);
  const hubBody=`<section class="hero hero-compact"><div class="wrap"><div class="eyebrow">${esc(t.hubEyebrow)}</div><h1>${esc(t.hubTitle)}</h1><p>${esc(t.hubIntro)}</p></div></section><main><section class="section"><div class="wrap"><div class="fun-list">${cards}</div></div></section></main>`;
  const hubLd={'@context':'https://schema.org','@type':'CollectionPage',inLanguage:locale.htmlLang,name:t.collectionName,url:hubCanonical,mainEntity:facts.map(f=>({'@type':'Article',headline:localizedFact(f,locale).title,url:`${hubCanonical}${f.slug}/`,datePublished:f.date}))};
  await writeFile(path.join(outDir,'index.html'),shell(locale,t.pageTitle,t.pageDescription,hubCanonical,hubBody,hubLd),'utf8');
  await writeFile(path.join(outDir,'facts.json'),`${JSON.stringify({timezone:manifest.timezone,locale:locale.code,facts:facts.map(f=>localizedFact(f,locale))},null,2)}\n`,'utf8');
}

const sitemapPath=path.join(site,'sitemap.xml');
let sitemap=await readFile(sitemapPath,'utf8');
const urls=locales.flatMap(locale=>[canonicalFor(locale),...facts.map(f=>canonicalFor(locale,f.slug))]);
for (const url of urls) if (!sitemap.includes(`<loc>${url}</loc>`)) sitemap=sitemap.replace('</urlset>',`<url><loc>${url}</loc></url>\n</urlset>`);
await writeFile(sitemapPath,sitemap,'utf8');
console.log(`Built ${facts.length} curated daily fun fact(s) across ${locales.length} locale(s).`);
