import { stats } from '../data';
import StatBlock from './StatBlock';

export default function StatStack() {
  return (
    <div className="border-2 border-border flex flex-row lg:flex-col lg:w-[120px] shrink-0 [&>*+*]:border-t-0 [&>*+*]:border-l-2 lg:[&>*+*]:border-l-0 lg:[&>*+*]:border-t-2 [&>*+*]:border-border [&>*]:flex-1 lg:[&>*]:flex-none">
      {stats.map((stat) => (
        <StatBlock key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
