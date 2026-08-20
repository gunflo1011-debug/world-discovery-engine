function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return 'n/a';
  return new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(value);
}

export function evidenceSlug(evidence) {
  const clean = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${clean(evidence.entity.name ?? evidence.entity.id)}-${clean(evidence.indicator.name ?? evidence.indicator.id)}-${clean(evidence.period)}`;
}

export function renderRevisionEvidencePage(evidence, { baseUrl = 'https://example.com' } = {}) {
  const slug = evidenceSlug(evidence);
  const canonical = `${baseUrl.replace(/\/$/, '')}/evidence/${slug}/`;
  const entity = evidence.entity.name ?? evidence.entity.id;
  const indicator = evidence.indicator.name ?? evidence.indicator.id;
  const pct = evidence.revision.percentage;
  const title = `${entity}: ${indicator} revision for ${evidence.period}`;
  const description = `${indicator} for ${entity} was first published as ${formatNumber(evidence.firstPublished.value)} and is now ${formatNumber(evidence.latestPublished.value)} (${pct === null ? 'percentage change unavailable' : `${formatNumber(pct)}% revision`}).`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: title,
    description,
    url: canonical,
    dateModified: evidence.latestPublished.vintage,
    creator: { '@type': 'Organization', name: 'World Discovery Engine' },
    variableMeasured: indicator,
    temporalCoverage: String(evidence.period),
    measurementTechnique: 'Deterministic comparison of comparable publication vintages',
    isBasedOn: evidence.provenance.sourceUrl || undefined
  };

  const rows = evidence.events.map((event) => `<tr><td>${esc(event.fromVintage)}</td><td>${esc(event.toVintage)}</td><td>${formatNumber(event.fromValue)}</td><td>${formatNumber(event.toValue)}</td><td>${formatNumber(event.absoluteRevision)}</td><td>${event.percentageRevision == null ? 'n/a' : `${formatNumber(event.percentageRevision)}%`}</td></tr>`).join('');

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${esc(canonical)}"><script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll('<', '\\u003c')}</script></head>
<body><main><article><header><p>Revision evidence</p><h1>${esc(title)}</h1><p>${esc(description)}</p><p>Last data vintage: <time datetime="${esc(evidence.latestPublished.vintage)}">${esc(evidence.latestPublished.vintage)}</time></p></header>
<section aria-labelledby="summary"><h2 id="summary">Evidence summary</h2><dl><dt>First published</dt><dd>${formatNumber(evidence.firstPublished.value)} (${esc(evidence.firstPublished.vintage)})</dd><dt>Latest published</dt><dd>${formatNumber(evidence.latestPublished.value)} (${esc(evidence.latestPublished.vintage)})</dd><dt>Absolute revision</dt><dd>${formatNumber(evidence.revision.absolute)}</dd><dt>Percentage revision</dt><dd>${pct === null ? 'n/a' : `${formatNumber(pct)}%`}</dd><dt>Direction</dt><dd>${esc(evidence.revision.direction)}</dd></dl></section>
<section aria-labelledby="history"><h2 id="history">Revision history</h2><div style="overflow-x:auto"><table><thead><tr><th>From vintage</th><th>To vintage</th><th>Old value</th><th>New value</th><th>Absolute revision</th><th>Revision %</th></tr></thead><tbody>${rows}</tbody></table></div></section>
<section aria-labelledby="method"><h2 id="method">Methodology and provenance</h2><p>This page is generated from publication vintages using deterministic calculations. Vintages are compared only when the underlying series passes the project's comparability rules. A revision is an observed change between publications and does not imply a cause.</p><p>Source: ${evidence.provenance.sourceUrl ? `<a href="${esc(evidence.provenance.sourceUrl)}" rel="external">${esc(evidence.provenance.source)}</a>` : esc(evidence.provenance.source)}. Observed vintages: ${evidence.provenance.vintages.map(esc).join(', ')}.</p></section>
</article></main></body></html>`;
}
