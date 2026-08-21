function xmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function normalizedBase(baseUrl) {
  const url = new URL(baseUrl);
  url.pathname = `${url.pathname.replace(/\/$/, '')}/`;
  url.search = '';
  url.hash = '';
  return url;
}

function publicUrl(baseUrl, path) {
  const base = normalizedBase(baseUrl);
  return new URL(String(path).replace(/^\//, ''), base).toString();
}

export function renderRobotsTxt({ baseUrl }) {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    '# Explicitly allow OpenAI search discovery. Do not use this as a substitute for useful public content.',
    'User-agent: OAI-SearchBot',
    'Allow: /',
    '',
    `Sitemap: ${publicUrl(baseUrl, 'sitemap.xml')}`,
    ''
  ].join('\n');
}

export function renderSitemap({ baseUrl, pages }) {
  const urls = pages.map((page) => {
    const location = publicUrl(baseUrl, page.path);
    const lastmod = page.lastModified ? `\n    <lastmod>${xmlEscape(page.lastModified)}</lastmod>` : '';
    return `  <url>\n    <loc>${xmlEscape(location)}</loc>${lastmod}\n  </url>`;
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    ''
  ].join('\n');
}
