import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const site = new URL('../site/', import.meta.url);

test('shared shell keeps Sources inside each completed locale', async () => {
  execFileSync(process.execPath, ['scripts/apply-shared-site-shell.mjs'], { cwd: root, stdio: 'pipe' });
  const cases = [
    ['de', 'Quellen'],
    ['es', 'Fuentes'],
    ['fr', 'Sources'],
    ['zh-hans', '来源']
  ];
  for (const [locale, label] of cases) {
    const home = await readFile(new URL(`${locale}/index.html`, site), 'utf8');
    const sources = await readFile(new URL(`${locale}/sources/index.html`, site), 'utf8');
    assert.match(home, new RegExp(`href="\\./sources/"[^>]*>${label}<\\/a>`));
    assert.match(sources, new RegExp(`href="\\./"[^>]*>${label}<\\/a>`));
    assert.doesNotMatch(home, new RegExp(`${label} · (Auf Englisch öffnen|Abrir en inglés|Ouvrir en anglais|用英语打开)`));
    assert.match(sources, new RegExp(`data-wd-shell-locale="${locale}"`));
  }
});
