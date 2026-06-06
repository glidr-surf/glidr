import { describe, it, expect } from 'vitest';
import { getBoards, getBoard } from '../src/queries/boards';
import { anonClient } from './helpers';

const FLAT_TRACKER = '20000000-0000-0000-0000-000000000001';

describe('getBoards', () => {
  it('returns approved boards with populated stats', async () => {
    const boards = await getBoards(anonClient());
    expect(boards.length).toBeGreaterThanOrEqual(8);
    const ft = boards.find((b) => b.id === FLAT_TRACKER);
    expect(ft).toBeDefined();
    expect(ft!.shaper).toBe('Christenson');
    expect(ft!.rating).toBe(4.5);
    expect(ft!.opinionCount).toBe(2);
  });

  it('filters by type', async () => {
    const fish = await getBoards(anonClient(), { type: 'FISH' });
    expect(fish.length).toBeGreaterThanOrEqual(1);
    expect(fish.every((b) => b.type === 'FISH')).toBe(true);
  });
});

describe('getBoard', () => {
  it('returns a single board with stats', async () => {
    const board = await getBoard(anonClient(), FLAT_TRACKER);
    expect(board?.name).toBe('FLAT TRACKER');
    expect(board?.rating).toBe(4.5);
    expect(board?.opinionCount).toBe(2);
  });

  it('returns null for an unknown id', async () => {
    const board = await getBoard(anonClient(), '20000000-0000-0000-0000-0000000000ff');
    expect(board).toBeNull();
  });
});
