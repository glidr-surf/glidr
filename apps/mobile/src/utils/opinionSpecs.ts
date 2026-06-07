import type { Opinion } from '../types';

function mode(values: string[]): string | undefined {
  if (values.length === 0) return undefined;
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

const tagValues = (ops: Opinion[], key: string): string[] => ops.flatMap((o) => o.tags[key] ?? []);

const lengthToInches = (s: string): number => {
  const m = s.match(/(\d+)'(\d+)/);
  return m ? Number(m[1]) * 12 + Number(m[2]) : 0;
};

export interface AggregatedSpecs {
  typicalFins?: string;
  bestIn?: string;
  quiverRole?: string;
  dimsRidden?: string;
}

/** Aggregate the extra detail captured across a board's opinions for the Specs tab. */
export function aggregateSpecs(ops: Opinion[]): AggregatedSpecs {
  const bestIn = [mode(tagValues(ops, 'wave_size')), mode(tagValues(ops, 'wave_quality'))]
    .filter(Boolean)
    .join(' · ');

  let dimsRidden: string | undefined;
  const lengths = [...new Set(tagValues(ops, 'board_length'))].sort((a, b) => lengthToInches(a) - lengthToInches(b));
  if (lengths.length === 1) dimsRidden = lengths[0];
  else if (lengths.length > 1) dimsRidden = `${lengths[0]}–${lengths[lengths.length - 1]}`;

  return {
    typicalFins: mode(tagValues(ops, 'fin_setup')),
    bestIn: bestIn || undefined,
    quiverRole: mode(tagValues(ops, 'quiver_role')),
    dimsRidden,
  };
}
