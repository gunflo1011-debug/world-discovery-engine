import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../site/', import.meta.url));
const outDir = path.join(root, 'fun-facts');

const specs = ['population','life-expectancy','forest-area-share','internet-use','fertility-rate','gdp-per-capita'];
async function load(slug) { return JSON.parse(await readFile(path.join(root,'data','wdi',slug,'data.json'),'utf8')); }
function records(d){ return (d.records||[]).filter(r=>Number.isFinite(r.value)&&r.country&&/^[A-Z]{3}$/.test(r.code)); }
function max(rs){ return [...rs].sort((a,b)=>b.value-a.value)[0]; }
function min(rs){ return [...rs].sort((a,b)=>a.value-b.value)[0]; }
function fmt(n,d=1){ return new Intl.NumberFormat('en-US',{maximumFractionDigits:d}).format(n); }
function value(slug,n){
  if(slug==='population') return `${fmt(n/1e9,2)} billion people`;
  if(slug==='gdp-per-capita') return `$${fmt(n,0)} per person`;
  if(slug==='life-expectancy') return `${fmt(n,1)} years`;
  if(slug==='forest-area-share'||slug==='internet-use') return `${fmt(n,1)}%`;
  if(slug==='fertility-rate') return `${fmt(n,2)} births per woman`;
  return fmt(n,1);
}

const d=Object.fromEntries(await Promise.all(specs.map(async s=>[s,await load(s)])));
const facts=[];
{
  const x=d.population,t=max(records(x)); facts.push({emoji:'🌍',kicker:'Population heavyweight',title:`${t.country} is the biggest population in this snapshot.`,text:`About ${value('population',t.value)} live there — more than in any other country or territory in the ${x.observationYear} World Discovery snapshot.`,href:'../data/population/',source:`World Bank WDI · ${x.observationYear}`});
}
{
  const x=d['life-expectancy'],rs=records(x),hi=max(rs),lo=min(rs); facts.push({emoji:'⏳',kicker:'A lifetime apart',title:`The life-expectancy gap is about ${fmt(hi.value-lo.value,1)} years.`,text:`${hi.country} sits at ${value('life-expectancy',hi.value)}, while ${lo.country} is at ${value('life-expectancy',lo.value)} in the same-year ${x.observationYear} snapshot.`,href:'../data/life-expectancy/',source:`World Bank WDI · ${x.observationYear}`});
}
{
  const x=d['forest-area-share'],t=max(records(x)); facts.push({emoji:'🌲',kicker:'Basically a forest',title:`${t.country} is covered by forest almost end to end.`,text:`Forest accounts for ${value('forest-area-share',t.value)} of its land area in the ${x.observationYear} snapshot.`,href:'../data/forest-area-share/',source:`World Bank WDI · ${x.observationYear}`});
}
{
  const x=d['internet-use'],t=max(records(x)); facts.push({emoji:'📶',kicker:'Almost everyone is online',title:`${t.country} reaches ${value('internet-use',t.value)} internet use.`,text:`That is the highest value in World Discovery's current same-year internet-use snapshot. Ties are possible at the top.`,href:'../indicators/internet-use/',source:`World Bank WDI · ${x.observationYear}`});
}
{
  const x=d['fertility-rate'],t=max(records(x)); facts.push({emoji:'👶',kicker:'Big-family outlier',title:`${t.country} has the highest fertility rate in the snapshot.`,text:`The current value is ${value('fertility-rate',t.value)} — a striking contrast with countries where the rate is near or below two.`,href:'../data/fertility-rate/',source:`World Bank WDI · ${x.observationYear}`});
}
{
  const x=d['gdp-per-capita'],t=max(records(x)); facts.push({emoji:'💰',kicker:'Tiny place, huge number',title:`${t.country} tops GDP per person.`,text:`Its current snapshot value is ${value('gdp-per-capita',t.value)}. GDP per capita is an average economic-output measure, not what every resident earns.`,href:'../data/gdp-per-capita/',source:`World Bank WDI · ${x.observationYear}`});
}

const cards=facts.map(f=>`<article class="card fun-fact-card"><div class="fun-emoji" aria-hidden="true">${f.emoji}</div><span class="pill">${f.kicker.toUpperCase()}</span><h2>${f.title}</h2><p>${f.text}</p><p class="muted">${f.source}</p><a href="${f.href}">Explore the data →</a></article>`).join('');
const title='Fun Facts about the world · World Discovery';
const description='Discover surprising, data-backed fun facts about countries, population, life expectancy, forests, internet use and more.';
const image='https://worlddiscoverydata.com/social-preview.png';
const imageAlt='World Discovery — global data made explorable';
const jsonLd=JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name:'World Discovery Fun Facts',url:'https://worlddiscoverydata.com/fun-facts/',description:'Surprising facts generated from current World Discovery datasets.',mainEntity:facts.map(f=>({'@type':'Article',headline:f.title,description:f.text}))});
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${description}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="https://worlddiscoverydata.com/fun-facts/"><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="https://worlddiscoverydata.com/fun-facts/"><meta property="og:image" content="${image}"><meta property="og:image:alt" content="${imageAlt}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${image}"><meta name="twitter:image:alt" content="${imageAlt}"><link rel="stylesheet" href="../styles.css"><script type="application/ld+json">${jsonLd}</script><style>.fun-facts-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin-top:26px}.fun-fact-card{position:relative;overflow:hidden}.fun-emoji{font-size:46px;line-height:1;margin-bottom:14px}.fun-fact-card h2{font-size:26px;line-height:1.15;margin:12px 0}.fun-fact-card .muted{font-size:13px}.fun-note{max-width:820px}.fun-random{display:inline-block;margin-top:18px;border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:9px 14px;color:#fff;text-decoration:none;font-weight:800}@media(max-width:760px){.fun-facts-grid{grid-template-columns:1fr}.fun-fact-card h2{font-size:24px}}</style></head><body><header class="topbar"><div class="wrap"><a class="brand" href="../">World Discovery</a><nav class="nav" aria-label="Main navigation"><a href="../">Home</a><a href="../explore/">Explore</a><a href="../data/">Data</a><a href="../trends/">Trends</a><a href="../countries/">Countries</a><a href="../compare/">Compare</a><a href="../methodology/">About</a></nav></div></header><section class="hero hero-compact"><div class="wrap"><div class="eyebrow">Fun Facts · powered by real data</div><h1>The world is weird. The data proves it.</h1><p class="fun-note">Short, surprising facts generated from World Discovery's current datasets. No made-up trivia: every card points back to the underlying data and year.</p><a class="fun-random" href="#facts">Show me the facts ↓</a></div></section><main><section class="section" id="facts"><div class="wrap"><div class="eyebrow">Did you know?</div><h2>Six facts worth stealing for your next conversation.</h2><div class="fun-facts-grid">${cards}</div></div></section><section class="section section-soft"><div class="wrap"><h2>Why these facts change</h2><p class="muted">Fun Facts are generated from the latest maintained World Discovery snapshots during the site build. When the underlying official data changes, the facts can change too.</p><p><a href="../sources/">Sources</a> · <a href="../methodology/">Methodology</a></p></div></section></main><footer class="footer"><div class="wrap">World Discovery · Official global data made easier to explore.</div></footer></body></html>`;

await mkdir(outDir,{recursive:true});
await writeFile(path.join(outDir,'index.html'),html,'utf8');
await writeFile(path.join(outDir,'facts.json'),`${JSON.stringify({generatedAt:new Date().toISOString(),facts},null,2)}\n`,'utf8');
console.log(`Built ${facts.length} data-backed fun facts.`);
