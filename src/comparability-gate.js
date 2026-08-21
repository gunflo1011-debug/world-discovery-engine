function present(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

export function assessComparability(left, right) {
  if (!left || !right) return { comparable: false, reasons: ['missing-observation'] };

  const reasons = [];
  for (const field of ['indicator', 'entity', 'period']) {
    if (!present(left[field]) || !present(right[field]) || String(left[field]) !== String(right[field])) {
      reasons.push(`${field}-mismatch`);
    }
  }

  if (!present(left.unit) || !present(right.unit)) reasons.push('missing-unit');
  else if (String(left.unit) !== String(right.unit)) reasons.push('unit-mismatch');

  if (!present(left.methodologyVersion) || !present(right.methodologyVersion)) reasons.push('missing-methodology-version');
  else if (String(left.methodologyVersion) !== String(right.methodologyVersion)) reasons.push('methodology-mismatch');

  return { comparable: reasons.length === 0, reasons };
}

export function requireComparable(left, right) {
  const result = assessComparability(left, right);
  if (!result.comparable) {
    throw new Error(`Observations are not comparable: ${result.reasons.join(', ')}`);
  }
  return true;
}
