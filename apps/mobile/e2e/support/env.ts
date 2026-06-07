import { execSync } from 'node:child_process';
import path from 'node:path';

// Read local Supabase connection info from the CLI and expose it as the env
// vars the app's supabase singleton reads at import time.
export function readSupabaseEnv() {
  const cwd = path.resolve(__dirname, '../../../../packages/data');
  let raw: string;
  try {
    raw = execSync('supabase status -o env', { cwd, encoding: 'utf8' });
  } catch {
    throw new Error(
      'Local Supabase is not running. Start it: pnpm --filter @glidr/data exec supabase start',
    );
  }
  const get = (key: string) => {
    const m = raw.match(new RegExp(`^${key}="?([^"\\n]+)"?`, 'm'));
    if (!m) throw new Error(`Could not find ${key} in supabase status output`);
    return m[1];
  };
  process.env.EXPO_PUBLIC_SUPABASE_URL = get('API_URL');
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = get('ANON_KEY');
  process.env.TEST_SUPABASE_SERVICE_ROLE_KEY = get('SERVICE_ROLE_KEY');
}

// jest globalSetup. Runs once in a separate process. We ALSO read the same env
// per-worker in supabase-env.ts (setupFiles) because globalSetup's process.env
// mutations do not reliably propagate to worker processes — see that file.
export default function setup() {
  readSupabaseEnv();
}
