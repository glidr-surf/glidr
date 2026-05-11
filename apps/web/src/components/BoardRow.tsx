import { type Board, boardTypeColor } from '../data';

export default function BoardRow({ board }: { board: Board }) {
  return (
    <div className="grid grid-cols-[42px_1fr] gap-md py-md border-b border-border-soft items-start">
      <div>
        <div className={`font-display text-rating ${boardTypeColor[board.type]}`}>
          {board.rating.toFixed(1)}
        </div>
        <div className="font-mono text-micro text-text-light tracking-[0.08em] mt-[2px]">
          {board.type}
        </div>
      </div>
      <div>
        <div className="font-display text-[15px] tracking-[0.5px] leading-[1.1]">
          {board.name}
        </div>
        <div className="text-body-xs text-text-light mt-[1px]">{board.shaper}</div>
        <div className="text-body-xs text-text-mid italic mt-xs line-clamp-2">
          {board.review}
        </div>
        <div className="flex justify-between items-center mt-xs">
          <span className="text-[10px] text-text-light">{board.user}</span>
          <span className={`font-mono text-micro tracking-[0.03em] ${board.buyAgain ? 'text-green' : 'text-red'}`}>
            {board.buyAgain ? '↺ YES' : '✗ NO'}
          </span>
        </div>
      </div>
    </div>
  );
}
