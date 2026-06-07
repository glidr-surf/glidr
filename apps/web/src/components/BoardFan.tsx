import { useEffect, useRef, useState } from 'react';
import { getBoards } from '@glidr/data';
import type { Board } from '@glidr/data';
import { supabase } from '../lib/supabase';
import Stars from './Stars';

/** Resting position of each board in the 300×340 cluster box (scaled up on lg). */
const SLOTS = [
  { w: 144, h: 188, left: 92, top: 64, rot: -4, d: 1, z: 30 }, // front
  { w: 130, h: 170, left: 12, top: 92, rot: -9, d: 0.62, z: 20 }, // mid
  { w: 120, h: 156, left: 124, top: 150, rot: 7, d: 0.38, z: 10 }, // back
];

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

function pickThree(all: Board[]): Board[] {
  const withImg = all.filter((b) => b.imageUrl);
  withImg.sort((a, b) => b.rating - a.rating || b.opinionCount - a.opinionCount);
  return withImg.slice(0, 3);
}

export default function BoardFan() {
  const [boards, setBoards] = useState<Board[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getBoards(supabase)
      .then((all) => setBoards(pickThree(all)))
      .catch(() => setBoards([]));
  }, []);

  // Pointer parallax (desktop) / scroll parallax (mobile). Gated on reduced-motion.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || boards.length === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (window.matchMedia('(min-width: 1024px)').matches) {
      const onMove = (e: PointerEvent) => {
        const r = stage.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        stage.style.setProperty('--mx', `${nx * 20}px`);
        stage.style.setProperty('--my', `${ny * 20}px`);
      };
      const onLeave = () => {
        stage.style.setProperty('--mx', '0px');
        stage.style.setProperty('--my', '0px');
      };
      stage.addEventListener('pointermove', onMove);
      stage.addEventListener('pointerleave', onLeave);
      return () => {
        stage.removeEventListener('pointermove', onMove);
        stage.removeEventListener('pointerleave', onLeave);
      };
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = stage.getBoundingClientRect();
        const prog = (window.innerHeight / 2 - (r.top + r.height / 2)) / window.innerHeight;
        stage.style.setProperty('--my', `${clamp(prog * 20, -12, 12)}px`);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [boards.length]);

  const front = boards[0];

  return (
    <div
      ref={stageRef}
      className="relative flex-1 min-h-[280px] min-w-0 flex items-center justify-center w-full overflow-hidden"
    >
      <div className="fan-enter relative w-[300px] h-[340px] scale-[1.15] lg:scale-[1.85] origin-center">
        {boards.map((board, i) => {
          const s = SLOTS[i];
          if (!s) return null;
          return (
            <div
              key={board.id}
              className="board-slot absolute"
              style={{ left: s.left, top: s.top, width: s.w, height: s.h, zIndex: s.z, ['--d' as string]: s.d }}
            >
              <div
                className="board-card ink-shadow relative w-full h-full border-[2.5px] border-border bg-[#E8DCC4] overflow-hidden"
                style={{ ['--rot' as string]: `${s.rot}deg` }}
              >
                {board.imageUrl ? (
                  <img
                    src={board.imageUrl}
                    alt={board.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full bg-blue flex items-center justify-center">
                    <span className="font-display text-display-m text-bg">{board.name.charAt(0)}</span>
                  </div>
                )}

                {i === 0 && (
                  <div className="absolute bottom-0 inset-x-0 bg-[#2A2720] px-md py-sm">
                    <div className="font-display text-display-s leading-none tracking-[0.5px] text-bg truncate">
                      {board.name}
                    </div>
                    <div className="flex items-center gap-sm mt-[3px]">
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-yellow truncate">
                        {board.shaper}
                      </span>
                      <Stars rating={board.rating} size={12} color="#FFD000" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Rating medallion — yellow fill (legible: ink content on yellow) */}
        {front && (
          <div
            className="board-slot absolute"
            style={{ left: 214, top: 24, zIndex: 40, ['--d' as string]: 1.25 }}
          >
            <div
              className="ink-shadow flex flex-col items-center justify-center w-[68px] h-[68px] rounded-full border-[3px] border-border bg-yellow"
              style={{ transform: 'rotate(-8deg)' }}
            >
              <span className="font-display text-[1.65rem] leading-none text-text">
                {front.rating.toFixed(1)}
              </span>
              <Stars rating={front.rating} size={9} color="#1A1714" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
