import fs from 'node:fs';

const required = ['page','query','date','clicks','impressions','ctr','position'];

export function analyze(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return [];
  const valid = rows.filter(r => required.every(k => Object.hasOwn(r, k)))
    .map(r => ({...r, clicks:Number(r.clicks), impressions:Number(r.impressions), ctr:Number(r.ctr), position:Number(r.position)}))
    .filter(r => r.page && r.query && r.date && [r.clicks,r.impressions,r.ctr,r.position].every(Number.isFinite) && r.impressions > 0);
  return valid.map(r => ({...r, opportunityScore: Math.round(r.impressions * Math.max(0, 1-r.ctr) * (r.position >= 4 && r.position <= 20 ? 1 : 0) * 100)/100}))
    .filter(r => r.opportunityScore > 0)
    .sort((a,b) => b.opportunityScore-a.opportunityScore || b.impressions-a.impressions);
}

function parseCsv(text) {
  const lines=text.trim().split(/\r?\n/); if (lines.length<2) return [];
  const headers=lines[0].split(',').map(s=>s.trim().toLowerCase());
  return lines.slice(1).filter(Boolean).map(line=>Object.fromEntries(line.split(',').map((v,i)=>[headers[i],v.trim()])));
}

if (process.argv[1]?.endsWith('analyze-search-console.mjs')) {
  const file=process.argv[2];
  if (!file) { console.error('Usage: node scripts/analyze-search-console.mjs <search-console.csv>'); process.exit(2); }
  const result=analyze(parseCsv(fs.readFileSync(file,'utf8')));
  if (!result.length) { console.log('NO_DEMAND_EVIDENCE'); process.exit(0); }
  console.log(JSON.stringify(result,null,2));
}
