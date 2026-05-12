import { type Board, boardTypeColor } from '../data';

const typeBgClass: Record<string, string> = {
  'text-red': 'bg-red/10',
  'text-yellow': 'bg-yellow/15',
  'text-blue': 'bg-blue/10',
  'text-green': 'bg-green/10',
};

function SurferRating({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="text-[11px] leading-none whitespace-nowrap">
      {'🏄'.repeat(full)}
      <span className="opacity-20">{'🏄'.repeat(5 - full)}</span>
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const color = boardTypeColor[type as keyof typeof boardTypeColor] || 'text-text-light';
  return (
    <span className={`font-mono text-[0.6875rem] tracking-[0.1em] px-[6px] py-[1px] ${color} ${typeBgClass[color] || ''}`}>
      {type}
    </span>
  );
}

export default function BoardRow({ board }: { board: Board }) {
  return (
    <div className="group grid grid-cols-[60px_1fr] lg:grid-cols-[72px_56px_1fr] gap-md lg:gap-lg py-lg border-b border-border-soft items-start transition-colors hover:bg-[#EDE1C5]/40">
      <div className="w-[60px] h-[80px] lg:w-[72px] lg:h-[90px] overflow-hidden bg-[#E8DCC4] border border-border-soft">
        <img
          src={board.image}
          alt={board.name}
          className="w-full h-full object-cover object-top mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Desktop: dedicated rating column */}
      <div className="hidden lg:block">
        <div className={`font-display text-rating ${boardTypeColor[board.type]}`}>
          {board.rating.toFixed(1)}
        </div>
        <div className="mt-[2px]"><SurferRating rating={board.rating} /></div>
        <div className="mt-[3px]"><TypeBadge type={board.type} /></div>
      </div>

      <div>
        <div className="font-display text-display-s tracking-[0.5px]">
          {board.name}
        </div>
        <div className="text-body-xs text-text-light mt-[1px]">{board.shaper}</div>

        {/* Mobile: rating row inline */}
        <div className="flex items-center gap-sm mt-xs lg:hidden">
          <span className={`font-display text-[1.5rem] leading-none ${boardTypeColor[board.type]}`}>
            {board.rating.toFixed(1)}
          </span>
          <SurferRating rating={board.rating} />
          <TypeBadge type={board.type} />
        </div>

        <div className="text-body-xs text-text-mid italic mt-xs line-clamp-2">
          {board.review}
        </div>
        <div className="mt-xs">
          <span className="font-mono text-micro text-text-light tracking-[0.03em]">@{board.user}</span>
        </div>
      </div>
    </div>
  );
}
