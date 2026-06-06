import {
  createClient as supabaseCreateClient,
  type SupabaseClient,
  type SupabaseClientOptions,
} from '@supabase/supabase-js';

export type { SupabaseClient } from '@supabase/supabase-js';

export function createClient(
  supabaseUrl: string,
  supabaseAnonKey: string,
  options?: SupabaseClientOptions<'public'>,
): SupabaseClient {
  return supabaseCreateClient(supabaseUrl, supabaseAnonKey, options);
}
