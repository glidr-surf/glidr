import { filterSearch } from '../../src/utils/searchFilter';
import type { Board, Shaper } from '../../src/types';

const boards = [
  { id: 'b1', name: 'The Fish', shaper: 'Lost' },
  { id: 'b2', name: 'Mid 6', shaper: 'Pyzel' },
] as Board[];
const shapers = [
  { id: 's1', name: 'Pyzel', location: 'Hawaii' },
] as Shaper[];

describe('filterSearch', () => {
  it('matches boards by name or shaper, case-insensitive', () => {
    expect(filterSearch(boards, shapers, 'fish').boards.map((b) => b.id)).toEqual(['b1']);
    expect(filterSearch(boards, shapers, 'PYZEL').boards.map((b) => b.id)).toEqual(['b2']);
  });

  it('matches shapers by name or location', () => {
    expect(filterSearch(boards, shapers, 'hawaii').shapers.map((s) => s.id)).toEqual(['s1']);
  });

  it('returns empty results for an empty query', () => {
    expect(filterSearch(boards, shapers, '')).toEqual({ boards: [], shapers: [] });
  });
});
