import { assessComparability } from './comparability-gate.js';

export function compareObservations(previous, current) {
  if (!previous || !current) throw new Error('Both observations are required');
  const assessment = assessComparability(previous, current);
  if (!assessment.comparable) {
    return { comparable: false, reason: assessment.reasons[0], reasons: assessment.reasons };
  }
  if (!Number.isFinite(previous.value) || !Number.isFinite(current.value)) return { comparable: false, reason: 'invalid-value' };

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
