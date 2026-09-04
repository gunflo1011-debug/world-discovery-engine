import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const SITE_ROOT = new URL("../site/", import.meta.url);

test("public status page describes current coverage without stale release copy or routes", async () => {
  const html = await readFile(new URL("status/index.html", SITE_ROOT), "utf8");

  assert.match(html, /<title>Data status — World Discovery<\/title>/i);
  assert.match(html, /Current verified coverage/i);
  assert.match(html, /Verified indicators[\s\S]*30/i);
  assert.match(html, /Country and territory directory[\s\S]*217/i);
  assert.match(html, /Country and territory profiles/i);
  assert.match(html, /Historical explorer[\s\S]*Available/i);
  assert.match(html, /Official source/i);
  assert.match(html, /Observation year stays visible/i);
  assert.match(html, /Missing data stays missing/i);
  assert.match(html, /Data catalog/i);
  assert.match(html, /Country comparison/i);
  assert.match(html, /href="\.\.\/data\//i);
  assert.match(html, /href="\.\.\/countries\//i);
  assert.match(html, /href="\.\.\/compare\//i);

  assert.doesNotMatch(html, /World Discovery Data/i);
  assert.doesNotMatch(html, /\.\.\/indicators\/index\.html/i);
  assert.doesNotMatch(html, /\.\.\/explore\/index\.html/i);
  assert.doesNotMatch(html, /Three verified data products are published/i);
  assert.doesNotMatch(html, /Search Console/i);
  assert.doesNotMatch(html, /Organic clicks/i);
  assert.doesNotMatch(html, /Readiness gates/i);
  assert.doesNotMatch(html, /growth engine/i);
  assert.doesNotMatch(html, /PENDING EXTERNAL VERIFICATION/i);
});
