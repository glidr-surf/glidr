// Usage: SB_URL=... SB_SERVICE_KEY=... node scripts/seed-board-images.mjs
// Uploads the existing board photos into the 'images' bucket, inserts images rows,
// and prints the seed SQL (insert into images ...) to stdout.
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ASSETS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../apps/web/public/boards');
const MAP = {
  'HYPTO KRYPTO': 'haydenshapes-hypto-krypto.jpg',
  'FEVER': 'ci-fever.png',
  'CI MID': 'ci-mid.png',
  'POD MOD': 'ci-pod-mod.png',
  "RNF '96": 'lost-rnf-96.jpg',
  'PUDDLE JUMPER': 'lost-puddle-jumper.jpg',
  'DRIVER 3.0': 'lost-driver.jpg',
  'GHOST': 'pyzel-ghost.png',
  'MID LENGTH CRISIS': 'pyzel-mid-length-crisis.png',
  'FLAT TRACKER': 'christenson-flat-tracker.jpg',
  'CHRISTENSON FISH': 'christenson-fish.png',
  'SPROUT': 'cjnelson-sprout.png',
  '#77': 'sharpeye-77.jpg',
  'TWINSMAN': 'album-twinsman.png',
  'SWEET POTATO': 'firewire-sweet-potato.png',
  'CHERRY PICKER': 'skindog-cherry-picker.png',
};
const MIME = { jpg: 'image/jpeg', webp: 'image/webp', png: 'image/png' };

const sb = createClient(process.env.SB_URL, process.env.SB_SERVICE_KEY, { auth: { persistSession: false } });
const { data: boards, error } = await sb.from('boards').select('id, name');
if (error) throw error;

const seedRows = [];
for (const b of boards) {
  const asset = MAP[b.name];
  if (!asset) { console.error(`! no asset for board ${b.name}`); continue; }
  const ext = asset.split('.').pop();
  const objPath = `board/${b.id}/primary.${ext}`;
  const file = readFileSync(path.join(ASSETS, asset));
  const up = await sb.storage.from('images').upload(objPath, file, { contentType: MIME[ext], upsert: true });
  if (up.error) throw up.error;
  await sb.from('images').delete().eq('owner_type', 'board').eq('owner_id', b.id);
  const ins = await sb.from('images').insert({ owner_type: 'board', owner_id: b.id, path: objPath, position: 0 });
  if (ins.error) throw ins.error;
  seedRows.push(`  ('board', '${b.id}', '${objPath}', 0)`);
  console.error(`✓ ${b.name} -> ${objPath}`);
}
console.log('-- images (board photos)\ninsert into images (owner_type, owner_id, path, position) values\n' + seedRows.join(',\n') + ';');
