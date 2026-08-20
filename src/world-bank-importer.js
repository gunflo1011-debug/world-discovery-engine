const REQUIRED_FIELDS = ['indicator', 'entity', 'period', 'vintage', 'unit', 'methodologyVersion'];

export function normalizeWorldBankObservation(row, context = {}) {
  if (!row || typeof row !== 'object') throw new Error('World Bank row is required');

  const observation = {
    indicator: row.indicator?.id ?? row.indicator ?? context.indicator,
    indicatorName: row.indicator?.value ?? context.indicatorName ?? null,
    entity: row.country?.id ?? row.countryiso3code ?? row.entity ?? context.entity,
    entityName: row.country?.value ?? context.entityName ?? null,
    period: String(row.date ?? row.period ?? context.period ?? ''),
    value: typeof row.value === 'number' ? row.value : Number(row.value),
    vintage: String(context.vintage ?? row.vintage ?? ''),
    unit: context.unit ?? row.unit ?? null,
    methodologyVersion: context.methodologyVersion ?? row.methodologyVersion ?? null,
    source: context.source ?? 'world-bank',
    sourceUrl: context.sourceUrl ?? null
  };

  for (const field of REQUIRED_FIELDS) {
    if (observation[field] === null || observation[field] === undefined || observation[field] === '') {
      throw new Error(`Missing required observation field: ${field}`);
    }
  }
  if (!Number.isFinite(observation.value)) throw new Error('Observation value must be numeric');

  return observation;
}

export function normalizeWorldBankPayload(payload, context = {}) {
  if (!Array.isArray(payload) || payload.length < 2 || !Array.isArray(payload[1])) {
    throw new Error('Unexpected World Bank API payload');
  }
  return payload[1]
    .filter((row) => row?.value !== null && row?.value !== undefined)
    .map((row) => normalizeWorldBankObservation(row, context));
}
