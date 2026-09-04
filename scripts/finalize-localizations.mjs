import { readFile, writeFile } from 'node:fs/promises';

const siteRoot = new URL('../site/', import.meta.url);
const config = JSON.parse(await readFile(new URL('i18n/locales.json', siteRoot), 'utf8'));
const catalog = JSON.parse(await readFile(new URL('data/wdi/index.json', siteRoot), 'utf8'));

const escRx = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const countryDisplayName = (code, locale, fallback) => {
  try {
    if (!/^[A-Z]{2}$/.test(code)) return fallback;
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code) || fallback;
  } catch { return fallback; }
};

for (const [locale, cfg] of Object.entries(config.locales)) {
  if (locale === config.defaultLocale || !cfg.path) continue;
  const root = new URL(`${cfg.path}/`, siteRoot);
  const homeUrl = new URL('index.html', root);
  const files = [homeUrl, new URL('data/index.html', root)];
  for (const item of catalog.indicators || []) files.push(new URL(`data/${item.slug}/index.html`, root));

  for (const file of files) {
    let html;
    try { html = await readFile(file, 'utf8'); } catch { continue; }

    html = html.replaceAll('<span class="pill">DATA</span>', `<span class="pill">${cfg.ui?.data || 'DATA'}</span>`)
      .replaceAll('<span class="pill">COUNTRIES</span>', `<span class="pill">${cfg.ui?.countries || 'COUNTRIES'}</span>`)
      .replaceAll('World Bank WDI', cfg.ui?.indicatorCode || 'World Bank WDI');

    for (const item of catalog.indicators || []) {
      const localizedName = cfg.indicatorNames?.[item.slug];
      const localizedUnit = cfg.unitNames?.[item.unit];
      if (localizedName) html = html.replaceAll(item.name, localizedName);
      if (localizedUnit) html = html.replaceAll(item.unit, localizedUnit);
    }

    html = html.replace(/<p class="muted">[^<]*:\s*([^<]+?)\s*·\s*([^<]+)<\/p>/g, (_match, _label, unit) => `<p class="muted">${cfg.ui?.officialCode || cfg.officialLabel}: <code>${extractCode(html)}</code> · ${unit}</p>`);
    html = html.replace(/<strong>([^<]+)<\/strong><br><span class="muted">([A-Z]{2})\s*·\s*[^<]*<\/span>/g, (_m, country, code) => `<strong>${countryDisplayName(code, cfg.htmlLang, country)}</strong><br><span class="muted">${code}</span>`);

    if (file.href === homeUrl.href && cfg.fullSiteReady !== true) {
      html = html.replaceAll(`>${cfg.browseCountries} →</a>`, `>${cfg.browseCountries} · ${cfg.openInEnglish} →</a>`);
    }

    await writeFile(file, html, 'utf8');
  }
}

function extractCode(html) {
  return html.match(/<div class="eyebrow">([^ ·<]+)/)?.[1] || '';
}

console.log('Finalized localized UI labels, units and country names.');
