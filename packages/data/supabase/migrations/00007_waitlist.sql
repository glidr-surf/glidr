-- Alpha-testing waitlist. Populated by the waitlist-signup edge function
-- (service_role only). invited_at is set when a TestFlight invite is sent.

create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'web',
  created_at timestamptz not null default now(),
  invited_at timestamptz
);

alter table waitlist enable row level security;
-- No policies: anon/authenticated have no access. Only the edge function
-- (service_role) reads and writes.
