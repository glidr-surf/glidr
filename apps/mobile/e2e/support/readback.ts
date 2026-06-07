import { serviceClient } from './db';

// Read back the opinion a user submitted for a board (with its scores + tags), for DB assertions.
export async function fetchUserOpinion(boardId: string, userId: string) {
  const { data } = await serviceClient()
    .from('opinions')
    .select('id, text, opinion_scores(criterion, value), opinion_tags(tag_type, value)')
    .eq('board_id', boardId)
    .eq('user_id', userId);
  return data ?? [];
}

// Read back a user's vote on an opinion.
export async function fetchUserVote(opinionId: string, userId: string) {
  const { data } = await serviceClient()
    .from('opinion_votes')
    .select('vote, user_id, opinion_id')
    .eq('opinion_id', opinionId)
    .eq('user_id', userId)
    .maybeSingle();
  return data;
}
