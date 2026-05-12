import { type FormEvent, useState } from 'react';

export default function WaitlistForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    try {
      const res = await fetch('https://formspree.io/f/mjgljdlr', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('done');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="font-mono text-body-s text-green tracking-[0.03em]">
        You're on the list. One step closer to the next magic board.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-sm max-w-[380px]">
      <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
      <input
        type="email"
        name="email"
        required
        placeholder="Your email"
        className="flex-1 px-lg py-md border-2 border-border bg-transparent font-body text-body-m text-text outline-none placeholder:text-text-light focus:border-red"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="font-display text-body-m tracking-[2px] px-xl py-md bg-text text-bg border-none cursor-pointer disabled:opacity-50 hover:bg-red transition-colors duration-200"
      >
        {status === 'sending' ? '...' : 'JOIN'}
      </button>
      {status === 'error' && (
        <div className="font-mono text-micro text-red mt-xs">Something went wrong. Try again.</div>
      )}
    </form>
  );
}
