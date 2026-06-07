import { serviceClient } from './db';
import { supabase } from '../../src/lib/supabase';

export interface TestUser {
  userId: string;
  email: string;
  username: string;
}

const PASSWORD = 'e2e-password-123';
let n = 0;

// Create an ephemeral auth user + matching profile row. `profiles.id` has no
// default and `username` is unique/not-null (see 00001_initial_schema.sql), so
// we supply both. The short, prefixed username keeps reruns collision-free.
export async function createTestUser(): Promise<TestUser> {
  const admin = serviceClient();
  const email = `e2e-${Date.now()}-${n++}@example.com`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
  });
  if (error) throw error;
  const userId = data.user!.id;
  const username = `E2E_${userId.slice(0, 6)}`;
  const { error: pErr } = await admin.from('profiles').insert({ id: userId, username });
  if (pErr) throw pErr;
  return { userId, email, username };
}

// Sign the app's supabase singleton in so the AuthProvider restores the session
// on mount and exposes the profile as `user`.
export async function signInSingleton(user: TestUser): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email: user.email, password: PASSWORD });
  if (error) throw error;
}

// Tear down in FK-safe order: opinions.user_id and opinion_votes.user_id
// reference profiles(id) WITHOUT on-delete-cascade (00001_initial_schema.sql),
// so the profile delete would fail while those rows exist. Deleting opinions
// cascades to opinion_scores/opinion_tags.
export async function cleanupUser(user: TestUser): Promise<void> {
  await supabase.auth.signOut();
  const admin = serviceClient();
  await admin.from('opinion_votes').delete().eq('user_id', user.userId);
  await admin.from('opinions').delete().eq('user_id', user.userId);
  await admin.from('profiles').delete().eq('id', user.userId);
  await admin.auth.admin.deleteUser(user.userId).catch(() => {});
}
