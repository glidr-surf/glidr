import { describe, it, expect } from 'vitest';
import { createProfile, isUsernameAvailable, getProfile } from '../src/queries/profiles';
import { createTestUser, serviceClient } from './helpers';

describe('createProfile', () => {
  it('creates a profile and a supabase identity row for the signed-in user', async () => {
    const { userId, client } = await createTestUser();

    const user = await createProfile(client, { id: userId, username: `surfer_${userId.slice(0, 8)}` });
    expect(user.id).toBe(userId);

    const profile = await getProfile(client, userId);
    expect(profile?.username).toBe(user.username);

    const { data: identities } = await serviceClient()
      .from('user_identities')
      .select('provider, subject, profile_id')
      .eq('profile_id', userId);
    expect(identities).toEqual([{ provider: 'supabase', subject: userId, profile_id: userId }]);
  });

  it('rejects creating a profile for a different user id (RLS)', async () => {
    const { client } = await createTestUser();
    const other = await createTestUser();

    await expect(
      createProfile(client, { id: other.userId, username: `evil_${Date.now()}` }),
    ).rejects.toThrow();
  });

  it('rejects a duplicate username', async () => {
    const a = await createTestUser();
    const b = await createTestUser();
    const name = `dup_${Date.now()}`;

    await createProfile(a.client, { id: a.userId, username: name });
    await expect(createProfile(b.client, { id: b.userId, username: name })).rejects.toThrow();
  });
});

describe('isUsernameAvailable', () => {
  it('returns false for a taken name and true for a free one', async () => {
    const { userId, client } = await createTestUser();
    const name = `taken_${Date.now()}`;
    await createProfile(client, { id: userId, username: name });

    expect(await isUsernameAvailable(client, name)).toBe(false);
    expect(await isUsernameAvailable(client, `free_${Date.now()}`)).toBe(true);
  });
});
