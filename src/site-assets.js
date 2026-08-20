function xmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function renderRobotsTxt({ baseUrl }) {
  const origin = new URL(baseUrl).origin;
  return [
    'User-agent: *',
    'Allow: /',
    '',
    '# Explicitly allow OpenAI search discovery. Do not use this as a substitute for useful public content.',
    'User-agent: OAI-SearchBot',
    'Allow: /',
    '',
    `Sitemap: ${origin}/sitemap.xml`,
    ''
  ].join('\n');
}

export function renderSitemap({ baseUrl, pages }) {
  const origin = new URL(baseUrl).origin;
  const urls = pages.map((page) => {
    const location = new URL(page.path, origin).toString();
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
