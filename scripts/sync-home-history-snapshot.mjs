import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const siteRoot = new URL('../site/', import.meta.url);
const historyIndexUrl = new URL('data/wdi/history-index.json', siteRoot);

const locales = {
  en: { path: 'index.html', locale: 'en-US', note: ({ indicators, fromYear, toYear, observations, date }) => `Derived from the current World Bank WDI history catalog: ${indicators} indicators, ${fromYear}–${toYear}, ${observations} published country-year observations; aggregates and missing values are excluded. Catalog snapshot: ${date}.` },
  de: { path: 'de/index.html', locale: 'de-DE', note: ({ indicators, fromYear, toYear, observations, date }) => `Aus dem aktuellen World-Bank-WDI-Verlaufskatalog abgeleitet: ${indicators} Indikatoren, ${fromYear}–${toYear}, ${observations} veröffentlichte Länder-Jahr-Beobachtungen; Aggregate und fehlende Werte sind ausgeschlossen. Katalogstand: ${date}.` },
  es: { path: 'es/index.html', locale: 'es-ES', note: ({ indicators, fromYear, toYear, observations, date }) => `Derivado del catálogo histórico WDI actual del Banco Mundial: ${indicators} indicadores, ${fromYear}–${toYear}, ${observations} observaciones país-año publicadas; se excluyen agregados y valores ausentes. Instantánea del catálogo: ${date}.` },
  fr: { path: 'fr/index.html', locale: 'fr-FR', note: ({ indicators, fromYear, toYear, observations, date }) => `Dérivé du catalogue historique WDI actuel de la Banque mondiale : ${indicators} indicateurs, ${fromYear}–${toYear}, ${observations} observations pays-année publiées ; les agrégats et valeurs manquantes sont exclus. État du catalogue : ${date}.` },
  'zh-hans': { path: 'zh-hans/index.html', locale: 'zh-CN', note: ({ indicators, fromYear, toYear, observations, date }) => `数据来自当前世界银行 WDI 历史目录：${indicators} 个指标，${fromYear}–${toYear} 年，共 ${observations} 条已发布的国家-年份观测；不含汇总项和缺失值。目录快照：${date}。` }
};

export function snapshotFromHistoryIndex(index, localeName = 'en-US') {
  if (!Array.isArray(index?.indicators) || !index.indicators.length) throw new Error('history index has no indicators');
  const observations = index.indicators.reduce((sum, indicator) => {
    if (!Number.isInteger(indicator?.observations) || indicator.observations < 0) throw new Error(`invalid observation count for ${indicator?.slug || indicator?.code || 'indicator'}`);
    return sum + indicator.observations;
  }, 0);
  if (!Number.isInteger(index.fromYear) || !Number.isInteger(index.toYear) || index.fromYear > index.toYear) throw new Error('history index has invalid year range');
  const generatedAt = new Date(index.generatedAt);
  if (Number.isNaN(generatedAt.getTime())) throw new Error('history index has invalid generatedAt');
  return {
    indicators: index.indicators.length,
    fromYear: index.fromYear,
    toYear: index.toYear,
    observations: new Intl.NumberFormat(localeName).format(observations),
    rawObservations: observations,
    date: new Intl.DateTimeFormat(localeName, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(generatedAt)
  };
}

export function updateHomepageHtml(html, { count, note }) {
  const withoutNote = html.replace(/<p class="muted home-data-snapshot" data-wd-history-snapshot>[\s\S]*?<\/p>/, '');
  const factsPattern = /(<div class="facts">)([\s\S]*?)(<\/div>)(<p class="home-cta">)/;
  const match = withoutNote.match(factsPattern);
  if (!match) {
    if (/153k\+/i.test(withoutNote)) throw new Error('stale homepage observation claim could not be normalized');
    return withoutNote;
  }

  let factIndex = 0;
  const updatedFacts = match[2].replace(
    /(<div class="fact"><div class="value">)([^<]+)(<\/div><div class="label">[\s\S]*?<\/div><\/div>)/g,
    (whole, open, value, close) => {
      factIndex += 1;
      return factIndex === 2 ? `${open}${count}${close}` : whole;
    }
  );
  if (factIndex < 2) throw new Error('homepage observation fact not found');

  const replacement = `${match[1]}${updatedFacts}${match[3]}<p class="muted home-data-snapshot" data-wd-history-snapshot>${note}</p>${match[4]}`;
  return withoutNote.replace(factsPattern, replacement);
}

export async function syncHomeHistorySnapshot() {
  const index = JSON.parse(await readFile(historyIndexUrl, 'utf8'));
  let changed = 0;
  for (const config of Object.values(locales)) {
    const file = new URL(config.path, siteRoot);
    const html = await readFile(file, 'utf8');
    const snapshot = snapshotFromHistoryIndex(index, config.locale);
    const next = updateHomepageHtml(html, { count: snapshot.observations, note: config.note(snapshot) });
    if (next !== html) {
      await writeFile(file, next);
      changed += 1;
    }
  }
  if (changed < 1) throw new Error('no homepage history total was synchronized');
  console.log(`Synced sourced WDI history totals on ${changed} homepage(s); locales without a published total were left unchanged.`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  syncHomeHistorySnapshot().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
