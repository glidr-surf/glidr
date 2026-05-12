import type { SupabaseClient } from '@supabase/supabase-js';
import type { Shaper, VibeTag, SubmitShaperInput } from '../types';

export async function getShapers(client: SupabaseClient): Promise<Shaper[]> {
  const { data, error } = await client
    .from('shapers')
    .select(`
      id, name, location, bio,
      shaper_stats ( board_count, avg_rating, opinion_count, top_vibe_tag )
    `)
    .eq('status', 'approved');

  if (error) throw error;
  return (data ?? []).map(mapShaper);
}

export async function getShaper(
  client: SupabaseClient,
  shaperId: string
): Promise<Shaper | null> {
  const { data, error } = await client
    .from('shapers')
    .select(`
      id, name, location, bio,
      shaper_stats ( board_count, avg_rating, opinion_count, top_vibe_tag )
    `)
    .eq('id', shaperId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return mapShaper(data);
}

export async function submitShaper(
  client: SupabaseClient,
  input: SubmitShaperInput
): Promise<string> {
  const { data, error } = await client
    .from('shapers')
    .insert({
      name: input.name,
      location: input.location ?? null,
      bio: input.bio ?? null,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

function mapShaper(row: any): Shaper {
  const stats = Array.isArray(row.shaper_stats) ? row.shaper_stats[0] : row.shaper_stats;
  return {
    id: row.id,
    name: row.name,
    location: row.location ?? undefined,
    bio: row.bio ?? undefined,
    boardCount: stats?.board_count ?? 0,
    avgRating: stats?.avg_rating ?? 0,
    opinionCount: stats?.opinion_count ?? 0,
    topVibeTag: (stats?.top_vibe_tag as VibeTag) ?? undefined,
  };
}
