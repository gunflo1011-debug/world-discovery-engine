import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const site = new URL('../site/', import.meta.url);
const run = (script) => execFileSync(process.execPath, [script], { cwd: root, stdio: 'pipe' });

test('legal builder publishes language-pure localized legal and privacy pages', async () => {
  run('scripts/build-legal-pages.mjs');
  run('scripts/align-cloudflare-privacy.mjs');
  run('scripts/apply-shared-site-shell.mjs');

  const cases = [
    ['de', 'de', 'Impressum', 'Datenschutzerklärung'],
    ['es', 'es', 'Aviso legal', 'Política de privacidad'],
    ['fr', 'fr', 'Mentions légales', 'Politique de confidentialité'],
    ['zh-hans', 'zh-Hans', '法律声明', '隐私政策'],
  ];

  for (const [path, lang, imprintHeading, privacyHeading] of cases) {
    const imprint = await readFile(new URL(`${path}/impressum/index.html`, site), 'utf8');
    const privacy = await readFile(new URL(`${path}/datenschutz/index.html`, site), 'utf8');
    assert.match(imprint, new RegExp(`<html lang="${lang}"`));
    assert.match(privacy, new RegExp(`<html lang="${lang}"`));
    assert.ok(imprint.includes(`<h1>${imprintHeading}</h1>`));
    assert.ok(privacy.includes(`<h1>${privacyHeading}</h1>`));
    assert.ok(privacy.includes('<h2>3. Cloudflare Web Analytics</h2>'));
    assert.ok(imprint.includes(`https://worlddiscoverydata.com/${path}/impressum/`));
    assert.ok(privacy.includes(`https://worlddiscoverydata.com/${path}/datenschutz/`));
    assert.doesNotMatch(imprint, /World Discovery Engine/);
    assert.doesNotMatch(privacy, /World Discovery Engine/);
    assert.doesNotMatch(imprint, /data-wd-shell-locale="en"/);
    assert.doesNotMatch(privacy, /data-wd-shell-locale="en"/);
  }
});

test('localized shell keeps legal footer links inside the active locale', async () => {
  const shell = await readFile(new URL('scripts/apply-shared-site-shell.mjs', root), 'utf8');
  assert.match(shell, /LOCALIZED_SECTIONS = new Set\(\[[^\]]*'impressum'[^\]]*'datenschutz'/s);

  run('scripts/build-legal-pages.mjs');
  run('scripts/align-cloudflare-privacy.mjs');
  run('scripts/apply-shared-site-shell.mjs');
  const html = await readFile(new URL('es/data/index.html', site), 'utf8');
  assert.match(html, /href="\.\.\/impressum\/"[^>]*>Aviso legal<\/a>/);
  assert.match(html, /href="\.\.\/datenschutz\/"[^>]*>Privacidad<\/a>/);
  assert.doesNotMatch(html, /Aviso legal · Abrir en inglés|Privacidad · Abrir en inglés/);
});
