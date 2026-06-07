import { screen, waitFor } from '@testing-library/react-native';
import { renderApp } from '../support/renderApp';
import { createTestUser, signInSingleton, cleanupUser, type TestUser } from '../support/auth';
import { fetchUserOpinion } from '../support/readback';
import { FLAT_TRACKER } from '../support/fixtures';

let user: TestUser;
beforeEach(async () => {
  user = await createTestUser();
  await signInSingleton(user);
});
afterEach(async () => {
  await cleanupUser(user);
});

describe('rate flow → opinion submit', () => {
  it('submits an opinion and reads it back from the DB', async () => {
    const { user: ue } = renderApp(`/rate-flow?boardId=${FLAT_TRACKER}`);

    // Board loads (rate-flow returns null until then).
    await waitFor(() => expect(screen.getByText('FLAT TRACKER')).toBeTruthy());

    // rating step: pick 4 stars (overall_rating = 4), then NEXT.
    await ue.press(screen.getByTestId('rate-star-4'));
    await ue.press(screen.getByTestId('rate-next'));

    // vibe-check: select the surfaced vibe tag to advance.
    await waitFor(() => expect(screen.getByTestId('rate-next')).toBeTruthy());
    await ue.press(screen.getByTestId('rate-next'));

    // buy-again: tapping a choice advances to confirmation.
    await waitFor(() => expect(screen.getByTestId('buyagain-yes')).toBeTruthy());
    await ue.press(screen.getByTestId('buyagain-yes'));

    // confirmation: finish (skip the deep dive) → submitOpinion + navBack.
    await waitFor(() => expect(screen.getByTestId('rate-finish')).toBeTruthy());
    await ue.press(screen.getByTestId('rate-finish'));

    // Read it back straight from the DB.
    await waitFor(async () => {
      const data = await fetchUserOpinion(FLAT_TRACKER, user.userId);
      expect(data.length).toBe(1);
      const scores = data[0].opinion_scores as { criterion: string; value: number }[];
      const overall = scores.find((s) => s.criterion === 'overall_rating');
      expect(Number(overall!.value)).toBe(4);
      const buyAgain = scores.find((s) => s.criterion === 'buy_again');
      expect(Number(buyAgain!.value)).toBe(1);
    });
  });

  it('walks the deep dive and persists scores + tags + free text', async () => {
    const { user: ue } = renderApp(`/rate-flow?boardId=${FLAT_TRACKER}`);

    await waitFor(() => expect(screen.getByText('FLAT TRACKER')).toBeTruthy());

    // rating → vibe → buy-again → confirmation
    await ue.press(screen.getByTestId('rate-star-4'));
    await ue.press(screen.getByTestId('rate-next'));
    await waitFor(() => expect(screen.getByTestId('rate-next')).toBeTruthy());
    await ue.press(screen.getByTestId('rate-next'));
    await waitFor(() => expect(screen.getByTestId('buyagain-yes')).toBeTruthy());
    await ue.press(screen.getByTestId('buyagain-yes'));

    // confirmation: take the deep dive instead of finishing.
    await waitFor(() => expect(screen.getByTestId('rate-deepdive')).toBeTruthy());
    await ue.press(screen.getByTestId('rate-deepdive'));

    // ride: speed = 7 (score `speed`), then NEXT.
    await waitFor(() => expect(screen.getByTestId('ride-speed-7')).toBeTruthy());
    await ue.press(screen.getByTestId('ride-speed-7'));
    await ue.press(screen.getByTestId('rate-next'));

    // conditions: wave size HEAD HIGH (tag `wave_size`), then NEXT.
    await waitFor(() => expect(screen.getByTestId('conditions-wave-HEAD HIGH')).toBeTruthy());
    await ue.press(screen.getByTestId('conditions-wave-HEAD HIGH'));
    await ue.press(screen.getByTestId('rate-next'));

    // nitty-gritty: quiver role DAILY DRIVER + fin TWIN (tags `quiver_role`, `fin_setup`), then NEXT.
    await waitFor(() => expect(screen.getByTestId('nitty-fin-TWIN')).toBeTruthy());
    await ue.press(screen.getByTestId('nitty-role-DAILY DRIVER'));
    await ue.press(screen.getByTestId('nitty-fin-TWIN'));
    await ue.press(screen.getByTestId('rate-next'));

    // dimensions: skip through (no selection needed for this assertion), then NEXT.
    await waitFor(() => expect(screen.getByTestId('rate-next')).toBeTruthy());
    await ue.press(screen.getByTestId('rate-next'));

    // free-text: write something (opinion.text), then SEND IT (finishDeepDive).
    await waitFor(() => expect(screen.getByTestId('rate-freetext-input')).toBeTruthy());
    await ue.type(screen.getByTestId('rate-freetext-input'), 'Flew on the open face, twitchy off the top.');
    await ue.press(screen.getByTestId('rate-next'));

    // back on confirmation with deepDiveDone → POST IT submits.
    await waitFor(() => expect(screen.getByTestId('rate-finish')).toBeTruthy());
    await ue.press(screen.getByTestId('rate-finish'));

    // Read it back: deep-dive scores + tags + free text all persisted.
    await waitFor(async () => {
      const data = await fetchUserOpinion(FLAT_TRACKER, user.userId);
      expect(data.length).toBe(1);
      const op = data[0];
      expect(op.text).toBe('Flew on the open face, twitchy off the top.');

      const scores = op.opinion_scores as { criterion: string; value: number }[];
      const speed = scores.find((s) => s.criterion === 'speed');
      expect(Number(speed!.value)).toBe(7);

      const tags = op.opinion_tags as { tag_type: string; value: string }[];
      expect(tags.find((t) => t.tag_type === 'wave_size')?.value).toBe('HEAD HIGH');
      expect(tags.find((t) => t.tag_type === 'quiver_role')?.value).toBe('DAILY DRIVER');
      expect(tags.find((t) => t.tag_type === 'fin_setup')?.value).toBe('TWIN');
    });
  }, 60000);

  it('surfaces the submitted opinion on the board detail screen', async () => {
    // Single mount, real journey: board detail → RATE THIS BOARD → rate flow →
    // finish → navBack to the board, which refetches on focus (dirty flag) and
    // renders the new opinion. (Two renderApp mounts in one test leak expo-router
    // store state between them, so we drive it through one router tree.)
    const { user: ue } = renderApp(`/board/${FLAT_TRACKER}`);
    await waitFor(() => expect(screen.getByText('FLAT TRACKER')).toBeTruthy());
    await waitFor(() => expect(screen.getByText('RATE THIS BOARD')).toBeTruthy());
    await ue.press(screen.getByText('RATE THIS BOARD'));

    // rate flow
    await waitFor(() => expect(screen.getByTestId('rate-star-4')).toBeTruthy());
    await ue.press(screen.getByTestId('rate-star-4'));
    await ue.press(screen.getByTestId('rate-next'));
    await waitFor(() => expect(screen.getByTestId('rate-next')).toBeTruthy());
    await ue.press(screen.getByTestId('rate-next'));
    await waitFor(() => expect(screen.getByTestId('buyagain-yes')).toBeTruthy());
    await ue.press(screen.getByTestId('buyagain-yes'));
    await waitFor(() => expect(screen.getByTestId('rate-finish')).toBeTruthy());
    await ue.press(screen.getByTestId('rate-finish'));

    // Back on the board screen, the freshly-posted opinion renders under the
    // author's username.
    await waitFor(() => expect(screen.getByText(user.username)).toBeTruthy());
  });
});
