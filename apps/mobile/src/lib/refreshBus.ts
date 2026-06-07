// Tiny cross-screen "needs refresh" signal. A screen marks a key dirty after a
// mutation (e.g. posting an opinion); other screens refetch on focus only if their
// key is dirty — so we don't hit the network on every focus.
const dirty = new Set<string>();

export function markDirty(...keys: string[]): void {
  for (const k of keys) dirty.add(k);
}

/** Returns true once if the key was dirty, and clears it. */
export function consumeDirty(key: string): boolean {
  if (!dirty.has(key)) return false;
  dirty.delete(key);
  return true;
}

export const boardKey = (id: string) => `board:${id}`;
export const PROFILE_KEY = 'profile';
