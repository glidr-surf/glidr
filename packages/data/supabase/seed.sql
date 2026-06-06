-- ============================================================
-- Reset (makes this seed re-runnable)
-- ============================================================

truncate table
  opinion_votes,
  opinion_tags,
  opinion_scores,
  opinions,
  follows,
  images,
  boards,
  shapers,
  profiles
  restart identity cascade;

-- ============================================================
-- Profiles (test users)
-- ============================================================

insert into profiles (id, username, height, weight, created_at) values
  ('00000000-0000-0000-0000-000000000001', 'SaltyDawg',     '5''10"', '165 lbs', '2026-03-15T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000002', 'KookPatrol',    '6''1"',  '180 lbs', '2026-03-20T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000003', 'BarrelDodger',  '5''11"', '170 lbs', '2026-03-22T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000004', 'WaxedPoetic',   '5''9"',  '155 lbs', '2026-04-01T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000005', 'LogLyfe',       '5''9"',  '155 lbs', '2026-04-05T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000006', 'ReefRash',      '6''0"',  '175 lbs', '2026-04-08T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000007', 'DawnPatrolDan', '5''8"',  '160 lbs', '2026-04-12T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000008', 'ChannelChunder','6''2"',  '190 lbs', '2026-04-15T00:00:00Z'),
  ('00000000-0000-0000-0000-000000000009', 'GromWrangler',  '5''7"',  '145 lbs', '2026-04-18T00:00:00Z'),
  ('00000000-0000-0000-0000-00000000000a', 'TrimQueen',     '5''6"',  '135 lbs', '2026-04-20T00:00:00Z'),
  ('00000000-0000-0000-0000-00000000000b', 'ParkingLotPro', '5''11"', '185 lbs', '2026-04-25T00:00:00Z');

-- ============================================================
-- Shapers
-- ============================================================

insert into shapers (id, name, location, bio, status) values
  ('10000000-0000-0000-0000-000000000001', 'Haydenshapes', 'Sydney, Australia',
   'Hayden Cox''s outfit. FutureFlex parabolic rails and one board — the Hypto — that ended up in everyone''s quiver whether they admit it or not.', 'approved'),
  ('10000000-0000-0000-0000-000000000002', 'Channel Islands', 'Santa Barbara, CA',
   'Al & Britt Merrick. The default shortboard of the WCT for decades; the brand most likely to be under a pro''s feet.', 'approved'),
  ('10000000-0000-0000-0000-000000000003', 'Lost', 'San Clemente, CA',
   'Matt ''Mayhem'' Biolos. Loud graphics, fast boards, and a model name for every mood. Built a religion out of the groveler.', 'approved'),
  ('10000000-0000-0000-0000-000000000004', 'Pyzel', 'Haleiwa, Hawaii',
   'Jon Pyzel shapes John John Florence''s boards. North Shore-tested, which is to say tested on waves that will end you.', 'approved'),
  ('10000000-0000-0000-0000-000000000005', 'Christenson', 'San Juan Capistrano, CA',
   'Chris Christenson. Hand-shaped mid-lengths and fish with a hot-rod soul. The shaper hipsters name-drop and corelords actually ride.', 'approved'),
  ('10000000-0000-0000-0000-000000000006', 'CJ Nelson Designs', 'Santa Cruz, CA',
   'CJ Nelson''s traditional logs, built by Thunderbolt. Noseriding machines for people who think a turn is optional.', 'approved'),
  ('10000000-0000-0000-0000-000000000007', 'Sharpeye', 'Lemon Grove, CA',
   'Marcio Zouvi. The board under Filipe Toledo when he''s doing things to a wave that look illegal.', 'approved'),
  ('10000000-0000-0000-0000-000000000008', 'Album', 'San Clemente, CA',
   'Matt Parker''s design lab. Asymmetric experiments and twins for people who got bored of thrusters.', 'approved'),
  ('10000000-0000-0000-0000-000000000009', 'Firewire', 'Carlsbad, CA',
   'Dan Mann''s design house, the sustainable-tech brand that made the Sweet Potato a small-wave cult object.', 'approved'),
  ('10000000-0000-0000-0000-00000000000a', 'Skindog', 'Cornwall, England',
   'Ben ''Skindog'' Skinner''s logs, built by Thunderbolt. Cold-water noseriding pedigree from a man who wins everything in Europe.', 'approved');

