import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = () => process.env.TEST_SUPABASE_URL!;
const anon = () => process.env.TEST_SUPABASE_ANON_KEY!;
const service = () => process.env.TEST_SUPABASE_SERVICE_ROLE_KEY!;

export function serviceClient(): SupabaseClient {
  return createClient(url(), service(), { auth: { persistSession: false } });
}

export function anonClient(): SupabaseClient {
  return createClient(url(), anon(), { auth: { persistSession: false } });
}

export interface TestUser {
  userId: string;
  client: SupabaseClient;
}

let counter = 0;

export async function createTestUser(): Promise<TestUser> {
  const admin = serviceClient();
  const email = `test-${Date.now()}-${counter++}@example.com`;
  const password = 'test-password-123';

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;
  const userId = data.user!.id;

  const client = createClient(url(), anon(), { auth: { persistSession: false } });
  const { error: signInErr } = await client.auth.signInWithPassword({ email, password });
  if (signInErr) throw signInErr;

  return { userId, client };
}

export async function deleteProfile(profileId: string): Promise<void> {
  await serviceClient().from('profiles').delete().eq('id', profileId);
}
