import type { SupabaseClient } from '@supabase/supabase-js';
import { getProfile } from './queries/profiles';
import { getOpinions } from './queries/opinions';
import { getFollowers, getFollowing } from './queries/follows';

export interface UserDataExport {
  exportedAt: string;
  profile: Awaited<ReturnType<typeof getProfile>>;
  opinions: Awaited<ReturnType<typeof getOpinions>>;
  followers: string[];
  following: string[];
}

export async function exportUserData(
  client: SupabaseClient,
  userId: string
): Promise<UserDataExport> {
  const [profile, opinions, followers, following] = await Promise.all([
    getProfile(client, userId),
    getOpinions(client, { userId }),
    getFollowers(client, userId),
    getFollowing(client, userId),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    profile,
    opinions,
    followers,
    following,
  };
}
