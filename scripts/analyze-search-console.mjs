import fs from 'node:fs';

const required = ['page','query','date','clicks','impressions','ctr','position'];

function normalize(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.filter(r => required.every(k => Object.hasOwn(r, k)))
    .map(r => ({...r, clicks:Number(r.clicks), impressions:Number(r.impressions), ctr:Number(r.ctr), position:Number(r.position)}))
    .filter(r => r.page && r.query && r.date && [r.clicks,r.impressions,r.ctr,r.position].every(Number.isFinite) && r.impressions > 0);
}

export function analyze(rows) {
  return normalize(rows)
    .map(r => ({...r, opportunityScore: Math.round(r.impressions * Math.max(0, 1-r.ctr) * (r.position >= 4 && r.position <= 20 ? 1 : 0) * 100)/100}))
    .filter(r => r.opportunityScore > 0)
    .sort((a,b) => b.opportunityScore-a.opportunityScore || b.impressions-a.impressions);
}

export function summarize(rows) {
  const valid = normalize(rows);
  const totals = valid.reduce((a,r) => {
    a.clicks += r.clicks;
    a.impressions += r.impressions;
    a.weightedPosition += r.position * r.impressions;
    return a;
  }, {clicks:0, impressions:0, weightedPosition:0});
  const bucket = (min,max) => valid.filter(r => r.position >= min && r.position <= max);
  const over = n => valid.filter(r => r.position > n);
  const uniq = key => new Set(valid.map(r => r[key])).size;
  const sumImp = xs => xs.reduce((s,r) => s+r.impressions,0);
  const zeroClick = valid.filter(r => r.clicks === 0);
  const pos4to20 = bucket(4,20);
  const pos21to50 = bucket(21,50);
  const posOver50 = over(50);
  return {
    rows: valid.length,
    clicks: totals.clicks,
    impressions: totals.impressions,
    ctr: totals.impressions ? totals.clicks / totals.impressions : 0,
    averagePosition: totals.impressions ? totals.weightedPosition / totals.impressions : null,
    pagesWithImpressions: uniq('page'),
    queriesWithImpressions: uniq('query'),
    zeroClickImpressions: sumImp(zeroClick),
    rankingBands: {
      position4to20: {rows: pos4to20.length, impressions: sumImp(pos4to20)},
      position21to50: {rows: pos21to50.length, impressions: sumImp(pos21to50)},
      positionOver50: {rows: posOver50.length, impressions: sumImp(posOver50)},
    },
    opportunities4to20: analyze(valid).slice(0,25),
    highestImpressionRows: [...valid].sort((a,b)=>b.impressions-a.impressions || a.position-b.position).slice(0,25),
  };
}

function parseCsv(text) {
  const lines=text.trim().split(/\r?\n/); if (lines.length<2) return [];
  const headers=lines[0].split(',').map(s=>s.trim().toLowerCase());
  return lines.slice(1).filter(Boolean).map(line=>Object.fromEntries(line.split(',').map((v,i)=>[headers[i],v.trim()])));
}

if (process.argv[1]?.endsWith('analyze-search-console.mjs')) {
  const file=process.argv[2];
  if (!file) { console.error('Usage: node scripts/analyze-search-console.mjs <search-console.csv>'); process.exit(2); }
  const rows=parseCsv(fs.readFileSync(file,'utf8'));
  const report=summarize(rows);
  console.log(JSON.stringify(report,null,2));
}
