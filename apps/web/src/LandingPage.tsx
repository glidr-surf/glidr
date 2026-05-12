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

        <main className="lg:grid lg:grid-cols-2 lg:gap-[40px] lg:items-stretch lg:min-h-0">
          <div className="lg:flex lg:items-center">
            <Hero />
          </div>

          <div className="hidden lg:grid lg:grid-cols-[1fr_auto] lg:gap-lg lg:items-stretch lg:min-h-0 animate-fade-up-4">
            <BoardList />
            <StatStack />
          </div>

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
