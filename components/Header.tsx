import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between p-4 px-8 border-b border-pink-500/10 backdrop-blur-xl bg-slate-950/80">
      <div className="flex items-center gap-10">
        <Link href="/" className="text-2xl font-black italic bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent hover:scale-105 transition-transform pr-2">
          CANDY CHAIN
        </Link>
        <nav className="hidden md:flex gap-8 font-bold text-sm uppercase tracking-widest text-slate-400">
          <Link href="/play" prefetch={false} className="hover:text-pink-500 transition-colors">Play</Link>
          <Link href="/leaderboard" prefetch={false} className="hover:text-pink-500 transition-colors">Leaderboard</Link>
          <Link href="/prizes" prefetch={false} className="hover:text-pink-500 transition-colors">Prizes</Link>
        </nav>
      </div>
    </header>
  );
}
