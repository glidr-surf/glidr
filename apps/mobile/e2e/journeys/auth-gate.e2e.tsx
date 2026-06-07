import { screen, waitFor } from '@testing-library/react-native';
import { renderApp } from '../support/renderApp';
import { supabase } from '../../src/lib/supabase';
import { FLAT_TRACKER } from '../support/fixtures';

// Logged-out journey. The supabase singleton is shared across tests in a worker,
// so a prior signed-in test could leak its session in — sign out first so the
// AuthProvider mounts with user === null and requireAuth funnels to the modal.
beforeEach(async () => {
  await supabase.auth.signOut();
});

describe('auth gate', () => {
  it('opens the auth modal when a logged-out user taps a protected action', async () => {
    const { user } = renderApp(`/board/${FLAT_TRACKER}`);

    // Board loads; "RATE THIS BOARD" is wrapped in requireAuth (board/[id].tsx).
    await waitFor(() => expect(screen.getByText('RATE THIS BOARD')).toBeTruthy());
    await user.press(screen.getByText('RATE THIS BOARD'));

    // No session → requireAuth shows the AuthModal instead of pushing rate-flow.
    // Assert on the modal's real visible copy.
    await waitFor(() => expect(screen.getByText('JOIN THE LINEUP')).toBeTruthy());
    expect(screen.getByText(/drop your email/i)).toBeTruthy();
  });
});
