import { type FormEvent, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          appearance?: 'always' | 'execute' | 'interaction-only';
          theme?: 'light' | 'dark' | 'auto';
        }
      ) => string;
      reset: (id?: string) => void;
    };
  }
}

export default function WaitlistForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [token, setToken] = useState('');
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let cancelled = false;

    function render() {
      if (cancelled || !window.turnstile || !widgetRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: TURNSTILE_SITE_KEY!,
        appearance: 'interaction-only',
        callback: (t) => setToken(t),
        'error-callback': () => setToken(''),
        'expired-callback': () => setToken(''),
      });
    }

    if (window.turnstile) {
      render();
      return () => {
        cancelled = true;
      };
    }
    const poll = setInterval(() => {
      if (window.turnstile) {
        clearInterval(poll);
        render();
      }
    }, 200);
    return () => {
      cancelled = true;
      clearInterval(poll);
    };
  }, []);

  function resetWidget() {
    setToken('');
    if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const email = (new FormData(form).get('email') as string)?.trim();
    try {
      const { error } = await supabase.functions.invoke('waitlist-signup', {
        body: { email, token },
      });
      if (!error) {
        setStatus('done');
        form.reset();
      } else {
        setStatus('error');
        resetWidget();
      }
    } catch {
      setStatus('error');
      resetWidget();
    }
  }

  return (
    <div className="max-w-[420px]">
      <div className="font-mono text-label uppercase text-text-mid mb-md">
        Sign up for alpha testing
      </div>

      {status === 'done' ? (
        <p className="font-mono text-body-s text-green leading-relaxed">
          You're in. Check your inbox for your TestFlight invite.
        </p>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="flex gap-sm">
            <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
            <input
              type="email"
              name="email"
              required
              placeholder="Your email"
              className="flex-1 min-w-0 px-lg py-md border-2 border-border bg-transparent font-body text-body-m text-text outline-none placeholder:text-text-light focus:border-red"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="font-display text-body-m tracking-[2px] px-xl py-md bg-text text-bg border-none cursor-pointer disabled:opacity-50 hover:bg-red transition-colors duration-200"
            >
              {status === 'sending' ? '...' : 'JOIN'}
            </button>
          </form>
          <div ref={widgetRef} className="empty:hidden mt-md" />
          <p
            className={`font-mono text-micro mt-md ${
              status === 'error' ? 'text-red' : 'text-text-light'
            }`}
          >
            {status === 'error'
              ? 'Something went wrong. Try again.'
              : "We'll email you a TestFlight link for the iOS app."}
          </p>
        </>
      )}
    </div>
  );
}
