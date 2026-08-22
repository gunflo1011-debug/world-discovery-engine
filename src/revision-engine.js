import { assessComparability } from './comparability-gate.js';

function publicReason(reason) {
  return String(reason ?? '').replaceAll('-', '_');
}

function normalizeNumber(value) {
  return Number.isFinite(value) ? Number(value.toPrecision(15)) : value;
}

export function compareObservations(previous, current) {
  if (!previous || !current) throw new Error('Both observations are required');
  const assessment = assessComparability(previous, current);
  if (!assessment.comparable) {
    return { comparable: false, reason: publicReason(assessment.reasons[0]) };
  }
  if (!Number.isFinite(previous.value) || !Number.isFinite(current.value)) {
    return { comparable: false, reason: 'invalid_value' };
  }

  const absoluteRevision = normalizeNumber(current.value - previous.value);
  const percentageRevision = previous.value === 0
    ? null
    : normalizeNumber((absoluteRevision / Math.abs(previous.value)) * 100);

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
