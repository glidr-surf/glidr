import type { SupabaseClient } from '@supabase/supabase-js';

export function imagePublicUrl(client: SupabaseClient, path: string): string {
  return client.storage.from('images').getPublicUrl(path).data.publicUrl;
}

/** Map of owner_id -> primary (lowest position) image path, for one owner_type. */
export async function fetchPrimaryImagePaths(
  client: SupabaseClient,
  ownerType: 'board' | 'opinion' | 'profile' | 'shaper',
  ownerIds: string[],
): Promise<Map<string, string>> {
  if (ownerIds.length === 0) return new Map();
  const { data, error } = await client
    .from('images')
    .select('owner_id, path, position')
    .eq('owner_type', ownerType)
    .in('owner_id', ownerIds)
    .order('position', { ascending: true });
  if (error) throw error;
  const map = new Map<string, string>();
  for (const row of data ?? []) {
    if (!map.has(row.owner_id as string)) map.set(row.owner_id as string, row.path as string);
  }
  return map;
}

export type ImageOwnerType = 'board' | 'opinion' | 'profile' | 'shaper';

export interface ImageRow {
  id: string;
  owner_type: string;
  owner_id: string;
  path: string;
  position: number;
  uploaded_by: string | null;
}

export async function deleteImagesFor(
  client: SupabaseClient,
  ownerType: ImageOwnerType,
  ownerId: string,
): Promise<void> {
  const { error } = await client.from('images').delete().eq('owner_type', ownerType).eq('owner_id', ownerId);
  if (error) throw error;
}

export async function uploadImage(
  client: SupabaseClient,
  opts: {
    ownerType: ImageOwnerType;
    ownerId: string;
    file: Blob | ArrayBuffer;
    ext: string;
    contentType: string;
    position?: number;
    replace?: boolean; // for single-image owners (avatar/logo/board primary)
  },
): Promise<ImageRow> {
  const { data: auth } = await client.auth.getUser();
  const uid = auth.user?.id ?? null;
  if (opts.replace) await deleteImagesFor(client, opts.ownerType, opts.ownerId);

  const key = `${Date.now()}-${opts.position ?? 0}`;
  const path = `${opts.ownerType}/${opts.ownerId}/${key}.${opts.ext}`;

  const up = await client.storage.from('images').upload(path, opts.file, {
    contentType: opts.contentType,
    upsert: true,
  });
  if (up.error) throw up.error;

  const { data, error } = await client
    .from('images')
    .insert({
      owner_type: opts.ownerType,
      owner_id: opts.ownerId,
      path,
      position: opts.position ?? 0,
      uploaded_by: uid,
    })
    .select('id, owner_type, owner_id, path, position, uploaded_by')
    .single();
  if (error) throw error;
  return data as ImageRow;
}
