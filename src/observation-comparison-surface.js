import { compareObservations } from './observation-comparison.js';

function sourceLabel(source) {
  if (typeof source === 'string') return source.trim();
  if (source && typeof source === 'object') {
    return String(source.label || source.dataset || source.publisher || source.url || '').trim();
  }
  return '';
}

/**
 * Turn an already trust-gated observation comparison into a small product-facing
 * view model. This intentionally delegates comparability to compareObservations:
 * callers cannot render a delta for mixed entity/year/unit/methodology data.
 */
export function buildObservationComparisonSurface(left, right) {
  const comparison = compareObservations(left, right);
  const leftSource = sourceLabel(comparison.left.source);
  const rightSource = sourceLabel(comparison.right.source);

  if (!leftSource || !rightSource) {
    throw new Error('Observations are not comparable: unusable-source-label');
  }

  const delta = comparison.delta;
  const direction = delta > 0 ? 'higher' : delta < 0 ? 'lower' : 'unchanged';

  return {
    status: 'COMPARABLE',
    indicator: comparison.indicator,
    entity: comparison.entity,
    period: comparison.period,
    unit: comparison.unit,
    methodologyVersion: comparison.methodologyVersion,
    left: { value: comparison.left.value, source: leftSource },
    right: { value: comparison.right.value, source: rightSource },
    delta,
    direction,
    summary: delta === 0
      ? `Unchanged at ${comparison.right.value} ${comparison.unit}.`
      : `${Math.abs(delta)} ${comparison.unit} ${direction} (${comparison.left.value} → ${comparison.right.value}).`,
    trustNote: `Same entity, period, unit and methodology (${comparison.methodologyVersion}); source provenance retained.`,
  };
}
