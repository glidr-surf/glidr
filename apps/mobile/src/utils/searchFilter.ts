import type { Board, Shaper } from '../types';

export function filterSearch(boards: Board[], shapers: Shaper[], query: string) {
  if (!query) return { boards: [], shapers: [] };
  const q = query.toLowerCase();
  return {
    boards: boards.filter(
      (b) => b.name.toLowerCase().includes(q) || b.shaper.toLowerCase().includes(q),
    ),
    shapers: shapers.filter(
      (s) => s.name.toLowerCase().includes(q) || (s.location?.toLowerCase().includes(q) ?? false),
    ),
  };
}
