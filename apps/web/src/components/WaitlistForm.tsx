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
    <div className="max-w-[440px]">
      <div className="font-mono text-label uppercase text-bg/80 mb-md">
        Sign up for alpha testing
      </div>

      {status === 'done' ? (
        <p className="font-mono text-body-s font-medium text-bg leading-relaxed">
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
              className="flex-1 min-w-0 h-[56px] px-lg border-[2.5px] border-border bg-bg font-body text-body-m text-text outline-none placeholder:text-text-mid focus:border-yellow"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="font-display text-body-l tracking-[2px] px-xl h-[56px] bg-yellow text-text border-[2.5px] border-border cursor-pointer disabled:opacity-50 hover:bg-bg transition-colors duration-200"
            >
              {status === 'sending' ? '...' : 'JOIN'}
            </button>
          </form>
          <div ref={widgetRef} className="empty:hidden mt-md" />
          {status === 'error' && (
            <p className="font-mono text-micro mt-md text-bg font-bold">
              Something went wrong. Try again.
            </p>
          )}
        </>
      )}
    </div>
  );
}
