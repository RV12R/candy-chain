"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface LeaderboardEntry {
  wallet_address: string;
  max_score: number;
  rank: number;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      // Fallback data for MVP if Supabase is not configured
      const mockData = [
        { wallet_address: '0x71C...3E4', max_score: 15420, rank: 1 },
        { wallet_address: '0x3A2...9F1', max_score: 12850, rank: 2 },
        { wallet_address: '0xF91...1B2', max_score: 11200, rank: 3 },
        { wallet_address: '0x123...456', max_score: 9800, rank: 4 },
        { wallet_address: '0xABC...DEF', max_score: 8500, rank: 5 },
      ];

      try {
        const { data } = await supabase
          .from('daily_leaderboard')
          .select('*')
          .limit(10);
        
        if (data && data.length > 0) {
          setEntries(data as LeaderboardEntry[]);
        } else {
          setEntries(mockData as LeaderboardEntry[]);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_e) {
        setEntries(mockData as LeaderboardEntry[]);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
          HALL OF FAME
        </h1>
        <p className="text-slate-400 font-bold tracking-[0.3em] uppercase text-sm">Daily Top Performers</p>
      </div>
      
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-3xl blur opacity-20"></div>
        
        <div className="relative bg-slate-950 border border-white/5 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="grid grid-cols-12 gap-4 p-6 border-b border-white/5 bg-white/5 text-pink-500 font-black text-xs tracking-widest uppercase">
            <div className="col-span-2 text-center">#</div>
            <div className="col-span-7 px-4">Warrior</div>
            <div className="col-span-3 text-right">Score</div>
          </div>
          
          <div className="divide-y divide-white/5">
            {loading ? (
              <div className="p-20 text-center text-slate-500 font-bold animate-pulse">SYNCING WITH BASE BLOCKCHAIN...</div>
            ) : (
              entries.map((entry, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-white/5 transition-colors group/row">
                  <div className={`col-span-2 text-center font-black text-2xl ${i < 3 ? 'text-cyan-400' : 'text-slate-600'}`}>
                    {entry.rank || i + 1}
                  </div>
                  <div className="col-span-7 px-4 font-mono text-slate-300 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${i < 3 ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-700'}`}></div>
                    {entry.wallet_address}
                  </div>
                  <div className="col-span-3 text-right font-black text-xl text-white group-hover/row:text-pink-500 transition-colors">
                    {entry.max_score.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-pink-500/5 to-purple-500/5 border border-pink-500/10 text-center">
        <p className="text-slate-400 text-sm font-medium">
          The top 3 players every 24h receive <span className="text-pink-500 font-bold">100 $CRUSH</span>.
          <br />Snapshot taken daily at 00:00 UTC.
        </p>
      </div>
    </main>
  );
}
