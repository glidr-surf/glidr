import { type FormEvent } from 'react';

export default function WaitlistForm() {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-sm max-w-[380px]">
      <input
        type="email"
        placeholder="Your email"
        className="flex-1 px-lg py-md border-2 border-border bg-transparent font-body text-body-m text-text outline-none placeholder:text-text-light focus:border-red"
      />
      <button
        type="submit"
        className="font-display text-body-m tracking-[2px] px-xl py-md bg-text text-bg border-none cursor-pointer"
      >
        JOIN
      </button>
    </form>
  );
}
