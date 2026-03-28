"use client";

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { formatUnits } from 'viem';
import { SimpleConnectButton } from '@/components/SimpleConnectButton';

// Mock ABI for PrizeVault
const PRIZE_VAULT_ABI = [
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "claimableAmounts",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

import { WagmiConfigProvider } from '@/components/WagmiConfigProvider';

// In a real app, this would be an environment variable
const PRIZE_VAULT_ADDRESS = '0x0000000000000000000000000000000000000000'; 

function PrizesDashboard() {
  const { address, isConnected } = useAccount();
  
  const { data: claimableAmount, refetch } = useReadContract({
    address: PRIZE_VAULT_ADDRESS as `0x${string}`,
    abi: PRIZE_VAULT_ABI,
    functionName: 'claimableAmounts',
    args: [address as `0x${string}`],
    query: {
      enabled: isConnected && !!address,
    }
  });

  const { writeContract, isPending } = useWriteContract();

  const handleClaim = async () => {
    if (!isConnected) return;
    writeContract({
      address: PRIZE_VAULT_ADDRESS as `0x${string}`,
      abi: PRIZE_VAULT_ABI,
      functionName: 'claim',
    });
  };

  const amount = claimableAmount ? parseFloat(formatUnits(claimableAmount, 18)) : 0;

  return (
    <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent uppercase">
          Vault Rewards
        </h1>
        <p className="text-slate-400 font-bold tracking-[0.3em] uppercase text-sm">Your On-Chain Earnings</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 h-full">
        {/* Claim Card */}
        <div className="relative group h-full">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center h-full">
            <h2 className="text-xs font-black tracking-[0.2em] text-cyan-400 uppercase mb-8">Available to Claim</h2>
            
            <div className="flex items-baseline gap-2 mb-12">
              <span className="text-7xl font-black text-white tracking-tighter">{amount}</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">$CRUSH</span>
            </div>

            {!isConnected ? (
              <div className="flex flex-col items-center gap-4">
                <SimpleConnectButton />
                <p className="text-slate-500 text-xs">Connect to Base Sepolia to claim rewards</p>
              </div>
            ) : (
              <button 
                onClick={handleClaim}
                disabled={amount <= 0 || isPending}
                className="w-full py-5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-2xl font-black text-xl transition-all shadow-xl disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isPending ? 'TRANSACTION PENDING...' : 'CLAIM NOW'}
              </button>
            )}

            <div className="mt-10 flex items-center gap-2 text-slate-500 text-[10px] font-bold tracking-widest uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
              Secured by Smart Contract
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/30 border border-white/5 rounded-3xl p-8">
            <h3 className="text-sm font-black text-pink-500 tracking-widest uppercase mb-4">How it works</h3>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li className="flex gap-3">
                <span className="text-cyan-400 font-black">01</span>
                Rank in the top 3 on the Daily Hall of Fame.
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-black">02</span>
                Rewards are auto-calculated at 00:00 UTC.
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-400 font-black">03</span>
                Claim your $CRUSH directly to your wallet on Base Sepolia.
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-8 flex-1">
             <h3 className="text-sm font-black text-white tracking-widest uppercase mb-2">Tokenomics</h3>
             <p className="text-slate-400 text-xs leading-relaxed font-medium">
               $CRUSH is the native utility token of Candy Chain. It powers future upgrades, cosmetics, and special game modes.
             </p>
             <button className="mt-6 text-cyan-400 text-[10px] font-black tracking-widest uppercase hover:underline">
               View Contract on BaseScan ↗
             </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Prizes() {
  return (
    <WagmiConfigProvider>
      <PrizesDashboard />
    </WagmiConfigProvider>
  );
}
