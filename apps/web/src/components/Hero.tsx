import WaitlistForm from './WaitlistForm';

export default function Hero() {
  return (
    <div className="flex flex-col justify-center">
      <div className="font-mono text-label uppercase text-text-light mb-lg animate-fade-up">
        SURFBOARD OPINIONS
      </div>
      <h1 className="font-display text-display-xl leading-[0.9] tracking-[1px] mb-lg animate-fade-up-1">
        <span className="hidden lg:inline">IT'S THE<br />BOARD,<br />SILLY.</span>
        <span className="lg:hidden">IT'S THE BOARD, SILLY.</span>
      </h1>
      <div className="w-[60px] h-[4px] bg-red mb-lg animate-fade-up-1" />
      <p className="text-body-l text-text-mid max-w-[440px] mb-xl animate-fade-up-2">
        Find your next magic board. Honest reviews from kooks and corelords.
      </p>
      <div className="hidden lg:block animate-fade-up-3">
        <WaitlistForm />
      </div>
    </div>
  );
}
