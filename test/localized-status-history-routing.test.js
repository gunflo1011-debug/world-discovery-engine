import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const cases = [
  ['de', 'Historie öffnen', /derzeit auf Englisch/i],
  ['es', 'Abrir historial', /actualmente en inglés/i],
  ['fr', 'Ouvrir l’historique', /actuellement en anglais/i],
  ['zh-hans', '打开历史数据', /当前仅提供英文版/]
];

test('localized status pages route history to the localized explorer without stale English-only disclosure', async () => {
  for (const [locale, label, stale] of cases) {
    const html = await readFile(new URL(`../site/${locale}/status/index.html`, import.meta.url), 'utf8');
    assert.match(html, /href="\.\.\/explore\/history\.html"/);
    assert.match(html, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.doesNotMatch(html, stale);
    assert.doesNotMatch(html, /href="\.\.\/\.\.\/explore\/history\.html"/);
  }
});
