import { screen, waitFor } from '@testing-library/react-native';
import { renderApp } from '../support/renderApp';
import { createTestUser, signInSingleton, cleanupUser, type TestUser } from '../support/auth';
import { serviceClient } from '../support/db';
import { VOTE_BOARD, VOTE_OPINION } from '../support/fixtures';

let user: TestUser;
beforeEach(async () => {
  user = await createTestUser();
  await signInSingleton(user);
});
afterEach(async () => {
  await cleanupUser(user);
});

describe('board detail → opinion vote', () => {
  it('upvotes an opinion and persists vote=1 with correct arg order', async () => {
    const { user: ue } = renderApp(`/board/${VOTE_BOARD}`);

    // The seeded opinion renders on the board's detail screen (default RECENT sort).
    await waitFor(() =>
      expect(screen.getByTestId(`opinion-${VOTE_OPINION}-upvote`)).toBeTruthy(),
    );

    await ue.press(screen.getByTestId(`opinion-${VOTE_OPINION}-upvote`));

    // voteOnOpinion(supabase, userId, opinionId, vote) upserts into opinion_votes.
    // The user_id === user.userId check is the key guard: it proves userId went to
    // user_id and opinionId went to opinion_id — the exact arg order that regressed.
    await waitFor(async () => {
      const { data } = await serviceClient()
        .from('opinion_votes')
        .select('vote, user_id, opinion_id')
        .eq('opinion_id', VOTE_OPINION)
        .eq('user_id', user.userId)
        .single();
      expect(data?.vote).toBe(1);
      expect(data?.user_id).toBe(user.userId);
      expect(data?.opinion_id).toBe(VOTE_OPINION);
    });
  });

  it('downvotes an opinion and persists vote=-1', async () => {
    const { user: ue } = renderApp(`/board/${VOTE_BOARD}`);

    await waitFor(() =>
      expect(screen.getByTestId(`opinion-${VOTE_OPINION}-downvote`)).toBeTruthy(),
    );

    await ue.press(screen.getByTestId(`opinion-${VOTE_OPINION}-downvote`));

    await waitFor(async () => {
      const { data } = await serviceClient()
        .from('opinion_votes')
        .select('vote, user_id, opinion_id')
        .eq('opinion_id', VOTE_OPINION)
        .eq('user_id', user.userId)
        .single();
      expect(data?.vote).toBe(-1);
      expect(data?.user_id).toBe(user.userId);
      expect(data?.opinion_id).toBe(VOTE_OPINION);
    });
  });
});
