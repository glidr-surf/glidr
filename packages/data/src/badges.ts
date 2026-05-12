import type { SupabaseClient } from '@supabase/supabase-js';
import type { Badge, BadgeId } from './types';

interface BadgeDef {
  id: BadgeId;
  name: string;
  description: string;
  howToEarn: string;
  icon: string;
  target: number;
  getProgress: (client: SupabaseClient, userId: string) => Promise<number>;
}

const BADGE_DEFS: BadgeDef[] = [
  {
    id: 'kooks-getting-started',
    name: "Kook's Getting Started",
    description: 'Submitted your first opinion.',
    howToEarn: 'Submit one opinion on any board.',
    icon: '\u{1F919}',
    target: 1,
    getProgress: async (client, userId) => {
      const { count } = await client.from('opinions').select('id', { count: 'exact', head: true }).eq('user_id', userId);
      return count ?? 0;
    },
  },
  {
    id: 'wannabe-corelord',
    name: 'Wannabe Corelord',
    description: 'Submitted 10 opinions.',
    howToEarn: 'Submit 10 opinions.',
    icon: '\u{1F918}',
    target: 10,
    getProgress: async (client, userId) => {
      const { count } = await client.from('opinions').select('id', { count: 'exact', head: true }).eq('user_id', userId);
      return count ?? 0;
    },
  },
  {
    id: 'wordsmith',
    name: 'Wordsmith',
    description: 'Wrote an opinion longer than 100 words.',
    howToEarn: 'Submit an opinion with at least 100 words of text.',
    icon: '\u{270D}\u{FE0F}',
    target: 1,
    getProgress: async (client, userId) => {
      const { data } = await client.from('opinions').select('text').eq('user_id', userId).not('text', 'is', null);
      const count = (data ?? []).filter((o) => (o.text?.split(/\s+/).length ?? 0) >= 100).length;
      return count;
    },
  },
  {
    id: 'serial-enabler',
    name: 'Serial Enabler',
    description: 'Your opinions have earned 50 upvotes in total.',
    howToEarn: 'Accumulate 50 upvotes across all your opinions.',
    icon: '\u{1F446}',
    target: 50,
    getProgress: async (client, userId) => {
      const { data } = await client
        .from('opinions')
        .select('opinion_vote_counts ( upvotes )')
        .eq('user_id', userId);
      let total = 0;
      for (const row of data ?? []) {
        const vc = Array.isArray(row.opinion_vote_counts) ? row.opinion_vote_counts[0] : row.opinion_vote_counts;
        total += vc?.upvotes ?? 0;
      }
      return total;
    },
  },
  {
    id: 'hot-take-merchant',
    name: 'Hot Take Merchant',
    description: 'Had 3 opinions reach the top of a board page.',
    howToEarn: 'Get 3 opinions voted to the top of their board page.',
    icon: '\u{1F336}\u{FE0F}',
    target: 3,
    getProgress: async () => 0,
  },
];

export async function computeBadges(
  client: SupabaseClient,
  userId: string
): Promise<Badge[]> {
  const results = await Promise.all(
    BADGE_DEFS.map(async (def) => {
      const progress = await def.getProgress(client, userId);
      return {
        id: def.id,
        name: def.name,
        description: def.description,
        howToEarn: def.howToEarn,
        icon: def.icon,
        earned: progress >= def.target,
        progress: progress < def.target ? progress : undefined,
        target: progress < def.target ? def.target : undefined,
      };
    })
  );
  return results;
}
