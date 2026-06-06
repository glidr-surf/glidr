#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DATA_DIR="$SCRIPT_DIR/.."
SUPABASE_DIR="$DATA_DIR/supabase"
ROOT_DIR="$DATA_DIR/../.."
ROOT_ENV="$ROOT_DIR/.env"

# --- Check root .env ---
if [[ ! -f "$ROOT_ENV" ]]; then
  echo "Missing $ROOT_ENV — create it with SUPABASE_URL, SUPABASE_KEY"
  exit 1
fi

# --- Read root .env ---
source "$ROOT_ENV"

for var in SUPABASE_URL SUPABASE_KEY; do
  if [[ -z "${!var:-}" ]]; then
    echo "Missing $var in $ROOT_ENV"
    exit 1
  fi
done

# --- Generate per-app .env files ---
echo "Generating app .env files from root .env..."

cat > "$ROOT_DIR/apps/mobile/.env" <<EOF
EXPO_PUBLIC_SUPABASE_URL=$SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_KEY
EOF

cat > "$ROOT_DIR/apps/web/.env" <<EOF
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_KEY
EOF

echo "  apps/mobile/.env"
echo "  apps/web/.env"

# --- Check CLI ---
if ! command -v supabase &>/dev/null; then
  echo "supabase CLI not found. Install: brew install supabase/tap/supabase"
  exit 1
fi

if ! supabase projects list &>/dev/null 2>&1; then
  echo "Not logged in. Run: supabase login"
  exit 1
fi

# --- Extract project ref from URL ---
PROJECT_REF=$(echo "$SUPABASE_URL" | sed 's|https://||' | sed 's|\.supabase\.co||')
echo "Project ref: $PROJECT_REF"

# --- Link ---
echo "Linking to project..."
supabase link --project-ref "$PROJECT_REF" --workdir "$DATA_DIR"

# --- Push migration ---
echo "Pushing migration..."
supabase db push --workdir "$DATA_DIR"

# --- Seed (idempotent: seed.sql truncates before inserting) ---
echo "Seeding data..."
supabase db query --linked -f "$SUPABASE_DIR/seed.sql" --workdir "$DATA_DIR" > /dev/null

# --- Deploy edge functions ---
echo "Deploying edge functions..."
for fn in "$SUPABASE_DIR"/functions/*/; do
  fn_name=$(basename "$fn")
  echo "  $fn_name"
  supabase functions deploy "$fn_name" --workdir "$DATA_DIR"
done

echo ""
echo "Setup complete. Run: pnpm dev"
echo ""
echo "Auth: Supabase-native email OTP (no third-party provider). Users sign in with a"
echo "code sent to their email; auth.uid() drives RLS. Note Supabase's built-in email"
echo "sender is rate-limited — configure custom SMTP before real beta traffic."
