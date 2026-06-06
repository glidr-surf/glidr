import { describe, it, expect, afterAll } from 'vitest';
import { getBoards } from '../src/queries/boards';
import { imagePublicUrl } from '../src/queries/images';
import { anonClient, serviceClient } from './helpers';

const FLAT_TRACKER = '20000000-0000-0000-0000-000000000001';

describe('imagePublicUrl', () => {
  it('builds a public URL for a storage path', () => {
    const url = imagePublicUrl(anonClient(), 'board/x/primary.jpg');
    expect(url).toContain('/storage/v1/object/public/images/board/x/primary.jpg');
  });
});

describe('getBoards image attach', () => {
  const svc = serviceClient();
  afterAll(async () => {
    await svc.from('images').delete().eq('owner_id', FLAT_TRACKER).eq('owner_type', 'board');
  });

  it('populates Board.imageUrl from the images table', async () => {
    await svc.from('images').delete().eq('owner_id', FLAT_TRACKER).eq('owner_type', 'board');
    const ins = await svc.from('images').insert({
      owner_type: 'board', owner_id: FLAT_TRACKER,
      path: `board/${FLAT_TRACKER}/primary.jpg`, position: 0,
    });
    expect(ins.error).toBeNull();
    const boards = await getBoards(anonClient());
    const ft = boards.find((b) => b.id === FLAT_TRACKER);
    expect(ft?.imageUrl).toContain(`images/board/${FLAT_TRACKER}/primary.jpg`);
  });
});
