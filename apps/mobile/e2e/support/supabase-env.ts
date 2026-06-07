// Per-worker env setup (setupFiles — runs BEFORE the test module graph, so the
// supabase singleton sees the env at import). globalSetup runs in a separate
// process whose process.env mutations don't reach jest workers, so we read the
// CLI here too. Cheap (one execSync per worker) and reliable.
import { readSupabaseEnv } from './env';

readSupabaseEnv();
