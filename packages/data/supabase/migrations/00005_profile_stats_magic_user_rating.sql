-- Magic boards = boards the USER rated 5/5, not boards whose community average happens to be 5.
-- (The original profile_stats counted by board_stats.avg_rating = 5, which is wrong + almost never exactly 5.)
create or replace view profile_stats as
select
  p.id as user_id,
  count(distinct o.id)::int as opinion_count,
  count(distinct case when os.value = 5 then o.board_id end)::int as magic_board_count,
  (select count(*)::int from follows f where f.following_id = p.id) as followers_count,
  (select count(*)::int from follows f where f.follower_id = p.id) as following_count
from profiles p
left join opinions o on o.user_id = p.id
left join opinion_scores os on os.opinion_id = o.id and os.criterion = 'overall_rating'
group by p.id;
