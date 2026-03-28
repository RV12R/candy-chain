"use client";

import { useEffect, useRef, useState } from 'react';

export default function GameCanvas() {
  const gameRef = useRef<any>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const initPhaser = async () => {
      const { initGame } = await import('@/game/PhaserGame');
      if (!gameRef.current) {
        const game = initGame('phaser-container');
        gameRef.current = game;

        // Listen for score updates from Phaser
        game.events.on('score-updated', (newScore: number) => {
          setScore(newScore);
        });
      }
    };

    initPhaser();

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  const handleSubmitScore = async () => {
    alert(`Submitting score ${score} to Supabase Hall of Fame!`);
    // Real implementation would use supabase.from('game_sessions').insert(...)
  };

  return (
    <div className="flex flex-col items-center justify-start pt-6 sm:pt-12 w-full min-h-[calc(100vh-80px)] bg-[#050507]">
      
      {/* Score Header */}
      <div className="mb-6 flex flex-row items-center justify-between gap-6 bg-slate-900 px-6 py-4 rounded-xl border border-slate-800 w-full max-w-[420px]">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider">SCORE</span>
          <span className="text-2xl font-black text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]">{score}</span>
        </div>
        <button 
          onClick={handleSubmitScore}
          disabled={score === 0}
          className="px-5 py-2.5 bg-pink-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-bold text-sm transition-colors hover:bg-pink-500"
        >
          Submit
        </button>
      </div>

      {/* Game Cabinet */}
      <div className="p-2 sm:p-3 rounded-2xl bg-slate-900 shadow-xl border border-slate-800">
        <div 
          id="phaser-container" 
          className="relative rounded-xl overflow-hidden bg-black touch-none w-full sm:w-[420px] aspect-[2/3]" 
          style={{ touchAction: 'none' }}
        />
      </div>
      
      {/* Footer Instructions */}
      <div className="mt-8 text-center text-slate-600 text-sm font-medium tracking-wide">
        Match 3+ • Create Combos • Reach the Goal
      </div>
    </div>
  );
}
