'use client';

import React, { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Coins, Copy, Check, ExternalLink, ShieldCheck, Wallet, ArrowUpRight, Plus, Flame, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

interface WalletCardsProps {
  coinBalance: number;
  totalEarned: number;
  totalSpent: number;
  onOpenTopUp: () => void;
}

export function WalletCards({ coinBalance, totalEarned, totalSpent, onOpenTopUp }: WalletCardsProps) {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncatedAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : 'Not connected';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 1. Main Coin Balance Card */}
      <div className="relative rounded-2xl border-2 border-[#111] dark:border-white/20 bg-[#fcfbf7] dark:bg-[#0c1814] p-6 shadow-[5px_5px_0px_#f8bd36] flex flex-col justify-between overflow-hidden">
        {/* Subtle decorative stamp */}
        <div className="absolute top-3 right-4 opacity-15 pointer-events-none">
          <Coins size={80} className="text-[#f8bd36]" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f8bd36] animate-pulse" />
              Available Balance
            </span>
            <span className="px-2 py-0.5 rounded bg-[#ffd359]/30 text-amber-900 dark:text-amber-300 font-extrabold text-[10px] uppercase tracking-wider">
              ESHC Token
            </span>
          </div>

          <div className="my-2 flex items-baseline gap-2">
            <h2 className="text-4xl sm:text-5xl font-black text-[#111] dark:text-white tracking-tight">
              {coinBalance.toLocaleString()}
            </h2>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400">ESHC</span>
          </div>

          <p className="text-xs text-muted-foreground font-medium">
            Spend coins on avatar frames, custom theme borders, and shop items.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenTopUp}
            className="flex-1 min-h-[42px] px-4 rounded-xl bg-[#064a3a] hover:bg-[#043328] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Top-Up Coins
          </button>
          <Link
            href="/dashboard/marketplace"
            className="min-h-[42px] px-3.5 rounded-xl border-2 border-border bg-card hover:bg-accent text-foreground font-bold text-xs transition-colors flex items-center justify-center gap-1"
          >
            Store <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* 2. Connected Web3 Wallet Card */}
      <div className="relative rounded-2xl border-2 border-[#111] dark:border-white/20 bg-card p-6 shadow-[5px_5px_0px_#0e7955] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <Wallet size={14} className="text-[#0e7955]" />
              Web3 Wallet
            </span>
            <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] uppercase tracking-wider ${
              isConnected ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'
            }`}>
              {isConnected ? (chain?.name || 'Base Connected') : 'Disconnected'}
            </span>
          </div>

          {isConnected ? (
            <div className="my-2">
              <div className="flex items-center gap-2 bg-muted/60 border border-border rounded-xl p-3">
                <span className="font-mono text-sm font-bold text-foreground select-all">
                  {truncatedAddress}
                </span>
                <button
                  onClick={handleCopy}
                  className="ml-auto p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Copy full address"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
                <a
                  href={`https://basescan.org/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
                  title="View on Basescan"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                Network: <span className="font-semibold text-foreground">{chain?.name || 'Base'}</span> (Chain ID: {chain?.id || 8453})
              </p>
            </div>
          ) : (
            <div className="my-2">
              <p className="text-sm font-bold text-foreground">No Web3 wallet connected</p>
              <p className="text-xs text-muted-foreground mt-1">
                Connect your browser wallet (MetaMask, Coinbase, Rainbow) to verify on-chain Base credentials.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-2">
          <ConnectButton.Custom>
            {({ openConnectModal, account, chain, mounted }) => {
              if (!mounted || !account) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="w-full py-2.5 px-4 rounded-xl border-2 border-[#111] dark:border-white/20 bg-white dark:bg-card text-[#111] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Wallet size={15} /> Connect Wallet
                  </button>
                );
              }
              return (
                <button
                  onClick={() => disconnect()}
                  className="w-full py-2 px-3 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Disconnect Wallet
                </button>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>

      {/* 3. Earn & Economy Summary Card */}
      <div className="relative rounded-2xl border-2 border-[#111] dark:border-white/20 bg-card p-6 shadow-[5px_5px_0px_#111] dark:shadow-[5px_5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-primary" />
              Coin Activity
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-2">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Earned</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">+{totalEarned}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Spent</span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400">-{totalSpent}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
          <Link
            href="/quiz-league"
            className="flex-1 py-2 px-3 rounded-lg bg-muted hover:bg-accent text-foreground font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5"
          >
            <Flame size={13} className="text-amber-500" /> Quizzes
          </Link>
          <Link
            href="/dashboard/arcade"
            className="flex-1 py-2 px-3 rounded-lg bg-muted hover:bg-accent text-foreground font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5"
          >
            <Gamepad2 size={13} className="text-primary" /> Arcade
          </Link>
        </div>
      </div>
    </div>
  );
}