-- ============================================================
-- Boards
-- ============================================================

insert into boards (id, name, shaper_id, type, length, width, thickness, volume, status, verdict) values
  ('20000000-0000-0000-0000-000000000001', 'HYPTO KRYPTO', '10000000-0000-0000-0000-000000000001', 'SHORT', '5''10"', '20.25"', '2.625"', '33.8L', 'approved',
   'The one board every surfer has ridden or lied about riding. Annoyingly good at everything.'),
  ('20000000-0000-0000-0000-000000000002', 'FEVER', '10000000-0000-0000-0000-000000000002', 'SHORT', '5''10"', '18.625"', '2.3125"', '26.4L', 'approved',
   'A tour-level shortboard with training wheels you can''t see. Makes you look better than you are.'),
  ('20000000-0000-0000-0000-000000000003', 'CI MID', '10000000-0000-0000-0000-000000000002', 'MID', '6''10"', '20.875"', '2.6875"', '42.3L', 'approved',
   'The mid-length that sold a thousand mid-lengths. Glide with a backbone.'),
  ('20000000-0000-0000-0000-000000000004', 'POD MOD', '10000000-0000-0000-0000-000000000002', 'FISH', '5''8"', '20"', '2.5"', '31.7L', 'approved',
   'Retro fish, modern engine. Fast and loose when the surf is rubbish.'),
  ('20000000-0000-0000-0000-000000000005', 'RNF ''96', '10000000-0000-0000-0000-000000000003', 'FISH', '5''6"', '19.25"', '2.38"', '35L', 'approved',
   'The ''90s called. They were right. Skatey, drivey, gloriously dumb fun.'),
  ('20000000-0000-0000-0000-000000000006', 'PUDDLE JUMPER', '10000000-0000-0000-0000-000000000003', 'SHORT', '5''10"', '22"', '2.75"', '40L', 'approved',
   'Short, fat, and shameless. Keeps the worst day surfable.'),
  ('20000000-0000-0000-0000-000000000007', 'DRIVER 3.0', '10000000-0000-0000-0000-000000000003', 'SHORT', '6''1"', '19.375"', '2.5"', '31L', 'approved',
   'A proper shortboard for people who can actually surf. It will expose you.'),
  ('20000000-0000-0000-0000-000000000008', 'GHOST', '10000000-0000-0000-0000-000000000004', 'SHORT', '6''0"', '19.375"', '2.56"', '29.7L', 'approved',
   'JJF''s wave-catcher. Steps up to size without turning into a chore.'),
  ('20000000-0000-0000-0000-000000000009', 'MID LENGTH CRISIS', '10000000-0000-0000-0000-000000000004', 'MID', '7''0"', '21"', '2.75"', '38L', 'approved',
   'Buy this instead of the motorbike. Racey trim for a man of a certain age.'),
  ('20000000-0000-0000-0000-00000000000a', 'FLAT TRACKER', '10000000-0000-0000-0000-000000000005', 'MID', '7''0"', '21.25"', '2.75"', '40L', 'approved',
   'The mid-length that made mid-lengths cool again. Rides above its pay grade.'),
  ('20000000-0000-0000-0000-00000000000b', 'CHRISTENSON FISH', '10000000-0000-0000-0000-000000000005', 'FISH', '5''6"', '20.875"', '2.4375"', '32.9L', 'approved',
   'Keel-fin glide, hand-shaped by a bloke named after a tree. Goes fast sideways.'),
  ('20000000-0000-0000-0000-00000000000c', 'SPROUT', '10000000-0000-0000-0000-000000000006', 'LOG', '9''2"', '23"', '3"', '74.5L', 'approved',
   'Pure noseriding soul. Makes a turn feel like an admission of defeat.'),
  ('20000000-0000-0000-0000-00000000000d', '#77', '10000000-0000-0000-0000-000000000007', 'SHORT', '5''11"', '19.25"', '2.5"', '29.15L', 'approved',
   'Filipe''s board. You are not Filipe. It will still make you faster.'),
  ('20000000-0000-0000-0000-00000000000e', 'TWINSMAN', '10000000-0000-0000-0000-000000000008', 'ALT', '5''10"', '20.5"', '2.56"', '33L', 'approved',
   'Asher Pacey''s twin. Free, drivey, and allergic to doing turns the boring way.'),
  ('20000000-0000-0000-0000-00000000000f', 'SWEET POTATO', '10000000-0000-0000-0000-000000000009', 'FISH', '5''6"', '22"', '2.5625"', '37.8L', 'approved',
   'Catches everything, paddles like a lilo. Your first board''s cooler cousin.'),
  ('20000000-0000-0000-0000-000000000010', 'CHERRY PICKER', '10000000-0000-0000-0000-00000000000a', 'LOG', '9''6"', '23.5"', '3"', '79L', 'approved',
   'A cold-water log with a flicked-up tail. Hang ten, then actually turn.');

