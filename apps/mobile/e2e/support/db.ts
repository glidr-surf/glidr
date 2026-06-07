import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = () => process.env.EXPO_PUBLIC_SUPABASE_URL!;
const anon = () => process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const service = () => process.env.TEST_SUPABASE_SERVICE_ROLE_KEY!;

export const serviceClient = (): SupabaseClient =>
  createClient(url(), service(), { auth: { persistSession: false } });

export const anonClient = (): SupabaseClient =>
  createClient(url(), anon(), { auth: { persistSession: false } });
