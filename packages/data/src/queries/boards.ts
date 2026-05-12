import type { SupabaseClient } from '@supabase/supabase-js';
import type { Board, BoardType, VibeTag, SubmitBoardInput } from '../types';

export async function getBoards(
  client: SupabaseClient,
  options?: { type?: BoardType; limit?: number }
): Promise<Board[]> {
  let query = client
    .from('boards')
    .select(`
      id, name, shaper_id, type, image_url, length, width, thickness, volume, verdict,
      shapers!inner ( name ),
      board_stats ( avg_rating, opinion_count, buy_again_percent, top_vibe_tag )
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

  return (data ?? []).map(mapBoard);
}

export async function getBoard(
  client: SupabaseClient,
  boardId: string
): Promise<Board | null> {
  const { data, error } = await client
    .from('boards')
    .select(`
      id, name, shaper_id, type, image_url, length, width, thickness, volume, verdict,
      shapers!inner ( name ),
      board_stats ( avg_rating, opinion_count, buy_again_percent, top_vibe_tag )
    `)
    .eq('id', boardId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return mapBoard(data);
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
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

function mapBoard(row: any): Board {
  const stats = Array.isArray(row.board_stats) ? row.board_stats[0] : row.board_stats;
  const shaper = Array.isArray(row.shapers) ? row.shapers[0] : row.shapers;

  return {
    id: row.id,
    name: row.name,
    shaper: shaper?.name ?? '',
    shaperId: row.shaper_id,
    type: row.type as BoardType,
    imageUrl: row.image_url ?? undefined,
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
