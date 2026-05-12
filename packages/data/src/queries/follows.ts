import type { SupabaseClient } from '@supabase/supabase-js';

export async function follow(
  client: SupabaseClient,
  followerId: string,
  followingId: string
): Promise<void> {
  const { error } = await client
    .from('follows')
    .insert({ follower_id: followerId, following_id: followingId });

  if (error) throw error;
}

export async function unfollow(
  client: SupabaseClient,
  followerId: string,
  followingId: string
): Promise<void> {
  const { error } = await client
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId);

  if (error) throw error;
}

export async function getFollowers(
  client: SupabaseClient,
  userId: string
): Promise<string[]> {
  const { data, error } = await client
    .from('follows')
    .select('follower_id')
    .eq('following_id', userId);

  if (error) throw error;
  return (data ?? []).map((r) => r.follower_id);
}

export async function getFollowing(
  client: SupabaseClient,
  userId: string
): Promise<string[]> {
  const { data, error } = await client
    .from('follows')
    .select('following_id')
    .eq('follower_id', userId);

  if (error) throw error;
  return (data ?? []).map((r) => r.following_id);
}
