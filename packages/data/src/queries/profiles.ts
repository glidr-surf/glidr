import type { SupabaseClient } from '@supabase/supabase-js';
import type { CreateProfileInput, User } from '../types';
import { imagePublicUrl, fetchPrimaryImagePaths } from './images';

export async function getProfile(
  client: SupabaseClient,
  userId: string
): Promise<User | null> {
  const { data, error } = await client
    .from('profiles')
    .select('id, username, height, weight, created_at')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  const { data: stats, error: statsError } = await client
    .from('profile_stats')
    .select('opinion_count, magic_board_count, followers_count, following_count')
    .eq('user_id', userId)
    .maybeSingle();

  if (statsError) throw statsError;

  const avatarPath = (await fetchPrimaryImagePaths(client, 'profile', [userId])).get(userId);

  return {
    id: data.id,
    username: data.username,
    height: data.height ?? undefined,
    weight: data.weight ?? undefined,
    createdAt: data.created_at,
    avatarUrl: avatarPath ? imagePublicUrl(client, avatarPath) : undefined,
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

export async function isUsernameAvailable(
  client: SupabaseClient,
  username: string,
): Promise<boolean> {
  const { data, error } = await client
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (error) throw error;
  return data === null;
}

export async function createProfile(
  client: SupabaseClient,
  input: CreateProfileInput,
): Promise<User> {
  const { error: profileErr } = await client.from('profiles').insert({
    id: input.id,
    username: input.username,
    height: input.height ?? null,
    weight: input.weight ?? null,
  });
  if (profileErr) throw profileErr;

  const { error: identityErr } = await client.from('user_identities').insert({
    provider: 'supabase',
    subject: input.id,
    profile_id: input.id,
  });
  if (identityErr) throw identityErr;

  const user = await getProfile(client, input.id);
  if (!user) throw new Error('Profile creation succeeded but profile could not be read back');
  return user;
}
