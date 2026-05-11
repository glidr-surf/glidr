export default function Footer() {
  return (
    <footer className="py-md border-t-2 border-border flex flex-col lg:flex-row justify-between items-center gap-md">
      <div className="flex flex-col lg:flex-row gap-lg items-center">
        <span className="font-display text-body-s text-text-light tracking-[3px]">GLIDR</span>
        <div className="flex gap-lg">
          <span className="font-mono text-tag text-text-light tracking-[0.06em]">01 — RATE BOARDS</span>
          <span className="font-mono text-tag text-text-light tracking-[0.06em]">02 — BLAME BOARDS</span>
          <span className="font-mono text-tag text-text-light tracking-[0.06em]">03 — BUY MORE BOARDS</span>
        </div>
      </div>
      <span className="font-mono text-tag text-text-light">still looking for the magic board.</span>
    </footer>
  );
}
