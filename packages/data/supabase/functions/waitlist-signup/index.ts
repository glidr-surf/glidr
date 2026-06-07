import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const FROM = 'Glidr <hello@send.glidr.surf>';
const SUBJECT = "You're in the lineup";
const BODY = `Cheers for signing up to test Glidr.

You're on the list for the iOS alpha. We'll send a TestFlight link to get the app on your phone shortly. Keep an eye on this inbox.

Glidr is where surfers share what boards actually ride like. No shaper marketing, just honest opinions from kooks and corelords.

The Glidr crew`;

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

// Cloudflare Turnstile verification. Fail-closed: if the secret is missing or
// the token does not validate, the signup is rejected.
async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY');
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY not set; rejecting signup');
    return false;
  }
  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  });
  const data = await res.json().catch(() => ({ success: false }));
  return data.success === true;
}

async function sendConfirmation(email: string) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    console.error('RESEND_API_KEY not set; skipping confirmation email');
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: email, subject: SUBJECT, text: BODY }),
  });
  if (!res.ok) {
    console.error('Resend send failed', res.status, await res.text());
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed' }, 405);
  }

  let email: unknown;
  let token: unknown;
  try {
    ({ email, token } = await req.json());
  } catch {
    return json({ ok: false, error: 'Invalid body' }, 400);
  }

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'Invalid email' }, 400);
  }

  if (typeof token !== 'string' || !token) {
    return json({ ok: false, error: 'Verification required' }, 403);
  }
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  if (!(await verifyTurnstile(token, ip))) {
    return json({ ok: false, error: 'Verification failed' }, 403);
  }

  const normalized = email.trim().toLowerCase();

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { error } = await supabase.from('waitlist').insert({ email: normalized });

  if (error) {
    // Duplicate email: already on the list, treat as success, no second email.
    if (error.code === '23505') {
      return json({ ok: true }, 200);
    }
    console.error('waitlist insert failed', error);
    return json({ ok: false, error: 'Could not sign up' }, 500);
  }

  await sendConfirmation(normalized);
  return json({ ok: true }, 200);
});
