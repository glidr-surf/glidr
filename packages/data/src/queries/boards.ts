import type { SupabaseClient } from '@supabase/supabase-js';
import type { Board, BoardType, VibeTag, SubmitBoardInput } from '../types';
import { imagePublicUrl, fetchPrimaryImagePaths, type PrimaryImage } from './images';

interface BoardStatsRow {
  board_id: string;
  avg_rating: number | null;
  opinion_count: number | null;
  buy_again_percent: number | null;
  top_vibe_tag: string | null;
}

async function fetchBoardStats(
  client: SupabaseClient,
  boardIds: string[],
): Promise<Map<string, BoardStatsRow>> {
  if (boardIds.length === 0) return new Map();
  const { data, error } = await client
    .from('board_stats')
    .select('board_id, avg_rating, opinion_count, buy_again_percent, top_vibe_tag')
    .in('board_id', boardIds);
  if (error) throw error;
  return new Map((data ?? []).map((s) => [s.board_id as string, s as BoardStatsRow]));
}

export async function getBoards(
  client: SupabaseClient,
  options?: { type?: BoardType; limit?: number }
): Promise<Board[]> {
  let query = client
    .from('boards')
    .select(`
      id, name, shaper_id, type, length, width, thickness, volume, verdict,
      shapers!inner ( name )
    `)
    .eq('status', 'approved');

  if (options?.type) {
    query = query.eq('type', options.type);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;

  const rows = data ?? [];
  const ids = rows.map((r) => r.id);
  const stats = await fetchBoardStats(client, ids);
  const images = await fetchPrimaryImagePaths(client, 'board', ids);
  return rows.map((r) => mapBoard(client, r, stats.get(r.id), images.get(r.id)));
}

export async function getBoard(
  client: SupabaseClient,
  boardId: string
): Promise<Board | null> {
  const { data, error } = await client
    .from('boards')
    .select(`
      id, name, shaper_id, type, length, width, thickness, volume, verdict,
      shapers!inner ( name )
    `)
    .eq('id', boardId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  const stats = await fetchBoardStats(client, [data.id]);
  const images = await fetchPrimaryImagePaths(client, 'board', [data.id]);
  return mapBoard(client, data, stats.get(data.id), images.get(data.id));
}

export async function submitBoard(
  client: SupabaseClient,
  input: SubmitBoardInput
): Promise<string> {
  const { data, error } = await client
    .from('boards')
    .insert({
      name: input.name,
      shaper_id: input.shaperId,
      type: input.type,
      length: input.length ?? null,
      width: input.width ?? null,
      thickness: input.thickness ?? null,
      volume: input.volume ?? null,
      // Added boards/shapers are public immediately (no admin approval — see 00006).
      status: 'approved',
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

function mapBoard(client: SupabaseClient, row: any, stats?: BoardStatsRow, image?: PrimaryImage): Board {
  const shaper = Array.isArray(row.shapers) ? row.shapers[0] : row.shapers;

  return {
    id: row.id,
    name: row.name,
    shaper: shaper?.name ?? '',
    shaperId: row.shaper_id,
    type: row.type as BoardType,
    imageUrl: image ? imagePublicUrl(client, image.path, image.id) : undefined,
    length: row.length ?? undefined,
    width: row.width ?? undefined,
    thickness: row.thickness ?? undefined,
    volume: row.volume ?? undefined,
    rating: stats?.avg_rating ?? 0,
    opinionCount: stats?.opinion_count ?? 0,
    buyAgainPercent: stats?.buy_again_percent ?? 0,
    topVibeTag: (stats?.top_vibe_tag as VibeTag) ?? undefined,
    verdict: row.verdict ?? undefined,
  };
}
