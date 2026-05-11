export default function NavBar() {
  return (
    <nav className="flex items-center justify-between py-lg">
      <div className="flex items-center gap-xl">
        <a href="#" className="font-display text-display-s tracking-[4px] text-text no-underline">
          GLIDR
        </a>
        <div className="hidden lg:flex items-center gap-xl">
          <div className="w-px h-3 bg-border-soft" />
          <a href="#" className="text-body-xs text-text-light no-underline">Boards</a>
          <a href="#" className="text-body-xs text-text-light no-underline">Shapers</a>
        </div>
      </div>
      <a
        href="#"
        className="font-display text-[13px] tracking-[2px] px-lg py-sm bg-red text-bg no-underline"
      >
        WAITLIST
      </a>
    </nav>
  );
}
