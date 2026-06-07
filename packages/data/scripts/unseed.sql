-- Remove demo seed data (fake users + their reviews) while KEEPING the
-- board/shaper catalogue and board images.
--
-- Safe to run any time, including after launch: every seeded row uses a fixed
-- UUID prefix, and real users/opinions get random UUIDs — so these deletes can
-- only ever match seed data, never real signups or real opinions.
--
--   Local:  pnpm --filter @glidr/data db:unseed
--   Prod:   run via the Supabase MCP execute_sql or the dashboard SQL editor
--           (no DB password needed)

-- 40 demo opinions — cascades to opinion_scores / opinion_tags / opinion_votes
-- (id is a uuid column, so cast to text for the prefix match)
delete from opinions where id::text like '30000000-%';

-- 11 demo users — profile rows only (no auth.users entries exist for them)
delete from profiles where id::text like '00000000-%';
