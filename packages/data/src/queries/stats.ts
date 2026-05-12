import type { SupabaseClient } from '@supabase/supabase-js';

export interface LandingStats {
  totalOpinions: number;
  totalShapers: number;
  magicBoards: number;
}

export async function getLandingStats(client: SupabaseClient): Promise<LandingStats> {
  const [opinionsRes, shapersRes, magicRes] = await Promise.all([
    client.from('opinions').select('id', { count: 'exact', head: true }),
    client.from('shapers').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
    client.from('board_stats').select('board_id', { count: 'exact', head: true }).eq('avg_rating', 5),
  ]);

  return {
    totalOpinions: opinionsRes.count ?? 0,
    totalShapers: shapersRes.count ?? 0,
    magicBoards: magicRes.count ?? 0,
  };
}
