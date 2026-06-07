import type { LandingStats } from '@glidr/data';

const fmt = (n: number | undefined) => (n == null ? '—' : n.toLocaleString());

/**
 * 3-up divided stat row, sits under the board fan on the right-hand side.
 * Numbers in ink/red/blue — never yellow (fails contrast on the cream bg).
 */
export default function StatStrip({
  stats,
  className = '',
}: {
  stats: LandingStats | null;
  className?: string;
}) {
  const cells = [
    { value: stats?.totalOpinions, label: 'OPINIONS', color: 'text-red' },
    { value: stats?.totalShapers, label: 'SHAPERS', color: 'text-text' },
    { value: stats?.magicBoards, label: 'MAGIC', color: 'text-blue' },
  ];

  return (
    <div className={`flex ${className}`}>
      {cells.map((c, i) => (
        <div
          key={c.label}
          className={`flex-1 text-center py-lg ${i < cells.length - 1 ? 'border-r border-border-soft' : ''}`}
        >
          <div className={`font-display text-display-m leading-none ${c.color}`}>{fmt(c.value)}</div>
          <div className="font-mono text-micro tracking-[0.08em] text-text-mid mt-xs">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
