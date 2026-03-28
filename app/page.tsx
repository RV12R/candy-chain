"use client";

import Link from 'next/link';
import Image from 'next/image';

import { WagmiConfigProvider } from '@/components/WagmiConfigProvider';
import { SimpleConnectButton } from '@/components/SimpleConnectButton';

function HomeContent() {
  return (
    <main className="relative min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center p-6 text-center bg-[#050507]">
      
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Ambient Glowing Orbs */}
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-pink-600/10 blur-[120px] animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-cyan-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>
        
        {/* Perspective Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.07)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_40%,#000_20%,transparent_100%)]"></div>
      </div>
      
      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto py-10 mt-10">
        
        {/* Simple Graphic Banner - Alpha gradient masked to perfectly erase the generation artifact squares */}
        <div className="flex justify-center items-center gap-4 mb-10">
           <Image src="/assets/candy_0.png" width={60} height={60} alt="Candy" className="animate-bounce-delayed drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" style={{ maskImage: "radial-gradient(circle closest-side, black 70%, transparent 100%)", WebkitMaskImage: "radial-gradient(circle closest-side, black 70%, transparent 100%)" }} />
           <Image src="/assets/special_bomb.png" width={80} height={80} alt="Bomb" className="animate-bounce-slow drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] mx-2 translate-y-2" style={{ maskImage: "radial-gradient(circle closest-side, black 70%, transparent 100%)", WebkitMaskImage: "radial-gradient(circle closest-side, black 70%, transparent 100%)" }} />
           <Image src="/assets/candy_2.png" width={60} height={60} alt="Candy" className="animate-bounce-slower drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" style={{ maskImage: "radial-gradient(circle closest-side, black 70%, transparent 100%)", WebkitMaskImage: "radial-gradient(circle closest-side, black 70%, transparent 100%)" }} />
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 text-white tracking-tight">
           CANDY <span className="text-pink-500">CHAIN</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 font-medium max-w-xl mx-auto mb-12 leading-relaxed">
          The ultimate Web3 match-3 puzzle. Clear objectives, trigger combos, and claim on-chain rewards.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-16 px-4">
          <Link href="/play" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-10 py-4 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold text-lg tracking-wider transition-colors shadow-[0_0_20px_rgba(236,72,153,0.4)]">
              PLAY ARCADE
            </button>
          </Link>
          
          <Link href="/leaderboard" className="w-full sm:w-auto px-10 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-lg tracking-wider transition-colors border border-slate-700">
            LEADERBOARDS
          </Link>
        </div>

        {/* Wallet Connection */}
        <div className="flex justify-center mb-8">
           <SimpleConnectButton />
        </div>

        {/* Clean Status Footer */}
        <div className="flex items-center justify-center gap-3 px-6 py-2 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           BASE SEPOLIA ONLINE
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <WagmiConfigProvider>
      <HomeContent />
    </WagmiConfigProvider>
  );
}
