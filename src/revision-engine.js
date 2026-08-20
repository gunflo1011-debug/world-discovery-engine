export function compareObservations(previous, current) {
  if (!previous || !current) throw new Error('Both observations are required');
  if (previous.indicator !== current.indicator) return { comparable: false, reason: 'indicator_mismatch' };
  if (previous.entity !== current.entity) return { comparable: false, reason: 'entity_mismatch' };
  if (previous.period !== current.period) return { comparable: false, reason: 'period_mismatch' };
  if (previous.unit !== current.unit) return { comparable: false, reason: 'unit_mismatch' };
  if (previous.methodologyVersion !== current.methodologyVersion) return { comparable: false, reason: 'methodology_mismatch' };
  if (!Number.isFinite(previous.value) || !Number.isFinite(current.value)) return { comparable: false, reason: 'invalid_value' };

  const absoluteRevision = current.value - previous.value;
  const percentageRevision = previous.value === 0 ? null : (absoluteRevision / Math.abs(previous.value)) * 100;

  return {
    comparable: true,
    indicator: current.indicator,
    entity: current.entity,
    period: current.period,
    fromVintage: previous.vintage,
    toVintage: current.vintage,
    previousValue: previous.value,
    currentValue: current.value,
    absoluteRevision,
    percentageRevision,
    direction: absoluteRevision === 0 ? 'unchanged' : absoluteRevision > 0 ? 'up' : 'down'
  };
}

export function buildRevisionHistory(observations) {
  const sorted = [...observations].sort((a, b) => String(a.vintage).localeCompare(String(b.vintage)));
  const events = [];
  for (let i = 1; i < sorted.length; i += 1) {
    const event = compareObservations(sorted[i - 1], sorted[i]);
    if (event.comparable && event.absoluteRevision !== 0) events.push(event);
  }
  return events;
}
