import { screen, waitFor } from '@testing-library/react-native';
import { renderApp } from '../support/renderApp';
import { createTestUser, signInSingleton, cleanupUser, type TestUser } from '../support/auth';
import { serviceClient } from '../support/db';

// add-board.tsx is wired to the real data layer (submitShaper + submitBoard). Since
// migration 00006 + submit*() inserting status='approved', a normal authenticated
// user can add a board with no admin approval: the inserted row is immediately
// readable (select policy "approved or is_admin"), so the .select().single()
// read-back succeeds and the screen navigates to the new board. This journey drives
// the real 3-step wizard and asserts the board + shaper actually persisted.

let user: TestUser;
const suffix = Date.now().toString(36);
const shaperName = `E2Es${suffix}`;
const modelName = `E2Em${suffix}`;

beforeEach(async () => {
  user = await createTestUser();
  await signInSingleton(user);
});

afterEach(async () => {
  // Both rows are created on the happy path; RLS forbids user delete (admin only),
  // so clean up via the service client. Delete the board first (FK → shaper).
  const admin = serviceClient();
  await admin.from('boards').delete().eq('name', modelName);
  await admin.from('shapers').delete().eq('name', shaperName);
  await cleanupUser(user);
});

describe('add board', () => {
  it('walks the 3-step wizard and persists a public board', async () => {
    const { user: ue } = renderApp('/add-board');

    // Step 1 — basics. NEXT only advances once both shaper + model are filled.
    await waitFor(() => expect(screen.getByText('THE BASICS')).toBeTruthy());
    await ue.type(screen.getByPlaceholderText('e.g. Christenson'), shaperName);
    await ue.type(screen.getByPlaceholderText('e.g. Flat Tracker'), modelName);
    await ue.press(screen.getByText('NEXT'));

    // Step 2 — board type. Advances only after a type is picked.
    await waitFor(() => expect(screen.getByText('WHAT KIND OF BOARD?')).toBeTruthy());
    await ue.press(screen.getByText('FISH'));
    await ue.press(screen.getByText('NEXT'));

    // Step 3 — dimensions optional; submit.
    await waitFor(() => expect(screen.getByText('DIMENSIONS')).toBeTruthy());
    await ue.press(screen.getByText('ADD BOARD'));

    // Persistence: the board + its shaper land as `approved` (publicly visible).
    await waitFor(async () => {
      const { data: boards } = await serviceClient()
        .from('boards')
        .select('id, name, type, status, shapers(name, status)')
        .eq('name', modelName);
      expect(boards?.length).toBe(1);
      expect(boards![0].status).toBe('approved');
      expect(boards![0].type).toBe('FISH');
      const shaper = Array.isArray(boards![0].shapers) ? boards![0].shapers[0] : boards![0].shapers;
      expect(shaper.name).toBe(shaperName);
      expect(shaper.status).toBe('approved');
    });
  }, 60000); // heaviest journey: 3-step wizard + per-char typing
});
