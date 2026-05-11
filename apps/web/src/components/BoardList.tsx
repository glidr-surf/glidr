import { boards } from '../data';
import BoardRow from './BoardRow';

export default function BoardList() {
  return (
    <div className="min-h-0">
      <div className="font-display text-[14px] tracking-[3px] pb-[10px] border-b-2 border-border">
        LATEST RATINGS
      </div>
      {boards.map((board) => (
        <BoardRow key={board.name} board={board} />
      ))}
    </div>
  );
}
