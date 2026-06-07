const UNI: Record<string, string> = { '1/8': '⅛', '1/4': '¼', '3/8': '⅜', '1/2': '½', '5/8': '⅝', '3/4': '¾', '7/8': '⅞' };

function frac(numer: number, denom: number): string {
  if (numer === 0) return '';
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const k = gcd(numer, denom);
  const n = numer / k;
  const d = denom / k;
  return UNI[`${n}/${d}`] ?? `${n}/${d}`;
}

/** decimal inches -> 5'10½" */
export function formatLength(inches: number): string {
  const ft = Math.floor(inches / 12);
  const remInch = inches - ft * 12;
  const wholeIn = Math.floor(remInch);
  const half = remInch - wholeIn >= 0.5 ? '½' : '';
  return `${ft}'${wholeIn}${half}"`;
}

/** decimal inches -> 20¼" (denom 8) / 2 9/16" (denom 16) */
export function formatInches(inches: number, denom: 8 | 16): string {
  const whole = Math.floor(inches);
  const numer = Math.round((inches - whole) * denom);
  if (numer === 0) return `${whole}"`;
  if (numer === denom) return `${whole + 1}"`;
  const f = frac(numer, denom);
  return f.length === 1 ? `${whole}${f}"` : `${whole} ${f}"`;
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

// --- string outputs (canonical stored format, matching the seed) ---
/** ft/in/half -> 5'10" / 5'10½" */
export const lengthStr = (ft: number, inch: number, half: boolean): string => `${ft}'${inch}${half ? '½' : ''}"`;
/** decimal inches -> "20.25\"" (trailing zeros trimmed) */
export const inchesStr = (n: number): string => `${parseFloat(n.toFixed(4))}"`;
/** litres -> "33L" / "33.8L" */
export const volumeStr = (n: number): string => `${parseFloat(n.toFixed(1))}L`;
