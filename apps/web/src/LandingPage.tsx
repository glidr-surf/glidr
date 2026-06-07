import { useEffect, useState } from 'react';
import { getLandingStats } from '@glidr/data';
import type { LandingStats } from '@glidr/data';
import { supabase } from './lib/supabase';
import Hero from './components/Hero';
import BoardFan from './components/BoardFan';
import StatStrip from './components/StatStrip';
import Footer from './components/Footer';

export default function LandingPage() {
  const [stats, setStats] = useState<LandingStats | null>(null);

  useEffect(() => {
    getLandingStats(supabase).then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <div className="lg:h-screen lg:overflow-hidden overflow-x-hidden flex flex-col">
      <main className="flex-1 min-h-0 min-w-0 flex flex-col lg:grid lg:grid-cols-[46fr_54fr]">
        {/* Red panel — wordmark, headline, signup */}
        <section className="bg-red lg:min-h-0 min-w-0">
          <Hero />
        </section>

        {/* Board panel — the fanned boards, with stats beneath on the right */}
        <section className="bg-bg min-h-svh lg:min-h-0 min-w-0 flex flex-col">
          <BoardFan />
          <StatStrip stats={stats} className="px-2xl pb-xl lg:pb-2xl" />
        </section>
      </main>

      <div className="px-2xl bg-bg">
        <Footer />
      </div>
    </div>
  );
}
