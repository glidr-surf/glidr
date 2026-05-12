-- ============================================================
-- Tables
-- ============================================================

create table profiles (
  id uuid primary key,
  username text unique not null,
  height text,
  weight text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table shapers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  bio text,
  status text not null default 'pending' check (status in ('approved', 'pending', 'rejected')),
  submitted_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table boards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  shaper_id uuid not null references shapers(id),
  type text not null,
  image_url text,
  length text,
  width text,
  thickness text,
  volume text,
  status text not null default 'pending' check (status in ('approved', 'pending', 'rejected')),
  submitted_by uuid references profiles(id),
  verdict text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table opinions (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references boards(id),
  user_id uuid not null references profiles(id),
  text text,
  wallet_signature text,
  created_at timestamptz not null default now(),
  unique (board_id, user_id)
);

create table opinion_scores (
  opinion_id uuid not null references opinions(id) on delete cascade,
  criterion text not null,
  value numeric not null,
  primary key (opinion_id, criterion)
);

create table opinion_tags (
  opinion_id uuid not null references opinions(id) on delete cascade,
  tag_type text not null,
  value text not null,
  primary key (opinion_id, tag_type, value)
);

create table opinion_votes (
  id uuid primary key default gen_random_uuid(),
  opinion_id uuid not null references opinions(id) on delete cascade,
  user_id uuid not null references profiles(id),
  vote smallint not null check (vote in (1, -1)),
  created_at timestamptz not null default now(),
  unique (opinion_id, user_id)
);

create table follows (
  follower_id uuid not null references profiles(id),
  following_id uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

-- ============================================================
-- Views
-- ============================================================

create or replace view opinion_vote_counts as
select
  opinion_id,
  coalesce(sum(case when vote = 1 then 1 else 0 end), 0)::int as upvotes,
  coalesce(sum(case when vote = -1 then 1 else 0 end), 0)::int as downvotes
from opinion_votes
group by opinion_id;

create or replace view board_stats as
select
  b.id as board_id,
  round(avg(os.value), 1) as avg_rating,
  count(distinct o.id)::int as opinion_count,
  round(
    100.0 * count(distinct case when ba.value = 1 then o.id end)
    / nullif(count(distinct case when ba.criterion = 'buy_again' then o.id end), 0),
    0
  ) as buy_again_percent,
  (
    select ot.value
    from opinion_tags ot
    join opinions o2 on o2.id = ot.opinion_id
    where o2.board_id = b.id and ot.tag_type = 'vibe_tag'
    group by ot.value
    order by count(*) desc
    limit 1
  ) as top_vibe_tag
from boards b
left join opinions o on o.board_id = b.id
left join opinion_scores os on os.opinion_id = o.id and os.criterion = 'overall_rating'
left join opinion_scores ba on ba.opinion_id = o.id and ba.criterion = 'buy_again'
group by b.id;

create or replace view shaper_stats as
select
  s.id as shaper_id,
  count(distinct b.id)::int as board_count,
  round(avg(bs.avg_rating), 1) as avg_rating,
  coalesce(sum(bs.opinion_count), 0)::int as opinion_count,
  (
    select ot.value
    from opinion_tags ot
    join opinions o on o.id = ot.opinion_id
    join boards b2 on b2.id = o.board_id
    where b2.shaper_id = s.id and ot.tag_type = 'vibe_tag'
    group by ot.value
    order by count(*) desc
    limit 1
  ) as top_vibe_tag
from shapers s
left join boards b on b.shaper_id = s.id and b.status = 'approved'
left join board_stats bs on bs.board_id = b.id
group by s.id;

create or replace view profile_stats as
select
  p.id as user_id,
  count(distinct o.id)::int as opinion_count,
  count(distinct case when bs.avg_rating = 5 then o.board_id end)::int as magic_board_count,
  (select count(*)::int from follows f where f.following_id = p.id) as followers_count,
  (select count(*)::int from follows f where f.follower_id = p.id) as following_count
from profiles p
left join opinions o on o.user_id = p.id
left join board_stats bs on bs.board_id = o.board_id
group by p.id;

-- ============================================================
-- Row-Level Security
-- ============================================================

alter table profiles enable row level security;
alter table shapers enable row level security;
alter table boards enable row level security;
alter table opinions enable row level security;
alter table opinion_scores enable row level security;
alter table opinion_tags enable row level security;
alter table opinion_votes enable row level security;
alter table follows enable row level security;

create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select coalesce(
    auth.uid()::text = any(string_to_array(current_setting('app.admin_ids', true), ',')),
    false
  );
$$;

-- profiles
create policy "profiles: anyone can read" on profiles for select using (true);
create policy "profiles: users update own row" on profiles for update using (auth.uid() = id);

-- shapers
create policy "shapers: anyone reads approved" on shapers for select using (status = 'approved' or is_admin());
create policy "shapers: authenticated insert as pending" on shapers for insert with check (auth.uid() is not null and status = 'pending');
create policy "shapers: admin update" on shapers for update using (is_admin());
create policy "shapers: admin delete" on shapers for delete using (is_admin());

-- boards
create policy "boards: anyone reads approved" on boards for select using (status = 'approved' or is_admin());
create policy "boards: authenticated insert as pending" on boards for insert with check (auth.uid() is not null and status = 'pending');
create policy "boards: admin update" on boards for update using (is_admin());
create policy "boards: admin delete" on boards for delete using (is_admin());

-- opinions
create policy "opinions: anyone can read" on opinions for select using (true);
create policy "opinions: authenticated insert own" on opinions for insert with check (auth.uid() = user_id);
create policy "opinions: update own" on opinions for update using (auth.uid() = user_id);
create policy "opinions: delete own" on opinions for delete using (auth.uid() = user_id);

-- opinion_scores
create policy "opinion_scores: anyone can read" on opinion_scores for select using (true);
create policy "opinion_scores: owner insert" on opinion_scores for insert with check (auth.uid() = (select user_id from opinions where id = opinion_id));
create policy "opinion_scores: owner update" on opinion_scores for update using (auth.uid() = (select user_id from opinions where id = opinion_id));
create policy "opinion_scores: owner delete" on opinion_scores for delete using (auth.uid() = (select user_id from opinions where id = opinion_id));

-- opinion_tags
create policy "opinion_tags: anyone can read" on opinion_tags for select using (true);
create policy "opinion_tags: owner insert" on opinion_tags for insert with check (auth.uid() = (select user_id from opinions where id = opinion_id));
create policy "opinion_tags: owner update" on opinion_tags for update using (auth.uid() = (select user_id from opinions where id = opinion_id));
create policy "opinion_tags: owner delete" on opinion_tags for delete using (auth.uid() = (select user_id from opinions where id = opinion_id));

-- opinion_votes
create policy "opinion_votes: anyone can read" on opinion_votes for select using (true);
create policy "opinion_votes: authenticated insert own" on opinion_votes for insert with check (auth.uid() = user_id);
create policy "opinion_votes: update own" on opinion_votes for update using (auth.uid() = user_id);
create policy "opinion_votes: delete own" on opinion_votes for delete using (auth.uid() = user_id);

-- follows
create policy "follows: anyone can read" on follows for select using (true);
create policy "follows: authenticated insert own" on follows for insert with check (auth.uid() = follower_id);
create policy "follows: delete own" on follows for delete using (auth.uid() = follower_id);

-- ============================================================
-- Storage
-- ============================================================

insert into storage.buckets (id, name, public)
values ('board-images', 'board-images', true)
on conflict (id) do nothing;

create policy "board-images: public read" on storage.objects for select using (bucket_id = 'board-images');
create policy "board-images: authenticated upload" on storage.objects for insert with check (bucket_id = 'board-images' and auth.uid() is not null);
