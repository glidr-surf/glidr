import { aggregateSpecs } from '../../src/utils/opinionSpecs';
import type { Opinion } from '../../src/types';

const op = (tags: Record<string, string[]>): Opinion => ({ tags, scores: {} } as unknown as Opinion);

describe('aggregateSpecs', () => {
  it('returns the most common tag values + length range', () => {
    const ops = [
      op({ fin_setup: ['TWIN'], wave_size: ['2-4FT'], wave_quality: ['CLEAN'], quiver_role: ['GROVELLER'], board_length: ["5'6\""] }),
      op({ fin_setup: ['TWIN'], quiver_role: ['DAILY DRIVER'], board_length: ["5'10\""] }),
      op({ fin_setup: ['QUAD'], board_length: ["5'8\""] }),
    ];
    const s = aggregateSpecs(ops);
    expect(s.typicalFins).toBe('TWIN');
    expect(s.bestIn).toBe('2-4FT · CLEAN');
    expect(s.quiverRole).toBe('GROVELLER');
    expect(s.dimsRidden).toBe(`5'6"–5'10"`);
  });
  it('handles no tags', () => {
    expect(aggregateSpecs([op({})])).toEqual({ typicalFins: undefined, bestIn: undefined, quiverRole: undefined, dimsRidden: undefined });
  });
});
