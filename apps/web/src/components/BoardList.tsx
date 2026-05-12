import { useState, useEffect } from 'react';
import { getBoards, getOpinions } from '@glidr/data';
import type { Board } from '@glidr/data';
import { supabase } from '../lib/supabase';
import BoardRow from './BoardRow';

export default function BoardList() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [reviews, setReviews] = useState<Map<string, { text: string; username: string }>>(new Map());

  useEffect(() => {
    getBoards(supabase).then(async (fetchedBoards) => {
      setBoards(fetchedBoards);
      const reviewMap = new Map<string, { text: string; username: string }>();
      await Promise.all(
        fetchedBoards.map(async (b) => {
          const ops = await getOpinions(supabase, { boardId: b.id, limit: 1 });
          if (ops.length > 0 && ops[0].text) {
            reviewMap.set(b.id, { text: `"${ops[0].text}"`, username: ops[0].username });
          }
        })
      );
      setReviews(new Map(reviewMap));
    });
  }, []);

  return (
    <div className="flex flex-col min-h-0 h-full">
      <div className="shrink-0 font-display text-display-s tracking-[3px] pb-md border-b-2 border-border flex items-center gap-sm">
        <span className="w-[3px] h-[1.1em] bg-red inline-block" />
        LATEST OPINIONS
      </div>
      <div className="max-h-[360px] overflow-y-auto lg:max-h-none lg:flex-1 lg:min-h-0">
        {boards.map((board) => {
          const rev = reviews.get(board.id);
          return (
            <BoardRow
              key={board.id}
              board={board}
              review={rev?.text}
              user={rev?.username}
            />
          );
        })}
      </div>
    </div>
  );
}
