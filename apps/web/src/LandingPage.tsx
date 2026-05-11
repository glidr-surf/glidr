import NavBar from './components/NavBar';
import Hero from './components/Hero';
import WaitlistForm from './components/WaitlistForm';
import BoardList from './components/BoardList';
import StatStack from './components/StatStack';
import Footer from './components/Footer';

export default function LandingPage() {
  return (
    <div className="lg:h-screen lg:overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-2xl lg:h-full lg:grid lg:grid-rows-[auto_1fr_auto]">
        <NavBar />

        {/* Desktop: two-column, vertically centered */}
        <main className="lg:grid lg:grid-cols-2 lg:gap-[40px] lg:items-center lg:min-h-0">
          {/* Left column: Hero */}
          <Hero />

          {/* Right column: Board list + stat stack (desktop) */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_auto] lg:gap-lg lg:items-start lg:min-h-0 animate-fade-up-4">
            <BoardList />
            <StatStack />
          </div>

          {/* Mobile: content-led order */}
          <div className="lg:hidden mt-xl">
            <BoardList />
          </div>
          <div className="lg:hidden mt-xl">
            <WaitlistForm />
          </div>
          <div className="lg:hidden mt-xl">
            <StatStack />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
