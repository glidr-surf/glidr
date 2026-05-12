import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing authorization' }), { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const userId = user.id;

  const [profile, opinions, followers, following] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('opinions').select(`
      *, opinion_scores(*), opinion_tags(*)
    `).eq('user_id', userId),
    supabase.from('follows').select('follower_id').eq('following_id', userId),
    supabase.from('follows').select('following_id').eq('follower_id', userId),
  ]);

  const exportData = {
    exportedAt: new Date().toISOString(),
    profile: profile.data,
    opinions: opinions.data,
    followers: (followers.data ?? []).map((r: any) => r.follower_id),
    following: (following.data ?? []).map((r: any) => r.following_id),
  };

  return new Response(JSON.stringify(exportData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="glidr-export-${userId}.json"`,
    },
  });
});
