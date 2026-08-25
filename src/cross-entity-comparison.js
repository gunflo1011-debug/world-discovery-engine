function present(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

/**
 * Compare two different entities for the same indicator snapshot.
 * Cross-entity comparison is intentionally separate from revision comparison:
 * indicator, period, unit and methodology must match, while entity must differ.
 * Both observations must retain source provenance.
 */
export function compareEntities(left, right) {
  if (!left || !right) throw new Error('Entities are not comparable: missing-observation');

  const reasons = [];
  for (const field of ['indicator', 'period']) {
    if (!present(left[field]) || !present(right[field]) || String(left[field]) !== String(right[field])) {
      reasons.push(`${field}-mismatch`);
    }
  }

  if (!present(left.entity) || !present(right.entity)) reasons.push('missing-entity');
  else if (String(left.entity) === String(right.entity)) reasons.push('same-entity');

  if (!present(left.unit) || !present(right.unit)) reasons.push('missing-unit');
  else if (String(left.unit) !== String(right.unit)) reasons.push('unit-mismatch');

  if (!present(left.methodologyVersion) || !present(right.methodologyVersion)) reasons.push('missing-methodology-version');
  else if (String(left.methodologyVersion) !== String(right.methodologyVersion)) reasons.push('methodology-mismatch');

  if (!present(left.source) || !present(right.source)) reasons.push('missing-source');

  if (reasons.length) throw new Error(`Entities are not comparable: ${reasons.join(', ')}`);

  const leftValue = Number(left.value);
  const rightValue = Number(right.value);
  if (!Number.isFinite(leftValue) || !Number.isFinite(rightValue)) {
    throw new Error('Entities are not comparable: invalid-value');
  }

  return {
    indicator: left.indicator,
    period: left.period,
    unit: left.unit,
    methodologyVersion: left.methodologyVersion,
    left: { entity: left.entity, value: leftValue, source: left.source },
    right: { entity: right.entity, value: rightValue, source: right.source },
    delta: rightValue - leftValue,
  };
}
