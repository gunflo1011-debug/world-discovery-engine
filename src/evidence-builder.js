import { buildRevisionHistory } from './revision-engine.js';

function assertObservationSet(observations) {
  if (!Array.isArray(observations) || observations.length < 2) {
    throw new Error('At least two observations are required');
  }

  const [first] = observations;
  for (const observation of observations) {
    if (observation.indicator !== first.indicator) throw new Error('Mixed indicators are not supported');
    if (observation.entity !== first.entity) throw new Error('Mixed entities are not supported');
    if (observation.period !== first.period) throw new Error('Mixed periods are not supported');
  }
}

export function buildRevisionEvidence(observations) {
  assertObservationSet(observations);
  const sorted = [...observations].sort((a, b) => String(a.vintage).localeCompare(String(b.vintage)));
  const first = sorted[0];
  const latest = sorted.at(-1);
  const events = buildRevisionHistory(sorted);

  const comparableEvents = events.filter((event) => event.comparable !== false);
  const absoluteRevision = latest.value - first.value;
  const percentageRevision = first.value === 0 ? null : (absoluteRevision / Math.abs(first.value)) * 100;

  return {
    schemaVersion: '1.0',
    type: 'revision-evidence',
    id: `${first.indicator}:${first.entity}:${first.period}`,
    indicator: {
      id: first.indicator,
      name: first.indicatorName ?? null,
      unit: first.unit
    },
    entity: {
      id: first.entity,
      name: first.entityName ?? null
    },
    period: first.period,
    methodologyVersion: first.methodologyVersion,
    firstPublished: {
      vintage: first.vintage,
      value: first.value
    },
    latestPublished: {
      vintage: latest.vintage,
      value: latest.value
    },
    revision: {
      absolute: absoluteRevision,
      percentage: percentageRevision,
      direction: absoluteRevision === 0 ? 'unchanged' : absoluteRevision > 0 ? 'up' : 'down',
      eventCount: comparableEvents.length
    },
    provenance: {
      source: first.source,
      sourceUrl: first.sourceUrl ?? null,
      observationCount: sorted.length,
      vintages: sorted.map((observation) => observation.vintage)
    },
    events: comparableEvents
  };
}
