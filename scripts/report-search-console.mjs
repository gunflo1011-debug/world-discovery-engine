import fs from 'node:fs';

const required = ['page','query','date','clicks','impressions','ctr','position'];

function normalize(rows) {
  return (Array.isArray(rows) ? rows : [])
    .filter(r => required.every(k => Object.hasOwn(r, k)))
    .map(r => ({...r, clicks:Number(r.clicks), impressions:Number(r.impressions), ctr:Number(r.ctr), position:Number(r.position)}))
    .filter(r => r.page && r.query && r.date && [r.clicks,r.impressions,r.ctr,r.position].every(Number.isFinite) && r.impressions > 0);
}

export function buildSearchConsoleReport(rows) {
  const valid = normalize(rows);
  if (!valid.length) return {status:'NO_DEMAND_EVIDENCE', rows:0, opportunities:[]};

  const groups = new Map();
  for (const r of valid) {
    const key = `${r.page}\u0000${r.query}`;
    const g = groups.get(key) || {page:r.page, query:r.query, clicks:0, impressions:0, weightedPosition:0, dates:[]};
    g.clicks += r.clicks;
    g.impressions += r.impressions;
    g.weightedPosition += r.position * r.impressions;
    g.dates.push(r.date);
    groups.set(key, g);
  }

  const opportunities = [...groups.values()].map(g => {
    const ctr = g.impressions ? g.clicks / g.impressions : 0;
    const position = g.impressions ? g.weightedPosition / g.impressions : 0;
    const sortedDates = [...g.dates].sort();
    let category = 'MONITOR';
    if (position >= 4 && position <= 20) category = 'NEAR_PAGE_ONE';
    else if (g.impressions >= 10 && ctr < 0.02) category = 'HIGH_IMPRESSION_LOW_CTR';
    const score = category === 'NEAR_PAGE_ONE'
      ? g.impressions * Math.max(0, 1 - ctr) * (21 - position) / 17
      : category === 'HIGH_IMPRESSION_LOW_CTR' ? g.impressions * Math.max(0, 0.02 - ctr) : 0;
    return {page:g.page, query:g.query, category, clicks:g.clicks, impressions:g.impressions,
      ctr:Number(ctr.toFixed(4)), position:Number(position.toFixed(2)),
      firstDate:sortedDates[0], lastDate:sortedDates.at(-1), opportunityScore:Number(score.toFixed(2))};
  }).filter(x => x.category !== 'MONITOR')
    .sort((a,b) => b.opportunityScore-a.opportunityScore || b.impressions-a.impressions || a.page.localeCompare(b.page));

  return {status: opportunities.length ? 'ACTIONABLE_DEMAND_EVIDENCE' : 'DEMAND_EVIDENCE_NO_ACTIONABLE_OPPORTUNITY', rows:valid.length, opportunities};
}

function parseCsv(text) {
  const lines=text.trim().split(/\r?\n/); if (lines.length<2) return [];
  const headers=lines[0].split(',').map(s=>s.trim().toLowerCase());
  return lines.slice(1).filter(Boolean).map(line=>Object.fromEntries(line.split(',').map((v,i)=>[headers[i],v.trim()])));
}

if (process.argv[1]?.endsWith('report-search-console.mjs')) {
  const file=process.argv[2];
  if (!file) { console.error('Usage: node scripts/report-search-console.mjs <search-console.csv>'); process.exit(2); }
  console.log(JSON.stringify(buildSearchConsoleReport(parseCsv(fs.readFileSync(file,'utf8'))), null, 2));
}
