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

  const adminIds = (Deno.env.get('ADMIN_IDS') ?? '').split(',');
  if (!adminIds.includes(user.id)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
  }

  const { type, id, action } = await req.json();
  if (!type || !id || !action) {
    return new Response(JSON.stringify({ error: 'type, id, and action required' }), { status: 400 });
  }

  const table = type === 'board' ? 'boards' : type === 'shaper' ? 'shapers' : null;
  if (!table || !['approve', 'reject'].includes(action)) {
    return new Response(JSON.stringify({ error: 'Invalid type or action' }), { status: 400 });
  }

  const status = action === 'approve' ? 'approved' : 'rejected';
  const { error } = await supabase.from(table).update({ status }).eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true, status }), { status: 200 });
});
