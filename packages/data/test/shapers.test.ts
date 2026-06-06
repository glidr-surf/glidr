import { describe, it, expect } from 'vitest';
import { getShapers, getShaper } from '../src/queries/shapers';
import { anonClient } from './helpers';

const CHRISTENSON = '10000000-0000-0000-0000-000000000001';

describe('getShapers', () => {
  it('returns approved shapers with populated stats', async () => {
    const shapers = await getShapers(anonClient());
    expect(shapers.length).toBeGreaterThanOrEqual(6);
    const c = shapers.find((s) => s.id === CHRISTENSON);
    expect(c).toBeDefined();
    expect(c!.name).toBe('Christenson');
    expect(c!.boardCount).toBeGreaterThanOrEqual(1);
  });
});

describe('getShaper', () => {
  it('returns a single shaper with stats', async () => {
    const shaper = await getShaper(anonClient(), CHRISTENSON);
    expect(shaper?.name).toBe('Christenson');
    expect(shaper?.boardCount).toBeGreaterThanOrEqual(1);
  });
});