-- ============================================================
-- Images (board photos) — extensions match the files committed in a later task
-- ============================================================

insert into images (owner_type, owner_id, path, position) values
  ('board', '20000000-0000-0000-0000-000000000001', 'board/20000000-0000-0000-0000-000000000001/primary.jpg', 0),
  ('board', '20000000-0000-0000-0000-000000000002', 'board/20000000-0000-0000-0000-000000000002/primary.jpg', 0),
  ('board', '20000000-0000-0000-0000-000000000003', 'board/20000000-0000-0000-0000-000000000003/primary.jpg', 0),
  ('board', '20000000-0000-0000-0000-000000000004', 'board/20000000-0000-0000-0000-000000000004/primary.jpg', 0),
  ('board', '20000000-0000-0000-0000-000000000005', 'board/20000000-0000-0000-0000-000000000005/primary.jpg', 0),
  ('board', '20000000-0000-0000-0000-000000000006', 'board/20000000-0000-0000-0000-000000000006/primary.jpg', 0),
  ('board', '20000000-0000-0000-0000-000000000007', 'board/20000000-0000-0000-0000-000000000007/primary.jpg', 0),
  ('board', '20000000-0000-0000-0000-000000000008', 'board/20000000-0000-0000-0000-000000000008/primary.jpg', 0),
  ('board', '20000000-0000-0000-0000-000000000009', 'board/20000000-0000-0000-0000-000000000009/primary.jpg', 0),
  ('board', '20000000-0000-0000-0000-00000000000a', 'board/20000000-0000-0000-0000-00000000000a/primary.jpg', 0),
  ('board', '20000000-0000-0000-0000-00000000000b', 'board/20000000-0000-0000-0000-00000000000b/primary.jpg', 0),
  ('board', '20000000-0000-0000-0000-00000000000c', 'board/20000000-0000-0000-0000-00000000000c/primary.jpg', 0),
  ('board', '20000000-0000-0000-0000-00000000000d', 'board/20000000-0000-0000-0000-00000000000d/primary.jpg', 0),
  ('board', '20000000-0000-0000-0000-00000000000e', 'board/20000000-0000-0000-0000-00000000000e/primary.jpg', 0),
  ('board', '20000000-0000-0000-0000-00000000000f', 'board/20000000-0000-0000-0000-00000000000f/primary.png', 0),
  ('board', '20000000-0000-0000-0000-000000000010', 'board/20000000-0000-0000-0000-000000000010/primary.png', 0);
