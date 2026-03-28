"use client";

import dynamic from 'next/dynamic';

const GameCanvas = dynamic(() => import('@/components/GameCanvas'), { 
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full text-center">
       <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-6 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]"></div>
       <span className="text-xl font-black text-pink-500 tracking-[0.2em] uppercase animate-pulse">Loading Arcade Engine...</span>
    </div>
  )
});

export default function Play() {
  return (
    <main className="flex-1 flex flex-col min-h-[calc(100vh-80px)] bg-[#020617] relative overflow-hidden">
      {/* Immersive Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(236,72,153,0.1),_transparent_60%)]"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]"></div>
      
      <div className="relative z-10 flex-1 flex flex-col">
        <GameCanvas />
      </div>
    </main>
  );
}
