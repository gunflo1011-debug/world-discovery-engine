import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function html(path) {
  return readFile(new URL(`../site/${path}`, import.meta.url), 'utf8');
}

test('German trend hub and answer keep a German shell after the full build', async () => {
  for (const path of ['trends/de/index.html', 'trends/de/schalke-bayern/index.html']) {
    const page = await html(path);
    assert.match(page, /<html lang="de">/i);
    assert.match(page, />Deutschland-Trends</);
    assert.match(page, />Daten</);
    assert.match(page, />Länder</);
    assert.match(page, /Suchtrends mit verifizierten Antworten\./);
    assert.doesNotMatch(page, />Home<|>Explore<|>Countries<|>Compare<|>Legal notice<|>Privacy</);
  }
});

test('Brazil trend hub and answer keep a Portuguese shell after the full build', async () => {
  for (const path of ['trends/br/index.html', 'trends/br/fluminense-vasco-da-gama/index.html']) {
    const page = await html(path);
    assert.match(page, /<html lang="pt-BR">/i);
    assert.match(page, />Tendências do Brasil</);
    assert.match(page, />Dados</);
    assert.match(page, />Países</);
    assert.match(page, /Tendências de busca com respostas verificadas\./);
    assert.doesNotMatch(page, />Home<|>Explore<|>Countries<|>Compare<|>Legal notice<|>Privacy</);
  }
});
