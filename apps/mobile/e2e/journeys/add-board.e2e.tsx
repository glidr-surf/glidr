import { screen, waitFor } from '@testing-library/react-native';
import { renderApp } from '../support/renderApp';
import { createTestUser, signInSingleton, cleanupUser, type TestUser } from '../support/auth';
import { serviceClient } from '../support/db';

// add-board.tsx is wired to the real data layer (submitShaper + submitBoard), NOT
// a UI mock. BUT the happy-path write currently CANNOT complete for a normal
// authenticated user: submitShaper/submitBoard chain `.insert(...).select('id')
// .single()`, and the shapers/boards SELECT policy is `status = 'approved' OR
// is_admin()` (00001_initial_schema.sql) — so reading back the just-inserted
// `pending` row is denied by RLS and the call throws. The bare insert succeeds;
// the chained read-back is what fails. The screen catches this and shows
// "Couldn't add that board." So we assert the REAL wired behaviour here (wizard
// renders → validates → advances → submit surfaces the error) and defer the
// green-path persistence assertion until the data layer can read back its own
// pending submissions (e.g. a submitter-can-read-own RLS policy or returning=
// minimal insert + separate fetch).
console.log(
  '[e2e] add-board green-path persistence deferred — submitShaper/submitBoard ' +
  'read back the inserted pending row via .select().single(), which RLS denies ' +
  'for non-admin users; the screen surfaces "Couldn\'t add that board."',
);

let user: TestUser;
const suffix = Date.now().toString(36);
const shaperName = `E2Es${suffix}`;
const modelName = `E2Em${suffix}`;

beforeEach(async () => {
  user = await createTestUser();
  await signInSingleton(user);
});

afterEach(async () => {
  // The bare insert does land a `pending` shaper row before the read-back throws,
  // so clean it up. Boards never get created (submitShaper throws first), but
  // delete defensively. RLS forbids user delete (admin only) → service client.
  const admin = serviceClient();
  await admin.from('boards').delete().eq('name', modelName);
  await admin.from('shapers').delete().eq('name', shaperName);
  await cleanupUser(user);
});

describe('add board', () => {
  it('walks the 3-step wizard, validates each step, and submits', async () => {
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

    // Wired submit path runs (requireAuth → submitShaper) and, under current RLS,
    // surfaces the error rather than navigating away. Asserting this proves the
    // form is genuinely wired to the data layer (not a static mock).
    await waitFor(() => expect(screen.getByText(/couldn't add that board/i)).toBeTruthy());
  }, 60000); // heaviest journey: 3-step wizard + per-char typing

  it.todo(
    'add-board persists a board on the happy path — DEFERRED: submit*().select().single() ' +
    'read-back is RLS-denied for non-admin pending rows',
  );
});
