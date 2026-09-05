import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const site = new URL('../site/', import.meta.url);

test('localized 404 keeps the compact language menu and locale-aware runtime state', async () => {
  execFileSync(process.execPath, ['scripts/apply-shared-site-shell.mjs'], { cwd: root, stdio: 'pipe' });
  execFileSync(process.execPath, ['scripts/polish-language-switcher.mjs'], { cwd: root, stdio: 'pipe' });

  const html = await readFile(new URL('404.html', site), 'utf8');
  assert.ok(html.includes('class="wd-language-menu"'), '404 should keep the shared compact language menu');
  assert.ok(html.includes('data-wd-404-language-runtime'), '404 should sync the menu to the requested locale at runtime');
  assert.ok(html.includes('href="/de/" hreflang="de"'), '404 should offer German recovery');
  assert.ok(html.includes('href="/es/" hreflang="es"'), '404 should offer Spanish recovery');
  assert.ok(html.includes('href="/fr/" hreflang="fr"'), '404 should offer French recovery');
  assert.ok(html.includes('href="/zh-hans/" hreflang="zh-Hans"'), '404 should offer Simplified Chinese recovery');
  assert.ok(html.includes("const first=location.pathname.split('/').filter(Boolean)[0]?.toLowerCase()"), '404 menu should derive its active locale from the requested path');
  assert.equal((html.match(/class="wd-language-menu"/g) || []).length, 1, '404 should render exactly one language menu');
  assert.equal((html.match(/data-wd-404-language-runtime/g) || []).length, 1, '404 should render exactly one runtime synchronizer');
});
