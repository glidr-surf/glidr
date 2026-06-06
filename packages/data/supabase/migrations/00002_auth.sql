-- ============================================================
-- user_identities: maps an auth provider's subject to a profile.
-- profiles.id stays the canonical, provider-agnostic user id.
-- ============================================================

create table user_identities (
  provider text not null,
  subject text not null,
  profile_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (provider, subject)
);

create index user_identities_profile_id_idx on user_identities (profile_id);

alter table user_identities enable row level security;

-- A user may read their own identity rows.
create policy "user_identities: read own" on user_identities
  for select using (auth.uid() = profile_id);

-- A client may only insert its own 'supabase' identity, where the subject
-- matches its own uid. Future providers write identities server-side.
create policy "user_identities: insert own supabase" on user_identities
  for insert with check (
    auth.uid() = profile_id
    and provider = 'supabase'
    and subject = auth.uid()::text
  );

-- ============================================================
-- profiles: allow a user to create their own row on first login.
-- (00001 only granted SELECT + UPDATE-own.)
-- ============================================================

create policy "profiles: insert own row" on profiles
  for insert with check (auth.uid() = id);
