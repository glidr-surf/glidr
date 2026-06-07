import { screen, waitFor } from '@testing-library/react-native';
import { getBoard } from '@glidr/data';
import { renderApp } from '../support/renderApp';
import { createTestUser, signInSingleton, cleanupUser, type TestUser } from '../support/auth';
import { serviceClient, anonClient } from '../support/db';

// pickImage() wraps native expo-image-picker + expo-image-manipulator and does
// fetch(file://).blob() — none run in jest. Mock that thin native wrapper to return
// a real in-memory JPEG Blob; everything downstream stays real: ImageField → onPicked
// → uploadImage → real local Supabase storage + images table → Board.imageUrl read-back.
jest.mock('../../src/lib/pickImage', () => ({
  pickImage: jest.fn(async () => ({
    uri: 'file:///fixture.jpg',
    // 8 bytes starting with the JPEG SOI/APP0 marker — enough to be a real upload.
    blob: new Blob([new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46])], { type: 'image/jpeg' }),
    ext: 'jpg',
    contentType: 'image/jpeg',
  })),
}));

let user: TestUser;
const suffix = Date.now().toString(36);
const shaperName = `E2Eps${suffix}`;
const modelName = `E2Epm${suffix}`;

async function findBoardId(): Promise<string | null> {
  const { data } = await serviceClient().from('boards').select('id').eq('name', modelName).maybeSingle();
  return data?.id ?? null;
}

beforeEach(async () => {
  user = await createTestUser();
  await signInSingleton(user);
});

afterEach(async () => {
  const admin = serviceClient();
  const boardId = await findBoardId();
  if (boardId) {
    // Remove storage objects for this board, then the images rows, then the board.
    const { data: objs } = await admin.storage.from('images').list(`board/${boardId}`);
    if (objs?.length) {
      await admin.storage.from('images').remove(objs.map((o) => `board/${boardId}/${o.name}`));
    }
    await admin.from('images').delete().eq('owner_type', 'board').eq('owner_id', boardId);
    await admin.from('boards').delete().eq('id', boardId);
  }
  await admin.from('shapers').delete().eq('name', shaperName);
  await cleanupUser(user);
});

describe('add board with photo', () => {
  it('uploads the picked photo and exposes it as Board.imageUrl', async () => {
    const { user: ue } = renderApp('/add-board');

    // Step 1 — pick a photo, then fill shaper + model.
    await waitFor(() => expect(screen.getByText('THE BASICS')).toBeTruthy());
    await ue.press(screen.getByTestId('add-board-photo'));
    // ImageField.onPress is async (await pickImage → setPhoto); userEvent.press resolves
    // at the first await, so wait for the picked state to commit (the "ADD PHOTO" label
    // is replaced by the preview image) before moving on — otherwise photo is still null
    // in onSubmit's closure and the upload is skipped.
    await waitFor(() => expect(screen.queryByText('ADD PHOTO')).toBeNull());
    await ue.type(screen.getByPlaceholderText('e.g. Christenson'), shaperName);
    await ue.type(screen.getByPlaceholderText('e.g. Flat Tracker'), modelName);
    await ue.press(screen.getByText('NEXT'));

    // Step 2 — type.
    await waitFor(() => expect(screen.getByText('WHAT KIND OF BOARD?')).toBeTruthy());
    await ue.press(screen.getByText('FISH'));
    await ue.press(screen.getByText('NEXT'));

    // Step 3 — submit.
    await waitFor(() => expect(screen.getByText('DIMENSIONS')).toBeTruthy());
    await ue.press(screen.getByText('ADD BOARD'));

    // onSubmit awaits submitBoard + uploadImage BEFORE router.replace('/board/<id>'),
    // so the new board's detail screen rendering its name is proof the upload finished.
    // Wait on that UI signal (RNTL flushes the app's own async) rather than polling the
    // DB concurrently — a poll loop here starves the event loop and stalls the upload.
    await screen.findByText(modelName, {}, { timeout: 45000 });

    // Upload is now complete; assert persistence + read-back directly (no polling).
    const boardId = await findBoardId();
    expect(boardId).toBeTruthy();

    const { data: img } = await serviceClient()
      .from('images')
      .select('owner_type, owner_id, path, uploaded_by')
      .eq('owner_type', 'board').eq('owner_id', boardId!).single();
    expect(img!.uploaded_by).toBe(user.userId);
    expect(img!.path).toContain(`board/${boardId}/`);

    const { data: objs } = await serviceClient().storage.from('images').list(`board/${boardId}`);
    expect(objs?.length).toBe(1);

    const board = await getBoard(anonClient(), boardId!);
    expect(board?.imageUrl).toBeTruthy();
  }, 90000);
});
