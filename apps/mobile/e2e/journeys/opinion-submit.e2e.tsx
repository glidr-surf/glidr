import { screen, waitFor } from '@testing-library/react-native';
import { renderApp } from '../support/renderApp';
import { createTestUser, signInSingleton, cleanupUser, type TestUser } from '../support/auth';
import { serviceClient } from '../support/db';
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
      const { data } = await serviceClient()
        .from('opinions')
        .select('id, opinion_scores(criterion, value)')
        .eq('board_id', FLAT_TRACKER)
        .eq('user_id', user.userId);
      expect(data?.length).toBe(1);
      const scores = data![0].opinion_scores as { criterion: string; value: number }[];
      const overall = scores.find((s) => s.criterion === 'overall_rating');
      expect(Number(overall!.value)).toBe(4);
      const buyAgain = scores.find((s) => s.criterion === 'buy_again');
      expect(Number(buyAgain!.value)).toBe(1);
    });
  });

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
