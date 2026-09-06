import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const site = fileURLToPath(new URL('../site/', import.meta.url));
const manifestPath = fileURLToPath(new URL('./fun-facts-manifest.json', import.meta.url));
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const facts = [...manifest.facts].sort((a,b)=>b.date.localeCompare(a.date));
if (!facts.length) throw new Error('Fun-facts manifest must contain at least one curated fact.');
const dates = new Set();
for (const fact of facts) {
  if (dates.has(fact.date)) throw new Error(`Daily limit violated: more than one fun fact for ${fact.date}`);
  dates.add(fact.date);
}

const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const shell=(title,description,canonical,body,jsonLd)=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${canonical}"><meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://worlddiscoverydata.com/social-preview.png"><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="/styles.css"><script type="application/ld+json">${JSON.stringify(jsonLd)}</script><style>.fact-emoji{font-size:58px}.fact-answer{font-size:1.25rem;max-width:800px}.fact-meta{font-size:.9rem}.fact-source{word-break:break-word}.fun-list{display:grid;gap:18px;margin-top:24px}</style></head><body><header class="topbar"><div class="wrap"><a class="brand" href="/">World Discovery</a><nav class="nav" aria-label="Main navigation"><a href="/">Home</a><a href="/explore/">Explore</a><a href="/data/">Data</a><a href="/trends/">Trends</a><a href="/fun-facts/">Fun Facts</a><a href="/countries/">Countries</a><a href="/compare/">Compare</a><a href="/methodology/">About</a></nav></div></header>${body}<footer class="footer"><div class="wrap">World Discovery · Curious facts, checked against serious sources.</div></footer></body></html>`;

const outDir=path.join(site,'fun-facts');
await mkdir(outDir,{recursive:true});
for (const f of facts) {
  const dir=path.join(outDir,f.slug); await mkdir(dir,{recursive:true});
  const canonical=`https://worlddiscoverydata.com/fun-facts/${f.slug}/`;
  const description=f.dek;
  const body=`<section class="hero hero-compact"><div class="wrap"><div class="fact-emoji" aria-hidden="true">${f.emoji}</div><div class="eyebrow">Fun Fact · ${esc(f.date)}</div><h1>${esc(f.title)}</h1><p class="fact-answer"><strong>Yes, really.</strong> ${esc(f.dek)}</p></div></section><main><section class="section"><div class="wrap"><h2>Why this is so weird</h2><p>${esc(f.why)}</p><h2>What is actually happening?</h2><p>${esc(f.context)}</p><h2>Sources</h2><p class="fact-source"><a href="${esc(f.sourceUrl)}" rel="noopener">${esc(f.sourceLabel)}</a></p><p class="fact-source"><a href="${esc(f.source2Url)}" rel="noopener">${esc(f.source2Label)}</a></p><p class="muted fact-meta">Published ${esc(f.date)} · Claims checked against the sources above.</p><p><a href="/fun-facts/">← More Fun Facts</a></p></div></section></main>`;
  const ld={'@context':'https://schema.org','@type':'Article',headline:f.title,datePublished:f.date,dateModified:f.date,mainEntityOfPage:canonical,publisher:{'@type':'Organization',name:'World Discovery'},citation:[f.sourceUrl,f.source2Url]};
  await writeFile(path.join(dir,'index.html'),shell(`${f.title} · World Discovery`,description,canonical,body,ld),'utf8');
}

const cards=facts.map(f=>`<article class="card"><div class="fact-emoji" aria-hidden="true">${f.emoji}</div><span class="pill">${esc(f.date)}</span><h2>${esc(f.title)}</h2><p>${esc(f.dek)}</p><a href="/fun-facts/${esc(f.slug)}/">Read the checked explanation →</a></article>`).join('');
const hubCanonical='https://worlddiscoverydata.com/fun-facts/';
const hubBody=`<section class="hero hero-compact"><div class="wrap"><div class="eyebrow">One genuinely weird fact a day</div><h1>Fun Facts that make you say “wait… what?”</h1><p>Curious, absurd or surprising facts — selected by hand and checked against serious sources. No population rankings pretending to be trivia.</p></div></section><main><section class="section"><div class="wrap"><div class="fun-list">${cards}</div></div></section></main>`;
const hubLd={'@context':'https://schema.org','@type':'CollectionPage',name:'World Discovery Fun Facts',url:hubCanonical,mainEntity:facts.map(f=>({'@type':'Article',headline:f.title,url:`${hubCanonical}${f.slug}/`,datePublished:f.date}))};
await writeFile(path.join(outDir,'index.html'),shell('Fun Facts that are actually fun · World Discovery','One genuinely weird, source-checked fun fact every day.',hubCanonical,hubBody,hubLd),'utf8');
await writeFile(path.join(outDir,'facts.json'),`${JSON.stringify({timezone:manifest.timezone,facts},null,2)}\n`,'utf8');

const sitemapPath=path.join(site,'sitemap.xml');
let sitemap=await readFile(sitemapPath,'utf8');
const urls=[hubCanonical,...facts.map(f=>`${hubCanonical}${f.slug}/`)];
for (const url of urls) if (!sitemap.includes(`<loc>${url}</loc>`)) sitemap=sitemap.replace('</urlset>',`<url><loc>${url}</loc></url>\n</urlset>`);
await writeFile(sitemapPath,sitemap,'utf8');
console.log(`Built ${facts.length} curated daily fun fact(s).`);
