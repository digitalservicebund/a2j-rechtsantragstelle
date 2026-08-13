export type Fraction = { numerator: number; denominator: number };

export const WHOLE: Fraction = { numerator: 1, denominator: 1 };
export const THREE_QUARTERS: Fraction = { numerator: 3, denominator: 4 };
export const HALF: Fraction = { numerator: 1, denominator: 2 };
export const QUARTER: Fraction = { numerator: 1, denominator: 4 };

function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

export function simplify(numerator: number, denominator: number): Fraction {
  const divisor = greatestCommonDivisor(
    Math.abs(numerator),
    Math.abs(denominator),
  );
  return { numerator: numerator / divisor, denominator: denominator / divisor };
}

export function addFractions(a: Fraction, b: Fraction): Fraction {
  return simplify(
    a.numerator * b.denominator + b.numerator * a.denominator,
    a.denominator * b.denominator,
  );
}

export function splitEqually(share: Fraction, parts: number): Fraction {
  return simplify(share.numerator, share.denominator * parts);
}

export function subtractFromWhole(fraction: Fraction): Fraction {
  return simplify(
    fraction.denominator - fraction.numerator,
    fraction.denominator,
  );
}
