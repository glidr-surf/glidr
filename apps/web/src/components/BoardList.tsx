import { boards } from '../data';
import BoardRow from './BoardRow';

export default function BoardList() {
  return (
    <div className="min-h-0">
      <div className="font-display text-display-s tracking-[3px] pb-md border-b-2 border-border">
        LATEST OPINIONS
      </div>
      {boards.map((board) => (
        <BoardRow key={board.name} board={board} />
      ))}
    </div>
  );
}
