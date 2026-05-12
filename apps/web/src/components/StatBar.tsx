import { useState, useEffect } from 'react';
import { getLandingStats } from '@glidr/data';
import { supabase } from '../lib/supabase';
import StatBlock, { type Stat } from './StatBlock';

export default function StatBar() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    getLandingStats(supabase).then((s) => {
      setStats([
        { value: String(s.totalOpinions), label: 'BOARD OPINIONS', color: 'red' as const },
        { value: String(s.totalShapers), label: 'SHAPERS REVIEWED', color: 'yellow' as const },
        { value: String(s.magicBoards), label: 'MAGIC BOARDS', color: 'blue' as const },
      ]);
    });
  }, []);

  return (
    <div className="flex border-2 border-border [&>*+*]:border-l-2 [&>*+*]:border-border [&>*]:flex-1">
      {stats.map((stat) => (
        <StatBlock key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
