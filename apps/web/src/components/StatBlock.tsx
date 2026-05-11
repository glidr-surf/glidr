import { type Stat } from '../data';

const bgClass = {
  red: 'bg-red text-bg',
  yellow: 'bg-yellow text-text',
  blue: 'bg-blue text-bg',
} as const;

export default function StatBlock({ stat }: { stat: Stat }) {
  return (
    <div className={`p-md ${bgClass[stat.color]}`}>
      <div className="font-display text-display-m leading-none">{stat.value}</div>
      <div className="font-mono text-micro tracking-[0.08em] opacity-70 mt-[2px]">
        {stat.label}
      </div>
    </div>
  );
}
