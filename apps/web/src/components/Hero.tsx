import WaitlistForm from './WaitlistForm';

export default function Hero() {
  return (
    <div className="flex flex-col justify-center">
      <div className="font-mono text-label uppercase text-text-light mb-lg animate-fade-up">
        A SURFBOARD RATING APP
      </div>
      <h1 className="font-display text-display-xl leading-[0.9] tracking-[1px] mb-lg animate-fade-up-1">
        <span className="hidden lg:inline">IT'S THE<br />BOARD,<br />SILLY.</span>
        <span className="lg:hidden">IT'S THE BOARD, SILLY.</span>
      </h1>
      <p className="text-body-l text-text-mid max-w-[360px] mb-xl animate-fade-up-2">
        Rate your boards. Read what others think. Buy another one anyway. The magic board is out there. Probably.
      </p>
      <div className="hidden lg:block animate-fade-up-3">
        <WaitlistForm />
      </div>
    </div>
  );
}
