"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState } from 'react';

export function SimpleConnectButton() {
  const [showModal, setShowModal] = useState(false);
  const { address, isConnected } = useAccount();
  const { connectors, connect, error } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button 
        onClick={() => disconnect()}
        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-sm tracking-wider transition-colors border border-slate-700 flex items-center gap-2"
        title="Click to Disconnect"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        {address.slice(0, 6)}...{address.slice(-4)}
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold text-sm tracking-wider transition-colors shadow-[0_0_20px_rgba(236,72,153,0.4)] transform hover:scale-105"
      >
        Connect Wallet
      </button>

      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4" 
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-slate-950 border border-slate-800 p-8 rounded-3xl max-w-sm w-full shadow-2xl relative" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-5 text-slate-500 hover:text-white font-black text-xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-black text-white mb-6 text-center tracking-widest uppercase">Select Wallet</h3>
            <div className="flex flex-col gap-3">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector });
                    setShowModal(false);
                  }}
                  className="w-full px-6 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-pink-500 text-slate-200 rounded-2xl font-bold text-sm tracking-wider transition-all flex items-center justify-between group"
                >
                  <span className="group-hover:text-white">{connector.name}</span>
                  <div className="w-2 h-2 rounded-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(236,72,153,0.8)]"></div>
                </button>
              ))}
            </div>
            {error && <span className="text-pink-500 text-xs mt-6 block text-center font-bold">{error.shortMessage || error.message}</span>}
          </div>
        </div>
      )}
    </>
  );
}
