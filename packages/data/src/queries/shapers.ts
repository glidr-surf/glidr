import type { SupabaseClient } from '@supabase/supabase-js';
import type { Shaper, VibeTag, SubmitShaperInput } from '../types';
import { imagePublicUrl, fetchPrimaryImagePaths } from './images';

interface ShaperStatsRow {
  shaper_id: string;
  board_count: number | null;
  avg_rating: number | null;
  opinion_count: number | null;
  top_vibe_tag: string | null;
}

async function fetchShaperStats(
  client: SupabaseClient,
  shaperIds: string[],
): Promise<Map<string, ShaperStatsRow>> {
  if (shaperIds.length === 0) return new Map();
  const { data, error } = await client
    .from('shaper_stats')
    .select('shaper_id, board_count, avg_rating, opinion_count, top_vibe_tag')
    .in('shaper_id', shaperIds);
  if (error) throw error;
  return new Map((data ?? []).map((s) => [s.shaper_id as string, s as ShaperStatsRow]));
}

export async function getShapers(client: SupabaseClient): Promise<Shaper[]> {
  const { data, error } = await client
    .from('shapers')
    .select('id, name, location, bio')
    .eq('status', 'approved');

  if (error) throw error;
  const rows = data ?? [];
  const ids = rows.map((r) => r.id);
  const stats = await fetchShaperStats(client, ids);
  const logos = await fetchPrimaryImagePaths(client, 'shaper', ids);
  return rows.map((r) => mapShaper(client, r, stats.get(r.id), logos.get(r.id)));
}

export async function getShaper(
  client: SupabaseClient,
  shaperId: string
): Promise<Shaper | null> {
  const { data, error } = await client
    .from('shapers')
    .select('id, name, location, bio')
    .eq('id', shaperId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  const stats = await fetchShaperStats(client, [data.id]);
  const logos = await fetchPrimaryImagePaths(client, 'shaper', [data.id]);
  return mapShaper(client, data, stats.get(data.id), logos.get(data.id));
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

function mapShaper(client: SupabaseClient, row: any, stats?: ShaperStatsRow, logoPath?: string): Shaper {
  return {
    id: row.id,
    name: row.name,
    location: row.location ?? undefined,
    bio: row.bio ?? undefined,
    logoUrl: logoPath ? imagePublicUrl(client, logoPath) : undefined,
    boardCount: stats?.board_count ?? 0,
    avgRating: stats?.avg_rating ?? 0,
    opinionCount: stats?.opinion_count ?? 0,
    topVibeTag: (stats?.top_vibe_tag as VibeTag) ?? undefined,
  };
}
