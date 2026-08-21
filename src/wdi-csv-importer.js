import { parseCsv } from './csv.js';
import { normalizeWdiArchiveRows } from './wdi-archive-adapter.js';

function findHeaderStart(text) {
  const normalized = String(text).replace(/^\uFEFF/, '');
  const lines = normalized.split(/\r?\n/);
  const index = lines.findIndex((line) => line.includes('Country Name') && line.includes('Country Code') && line.includes('Indicator Code'));
  if (index < 0) throw new Error('Could not locate WDI CSV header');
  return lines.slice(index).join('\n');
}

/**
 * Parse a raw World Development Indicators archive CSV and normalize it into
 * provenance-carrying vintage observations. Some World Bank CSV exports contain
 * metadata/preamble rows before the actual header, so we locate the canonical
 * WDI header before passing content to the generic CSV parser.
 */
export function importWdiArchiveCsv(text, context = {}) {
  if (typeof text !== 'string' || !text.trim()) throw new Error('WDI CSV input is required');
  const rows = parseCsv(findHeaderStart(text));
  return normalizeWdiArchiveRows(rows, context);
}
