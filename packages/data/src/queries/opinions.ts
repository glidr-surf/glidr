import type { SupabaseClient } from '@supabase/supabase-js';
import type { Opinion, SubmitOpinionInput } from '../types';
import { imagePublicUrl, fetchAllImagePaths } from './images';

export async function getOpinions(
  client: SupabaseClient,
  options: { boardId?: string; userId?: string; limit?: number }
): Promise<Opinion[]> {
  let query = client
    .from('opinions')
    .select(`
      id, board_id, user_id, text, created_at,
      profiles!inner ( username, height, weight ),
      opinion_scores ( criterion, value ),
      opinion_tags ( tag_type, value ),
      opinion_vote_counts ( upvotes, downvotes )
    `)
    .order('created_at', { ascending: false });

  if (options.boardId) query = query.eq('board_id', options.boardId);
  if (options.userId) query = query.eq('user_id', options.userId);
  if (options.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;

  const rows = data ?? [];
  const imagesByOpinion = await fetchAllImagePaths(client, 'opinion', rows.map((r) => r.id));
  return rows.map((r) => mapOpinion(client, r, imagesByOpinion.get(r.id)));
}

export async function submitOpinion(
  client: SupabaseClient,
  userId: string,
  input: SubmitOpinionInput
): Promise<string> {
  const { data: opinion, error: opinionError } = await client
    .from('opinions')
    .insert({
      board_id: input.boardId,
      user_id: userId,
      text: input.text ?? null,
      wallet_signature: input.walletSignature ?? null,
    })
    .select('id')
    .single();

  if (opinionError) throw opinionError;

  const opinionId = opinion.id;

  const scoreRows = Object.entries(input.scores).map(([criterion, value]) => ({
    opinion_id: opinionId,
    criterion,
    value,
  }));

  const tagRows = Object.entries(input.tags).flatMap(([tagType, values]) =>
    values.map((value) => ({
      opinion_id: opinionId,
      tag_type: tagType,
      value,
    }))
  );

  const promises: Promise<any>[] = [];

  if (scoreRows.length > 0) {
    promises.push(
      Promise.resolve(client.from('opinion_scores').insert(scoreRows)).then(({ error }) => {
        if (error) throw error;
      })
    );
  }

  if (tagRows.length > 0) {
    promises.push(
      Promise.resolve(client.from('opinion_tags').insert(tagRows)).then(({ error }) => {
        if (error) throw error;
      })
    );
  }

  await Promise.all(promises);

  return opinionId;
}

export async function voteOnOpinion(
  client: SupabaseClient,
  userId: string,
  opinionId: string,
  vote: 1 | -1
): Promise<void> {
  const { error } = await client
    .from('opinion_votes')
    .upsert(
      { opinion_id: opinionId, user_id: userId, vote },
      { onConflict: 'opinion_id,user_id' }
    );

  if (error) throw error;
}

export async function deleteOpinion(
  client: SupabaseClient,
  opinionId: string
): Promise<void> {
  const { error } = await client
    .from('opinions')
    .delete()
    .eq('id', opinionId);

  if (error) throw error;
}

function mapOpinion(client: SupabaseClient, row: any, imagePaths?: string[]): Opinion {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  const votes = Array.isArray(row.opinion_vote_counts)
    ? row.opinion_vote_counts[0]
    : row.opinion_vote_counts;

  const scores: Record<string, number> = {};
  for (const s of row.opinion_scores ?? []) {
    scores[s.criterion] = Number(s.value);
  }

  const tags: Record<string, string[]> = {};
  for (const t of row.opinion_tags ?? []) {
    if (!tags[t.tag_type]) tags[t.tag_type] = [];
    tags[t.tag_type].push(t.value);
  }

  return {
    id: row.id,
    boardId: row.board_id,
    userId: row.user_id,
    username: profile?.username ?? '',
    userHeight: profile?.height ?? undefined,
    userWeight: profile?.weight ?? undefined,
    text: row.text ?? undefined,
    scores,
    tags,
    upvotes: votes?.upvotes ?? 0,
    downvotes: votes?.downvotes ?? 0,
    createdAt: row.created_at,
    images: (imagePaths ?? []).map((p) => imagePublicUrl(client, p)),
  };
}
