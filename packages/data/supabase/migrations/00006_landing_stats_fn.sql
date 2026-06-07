-- Landing page stats in a single call.
-- Magic Boards = distinct boards with at least one 5/5 opinion (overall_rating = 5).
-- security definer so aggregate counts are computed regardless of row visibility;
-- only aggregate numbers are exposed, never row data.

create or replace function landing_stats()
returns table (total_opinions int, total_shapers int, magic_boards int)
language sql
stable
security definer
set search_path = public
as $$
  select
    (select count(*)::int from opinions),
    (select count(*)::int from shapers where status = 'approved'),
    (select count(distinct o.board_id)::int
       from opinions o
       join opinion_scores os
         on os.opinion_id = o.id
        and os.criterion = 'overall_rating'
        and os.value = 5);
$$;

grant execute on function landing_stats() to anon, authenticated;
