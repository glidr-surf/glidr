import type { SupabaseClient } from '@supabase/supabase-js';
import type { User } from '../types';

export async function getProfile(
  client: SupabaseClient,
  userId: string
): Promise<User | null> {
  const { data, error } = await client
    .from('profiles')
    .select(`
      id, username, height, weight, created_at,
      profile_stats ( opinion_count, magic_board_count, followers_count, following_count )
    `)
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  const stats = Array.isArray(data.profile_stats) ? data.profile_stats[0] : data.profile_stats;
  return {
    id: data.id,
    username: data.username,
    height: data.height ?? undefined,
    weight: data.weight ?? undefined,
    createdAt: data.created_at,
    opinionCount: stats?.opinion_count ?? 0,
    magicBoardCount: stats?.magic_board_count ?? 0,
    followersCount: stats?.followers_count ?? 0,
    followingCount: stats?.following_count ?? 0,
  };
}

export async function updateProfile(
  client: SupabaseClient,
  userId: string,
  updates: { username?: string; height?: string; weight?: string }
): Promise<void> {
  const { error } = await client
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
}
