import { type Board, boardTypeColor } from '../data';

function SurferRating({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <div className="text-[11px] leading-none mt-[2px] whitespace-nowrap">
      {'🏄'.repeat(full)}
      <span className="opacity-25">{'🏄'.repeat(5 - full)}</span>
    </div>
  );
}

export default function BoardRow({ board }: { board: Board }) {
  return (
    <div className="grid grid-cols-[56px_52px_1fr] gap-lg py-lg border-b border-border-soft items-start">
      <img
        src={board.image}
        alt={board.name}
        className="w-[56px] h-[56px] object-cover object-top border border-border"
      />
      <div>
        <div className={`font-display text-rating ${boardTypeColor[board.type]}`}>
          {board.rating.toFixed(1)}
        </div>
        <SurferRating rating={board.rating} />
        <div className="font-mono text-micro text-text-light tracking-[0.08em] mt-[2px]">
          {board.type}
        </div>
      </div>
      <div>
        <div className="font-display text-display-s tracking-[0.5px]">
          {board.name}
        </div>
        <div className="text-body-xs text-text-light mt-[1px]">{board.shaper}</div>
        <div className="text-body-xs text-text-mid italic mt-xs line-clamp-2">
          {board.review}
        </div>
        <div className="mt-xs">
          <span className="font-mono text-micro text-text-light tracking-[0.03em]">{board.user}</span>
        </div>
      </div>
    </div>
  );
}
