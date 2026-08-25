import { requireComparable } from './comparability-gate.js';

function present(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

/**
 * Compare two observations only when their indicator/entity/period/unit/methodology
 * are compatible and both retain source provenance.
 *
 * The returned delta is right - left so callers can consistently interpret the
 * newer/second observation relative to the first without losing provenance.
 */
export function compareObservations(left, right) {
  requireComparable(left, right);

  if (!present(left.source) || !present(right.source)) {
    throw new Error('Observations are not comparable: missing-source');
  }

  const leftValue = Number(left.value);
  const rightValue = Number(right.value);
  if (!Number.isFinite(leftValue) || !Number.isFinite(rightValue)) {
    throw new Error('Observations are not comparable: invalid-value');
  }

  return {
    indicator: left.indicator,
    entity: left.entity,
    period: left.period,
    unit: left.unit,
    methodologyVersion: left.methodologyVersion,
    left: { value: leftValue, source: left.source },
    right: { value: rightValue, source: right.source },
    delta: rightValue - leftValue,
  };
}
