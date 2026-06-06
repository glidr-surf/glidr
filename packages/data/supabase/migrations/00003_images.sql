-- Unified polymorphic images table
create table images (
  id          uuid primary key default gen_random_uuid(),
  owner_type  text not null check (owner_type in ('board','opinion','profile','shaper')),
  owner_id    uuid not null,
  path        text not null,
  position    int  not null default 0,
  uploaded_by uuid references profiles(id),
  created_at  timestamptz not null default now()
);

create index images_owner_idx on images (owner_type, owner_id);
create unique index images_single_owner_idx on images (owner_type, owner_id)
  where owner_type in ('profile','shaper');

alter table images enable row level security;
create policy "images: public read"   on images for select using (true);
create policy "images: auth insert own" on images for insert with check (uploaded_by = auth.uid());
create policy "images: delete own"      on images for delete using (uploaded_by = auth.uid());

-- Consolidated public bucket
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "images bucket: public read"
  on storage.objects for select using (bucket_id = 'images');
create policy "images bucket: authenticated upload"
  on storage.objects for insert with check (bucket_id = 'images' and auth.uid() is not null);
create policy "images bucket: owner update"
  on storage.objects for update using (bucket_id = 'images' and owner = auth.uid());
create policy "images bucket: owner delete"
  on storage.objects for delete using (bucket_id = 'images' and owner = auth.uid());

-- Retire the old single-purpose bucket: drop its policies so it's inert.
-- (The empty 'board-images' bucket row is left as-is; storage.objects/buckets
--  cannot be deleted via SQL in newer Supabase — use the Storage API if you
--  later want to remove the empty bucket entirely.)
drop policy if exists "board-images: public read" on storage.objects;
drop policy if exists "board-images: authenticated upload" on storage.objects;

-- images table is now canonical; drop the per-board url column
alter table boards drop column if exists image_url;
