export default function NavBar() {
  return (
    <nav className="flex items-center justify-between py-lg">
      <div className="flex items-center gap-xl">
        <a href="#" className="font-display text-display-s tracking-[4px] text-text no-underline">
          GLIDR
        </a>
      </div>
      <a
        href="#"
        className="font-display text-body-m tracking-[2px] px-lg py-sm bg-red text-bg no-underline"
      >
        WAITLIST
      </a>
    </nav>
  );
}
