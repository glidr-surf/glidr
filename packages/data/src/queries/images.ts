import type { SupabaseClient } from '@supabase/supabase-js';

export function imagePublicUrl(client: SupabaseClient, path: string): string {
  return client.storage.from('images').getPublicUrl(path).data.publicUrl;
}

/** Map of owner_id -> primary (lowest position) image path, for one owner_type. */
export async function fetchPrimaryImagePaths(
  client: SupabaseClient,
  ownerType: 'board' | 'opinion' | 'profile' | 'shaper',
  ownerIds: string[],
): Promise<Map<string, string>> {
  if (ownerIds.length === 0) return new Map();
  const { data, error } = await client
    .from('images')
    .select('owner_id, path, position')
    .eq('owner_type', ownerType)
    .in('owner_id', ownerIds)
    .order('position', { ascending: true });
  if (error) throw error;
  const map = new Map<string, string>();
  for (const row of data ?? []) {
    if (!map.has(row.owner_id as string)) map.set(row.owner_id as string, row.path as string);
  }
  return map;
}
