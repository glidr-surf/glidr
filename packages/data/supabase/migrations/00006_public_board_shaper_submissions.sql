-- Allow any authenticated user to add boards/shapers without admin approval (for now).
--
-- Previously inserts were forced to status='pending', and pending rows are invisible
-- (select policy = "approved or is_admin"), so submit*'s insert().select().single()
-- read-back was RLS-denied for non-admins and add-board failed. Relax the insert
-- policies to permit any status for authenticated users; submitBoard/submitShaper now
-- create rows as 'approved' so they're immediately visible. Admin update/delete and
-- the approved-only select gate are unchanged.

drop policy "shapers: authenticated insert as pending" on shapers;
create policy "shapers: authenticated insert" on shapers
  for insert with check (auth.uid() is not null);

drop policy "boards: authenticated insert as pending" on boards;
create policy "boards: authenticated insert" on boards
  for insert with check (auth.uid() is not null);
