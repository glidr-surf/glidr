import { createClient as supabaseCreateClient, type SupabaseClient } from '@supabase/supabase-js';

export type { SupabaseClient } from '@supabase/supabase-js';

export function createClient(supabaseUrl: string, supabaseAnonKey: string): SupabaseClient {
  return supabaseCreateClient(supabaseUrl, supabaseAnonKey);
}
