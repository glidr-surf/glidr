import WaitlistForm from './WaitlistForm';

/** The red panel: wordmark, headline, signup. */
export default function Hero() {
  return (
    <div className="flex flex-col min-h-svh lg:min-h-0 lg:h-full px-2xl py-2xl lg:py-3xl gap-2xl lg:gap-0">
      <div className="font-display text-display-s tracking-[3px] text-bg animate-fade-up">
        GLIDR
      </div>

      <div className="lg:my-auto">
        <div className="font-mono text-tag uppercase tracking-[0.12em] text-bg/70 mb-lg animate-fade-up">
          Surfboard opinions
        </div>
        <h1 className="font-display text-[clamp(3rem,13vw,3.5rem)] lg:text-display-xl leading-[0.88] tracking-[1px] text-bg animate-fade-up-1">
          IT'S THE<br />BOARD,<br />SILLY.
        </h1>
        <div className="w-[60px] h-[4px] bg-yellow my-lg animate-fade-up-1" />
        <p className="text-body-m lg:text-body-l text-bg/90 max-w-[420px] mb-xl animate-fade-up-2">
          Find your next magic board. Honest reviews from kooks and corelords.
        </p>
        <div className="animate-fade-up-3">
          <WaitlistForm />
        </div>
      </div>
    </div>
  );
}
