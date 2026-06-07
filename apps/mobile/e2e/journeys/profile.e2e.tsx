import { screen, waitFor } from '@testing-library/react-native';
import { renderApp } from '../support/renderApp';
import { createTestUser, signInSingleton, cleanupUser, type TestUser } from '../support/auth';

let user: TestUser;
beforeEach(async () => {
  user = await createTestUser();
  await signInSingleton(user);
});
afterEach(async () => {
  await cleanupUser(user);
});

describe('profile', () => {
  it('profile tab shows the signed-in username', async () => {
    const { user: ue } = renderApp('/');

    await waitFor(() => expect(screen.getByTestId('tab-profile')).toBeTruthy());
    await ue.press(screen.getByTestId('tab-profile'));

    // ProfileScreen renders the authed header with the username uppercased
    // (user.username.toUpperCase()). A logged-out user would see "WHO ARE YOU?".
    await waitFor(() => expect(screen.getByText(user.username.toUpperCase())).toBeTruthy());
    // Real authed-only marker: the stat blocks ("BOARDS" / "MAGIC BOARDS") only
    // render in the signed-in branch, proving we're not on the signed-out screen.
    expect(screen.getByText('MAGIC BOARDS')).toBeTruthy();
  });
});
