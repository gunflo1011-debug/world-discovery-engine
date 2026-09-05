import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const repoRoot = fileURLToPath(new URL('../', import.meta.url));
const siteRoot = fileURLToPath(new URL('../site/', import.meta.url));
const localePrefixes = new Map([
  ['de', 'de'],
  ['es', 'es'],
  ['fr', 'fr'],
  ['zh-hans', 'zh-Hans']
]);
const localizedCorePrefixes = [
  '/data/',
  '/countries/',
  '/compare/',
  '/methodology/',
  '/sources/',
  '/status/',
  '/explore/',
  '/impressum/',
  '/datenschutz/'
];
const forbiddenVisibleEnglishFallbacks = [
  'Open in English',
  'View in English',
  'currently in English',
  'available in English',
  'Search countries',
  'Clear search',
  'No results found',
  'No data available',
  'Loading data',
  'Compare countries',
  'Select countries',
  'Select indicator',
  'Data status'
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function rel(file) {
  return path.relative(siteRoot, file).replaceAll(path.sep, '/');
}

function visibleText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

test('fresh production build has no legacy brand/domain residue and localized paths declare the correct language', async () => {
  // Other regression tests intentionally exercise individual builders and can mutate
  // generated files. Rebuild here so this gate always inspects the exact release artifact.
  await execFileAsync('npm', ['run', 'build'], { cwd: repoRoot, maxBuffer: 16 * 1024 * 1024 });

  const files = await walk(siteRoot);
  assert.ok(files.length > 1000, `expected full generated site, found only ${files.length} HTML files`);

  const failures = [];
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const relative = rel(file);

    // Legacy product names were proper-cased brands. Keep this case-sensitive so
    // ordinary prose such as "World Discovery data" is not misclassified.
    if (/World Discovery (?:Engine|Data)/.test(html)) failures.push(`${relative}: legacy World Discovery branding`);
    if (/gunflo1011-debug\.github\.io\/world-discovery-engine/i.test(html)) failures.push(`${relative}: legacy GitHub Pages origin`);

    const canonical = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["'][^>]*>/i)?.[1]
      ?? html.match(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["']canonical["'][^>]*>/i)?.[1];
    if (canonical && !canonical.startsWith('https://worlddiscoverydata.com/')) {
      failures.push(`${relative}: non-production canonical ${canonical}`);
    }

    const first = relative.split('/')[0].toLowerCase();
    const expectedLang = localePrefixes.get(first);
    if (expectedLang) {
      const lang = html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i)?.[1];
      if (lang !== expectedLang) failures.push(`${relative}: expected lang=${expectedLang}, got ${lang ?? 'missing'}`);

      // A localized page must own its canonical URL. Missing canonicals or canonicals
      // that collapse to English hide locale defects and would undermine release SEO.
      if (!canonical) {
        failures.push(`${relative}: missing localized canonical`);
      } else {
        let pathname;
        try {
          pathname = new URL(canonical).pathname.toLowerCase();
        } catch {
          failures.push(`${relative}: invalid canonical ${canonical}`);
        }
        if (pathname && !pathname.startsWith(`/${first}/`)) {
          failures.push(`${relative}: localized canonical escapes /${first}/ (${canonical})`);
        }
      }

      // Localized core sections already exist for every published locale. Internal links
      // from a localized page must therefore stay in that locale instead of silently
      // dropping visitors onto the English equivalent. Language-switch links to `/` are
      // intentionally outside this check.
      for (const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)) {
        const href = match[1];
        if (localizedCorePrefixes.some((prefix) => href.toLowerCase().startsWith(prefix))) {
          failures.push(`${relative}: localized core link escapes /${first}/ (${href})`);
        }
      }

      // Scan rendered copy rather than raw HTML so shared JavaScript locale dictionaries
      // can legitimately contain English strings. These phrases are user-facing fallback
      // states that must not reappear on a published non-English surface.
      const copy = visibleText(html);
      for (const phrase of forbiddenVisibleEnglishFallbacks) {
        if (copy.includes(phrase)) {
          failures.push(`${relative}: visible English fallback ${JSON.stringify(phrase)}`);
        }
      }
    }
  }

  assert.deepEqual(failures, [], `sitewide release residue detected:\n${failures.slice(0, 100).join('\n')}${failures.length > 100 ? `\n...and ${failures.length - 100} more` : ''}`);
});
