export default function Footer() {
  return (
    <footer className="py-md border-t-2 border-border flex flex-col lg:flex-row justify-between items-center gap-md">
      <div className="flex flex-col lg:flex-row gap-lg items-center">
        <span className="font-display text-body-s text-text-light tracking-[3px]">GLIDR</span>
        <div className="flex gap-lg">
          <span className="font-mono text-tag text-text-light tracking-[0.06em]">01 — RIDE IT</span>
          <span className="font-mono text-tag text-text-light tracking-[0.06em]">02 — BLAME IT</span>
          <span className="font-mono text-tag text-text-light tracking-[0.06em]">03 — BUY ANOTHER</span>
        </div>
      </div>
      <a href="https://instagram.com/glidr.surf" target="_blank" rel="noopener noreferrer" className="text-text-light hover:text-text transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      </a>
    </footer>
  );
}
