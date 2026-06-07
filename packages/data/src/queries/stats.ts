import type { SupabaseClient } from '@supabase/supabase-js';

export interface LandingStats {
  totalOpinions: number;
  totalShapers: number;
  magicBoards: number;
}

export async function getLandingStats(client: SupabaseClient): Promise<LandingStats> {
  const { data, error } = await client.rpc('landing_stats').single<{
    total_opinions: number;
    total_shapers: number;
    magic_boards: number;
  }>();

  if (error || !data) {
    return { totalOpinions: 0, totalShapers: 0, magicBoards: 0 };
  }

  return {
    totalOpinions: data.total_opinions ?? 0,
    totalShapers: data.total_shapers ?? 0,
    magicBoards: data.magic_boards ?? 0,
  };
}
