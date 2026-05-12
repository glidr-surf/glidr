import { boards } from '../data';
import BoardRow from './BoardRow';

export default function BoardList() {
  return (
    <div className="flex flex-col min-h-0 h-full">
      <div className="shrink-0 font-display text-display-s tracking-[3px] pb-md border-b-2 border-border flex items-center gap-sm">
        <span className="w-[3px] h-[1.1em] bg-red inline-block" />
        LATEST OPINIONS
      </div>
      <div className="max-h-[360px] overflow-y-auto lg:max-h-none lg:flex-1 lg:min-h-0">
        {boards.map((board) => (
          <BoardRow key={board.name} board={board} />
        ))}
      </div>
    </div>
  );
}
