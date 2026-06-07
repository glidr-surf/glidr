/** Reduced fraction label as plain text, e.g. (2,8) -> "1/4", (4,8) -> "1/2", (9,16) -> "9/16". Empty for 0. */
export function fractionLabel(numer: number, denom: number): string {
  if (numer === 0) return '';
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const k = gcd(numer, denom);
  return `${numer / k}/${denom / k}`;
}

/** decimal inches -> 5'10½" */
export function formatLength(inches: number): string {
  const ft = Math.floor(inches / 12);
  const remInch = inches - ft * 12;
  const wholeIn = Math.floor(remInch);
  const half = remInch - wholeIn >= 0.5 ? '½' : '';
  return `${ft}'${wholeIn}${half}"`;
}

/** decimal inches -> 20 1/4" (denom 8) / 2 9/16" (denom 16) */
export function formatInches(inches: number, denom: 8 | 16): string {
  const whole = Math.floor(inches);
  const numer = Math.round((inches - whole) * denom);
  if (numer === 0) return `${whole}"`;
  if (numer === denom) return `${whole + 1}"`;
  return `${whole} ${fractionLabel(numer, denom)}"`;
}

export function formatVolume(litres: number): string {
  return `${Number.isInteger(litres) ? litres : litres.toFixed(1)}L`;
}

export const lengthToInches = (ft: number, inch: number, half: boolean): number => ft * 12 + inch + (half ? 0.5 : 0);
export const partsToInches = (whole: number, numer: number, denom: number): number => whole + numer / denom;
export const parseDecimal = (s: string): number | null => {
  const v = parseFloat(s.replace(/[^0-9.]/g, ''));
  return Number.isFinite(v) ? v : null;
};
