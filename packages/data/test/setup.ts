import { execSync } from 'node:child_process';

export default function setup() {
  let raw: string;
  try {
    raw = execSync('supabase status -o env', { cwd: __dirname + '/..', encoding: 'utf8' });
  } catch {
    throw new Error(
      'Local Supabase is not running. Start it with: pnpm --filter @glidr/data exec supabase start',
    );
  }

  const get = (key: string) => {
    const m = raw.match(new RegExp(`^${key}="?([^"\\n]+)"?`, 'm'));
    if (!m) throw new Error(`Could not find ${key} in supabase status output`);
    return m[1];
  };

  process.env.TEST_SUPABASE_URL = get('API_URL');
  process.env.TEST_SUPABASE_ANON_KEY = get('ANON_KEY');
  process.env.TEST_SUPABASE_SERVICE_ROLE_KEY = get('SERVICE_ROLE_KEY');
}
