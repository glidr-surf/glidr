import { type FormEvent } from 'react';

export default function WaitlistForm() {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-[6px] max-w-[340px]">
      <input
        type="email"
        placeholder="Your email"
        className="flex-1 px-md py-[10px] border-2 border-border bg-transparent font-body text-body-s text-text outline-none placeholder:text-text-light focus:border-red"
      />
      <button
        type="submit"
        className="font-display text-[14px] tracking-[2px] px-lg py-[10px] bg-text text-bg border-none cursor-pointer"
      >
        JOIN
      </button>
    </form>
  );
}
