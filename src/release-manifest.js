const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Build explicit provenance for a WDI archive release. We never infer a
 * methodology version from the indicator code alone: World Bank warns that
 * codes can span base-year/valuation changes across archive vintages.
 */
export function createReleaseManifest(input = {}) {
  const { vintage, sourceUrl, retrievedAt, methodologyVersion, unit, notes = null } = input;
  if (!DATE_RE.test(vintage ?? '')) throw new Error('vintage must be YYYY-MM-DD');
  if (!sourceUrl) throw new Error('sourceUrl is required');
  if (!retrievedAt) throw new Error('retrievedAt is required');
  return Object.freeze({
    vintage,
    sourceUrl,
    retrievedAt,
    methodologyVersion: methodologyVersion ?? null,
    unit: unit ?? null,
    notes,
  });
}

export function contextFromManifest(manifest, overrides = {}) {
  if (!manifest) throw new Error('release manifest is required');
  if (!manifest.methodologyVersion) {
    throw new Error('methodologyVersion must be validated before revision comparison');
  }
  if (!manifest.unit) throw new Error('unit must be validated before revision comparison');
  return {
    vintage: manifest.vintage,
    sourceUrl: manifest.sourceUrl,
    retrievedAt: manifest.retrievedAt,
    methodologyVersion: manifest.methodologyVersion,
    unit: manifest.unit,
    ...overrides,
  };
}
