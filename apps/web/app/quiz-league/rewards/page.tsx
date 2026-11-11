'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChampionTrophy } from '@/app/components/quiz-league/trophies/ChampionTrophy';
import {
  Award,
  Trophy,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface RewardItem {
  id: string;
  weekNumber: number;
  weekTitle: string;
  tokenId?: string | null;
  tokenUri?: string | null;
  txHash?: string | null;
  status: 'PENDING' | 'PROCESSING' | 'MINTED' | 'FAILED';
  network: string;
  chainId: number;
  mintedAt?: string | null;
  isCurrentUserWinner: boolean;
  winner: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string | null;
    walletAddress: string;
    shortenedWallet: string;
  };
  explorerUrl?: string | null;
}

export default function QuizLeagueRewardsPage() {
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRewards = () => {
    setLoading(true);
    fetch('/api/quiz-league/rewards')
      .then((res) => res.json())
      .then((json) => {
        if (json.rewards) setRewards(json.rewards);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const latestReward = rewards[0];

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272A] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#F5C451] uppercase font-bold tracking-wider">
            <Award className="w-4 h-4 text-amber-400" />
            <span>On-Chain Championship Rewards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
            Gnosis NFT Trophy Gallery
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Weekly winners receive a gasless ERC-721 Championship Trophy NFT minted to their EVM wallet on Gnosis Chain.
          </p>
        </div>

        <button
          onClick={fetchRewards}
          className="p-2.5 rounded-xl bg-[#18181B] border border-[#27272A] text-zinc-400 hover:text-white transition-colors self-start sm:self-auto cursor-pointer"
          title="Refresh Rewards"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Featured Weekly Champion Showcase */}
      {latestReward && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111114] via-[#16141a] to-[#1c181f] border border-amber-500/40 p-6 sm:p-10 shadow-2xl"
        >
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Info */}
            <div className="md:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>WEEK {latestReward.weekNumber} OFFICIAL CHAMPION</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {latestReward.winner.name}
                </h2>
                <span className="text-xs font-mono text-zinc-400 block mt-1">
                  Recipient Wallet: <strong className="text-zinc-200">{latestReward.winner.shortenedWallet}</strong>
                </span>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-3 font-mono text-xs">
                {latestReward.status === 'MINTED' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ON-CHAIN VERIFIED
                  </span>
                ) : latestReward.status === 'PROCESSING' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/30 font-bold animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> MINTING IN PROGRESS
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                    <Clock className="w-3.5 h-3.5" /> PENDING DISPATCH
                  </span>
                )}

                <span className="text-zinc-500">Token ID #{latestReward.tokenId || '1001'}</span>
              </div>

              {/* Links */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {latestReward.explorerUrl ? (
                  <a
                    href={latestReward.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-violet-600/30 cursor-pointer"
                  >
                    <span>View on GnosisScan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs font-mono text-zinc-400">
                    Blockchain transaction confirmed on Gnosis Chain.
                  </span>
                )}
                <Link
                  href="/quiz-league/leaderboard"
                  className="px-4 py-2.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-zinc-300 text-xs font-semibold border border-[#27272A]"
                >
                  View Final Standings
                </Link>
              </div>
            </div>

            {/* Right Trophy Artwork */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <ChampionTrophy size={190} glow={true} />
              <span className="text-xs font-mono font-bold text-amber-400 tracking-wider uppercase mt-2">
                Gnosis ERC-721 #ETHSHALA-CUP
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Rewards Archive Table */}
      <div className="bg-[#111114] border border-[#27272A] rounded-3xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Hall of Weekly Champions
        </h3>

        {rewards.length === 0 ? (
          <div className="text-center py-8 text-xs font-mono text-zinc-500">
            No weekly champions recorded yet. Compete in this week's active tournament!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((r) => (
              <div
                key={r.id}
                className="bg-[#18181B] border border-[#27272A] rounded-2xl p-5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <ChampionTrophy size={50} glow={false} />
                  <div>
                    <span className="text-[11px] font-mono text-amber-400 font-bold block">
                      Week {r.weekNumber} Winner
                    </span>
                    <h4 className="text-sm font-bold text-white">{r.winner.name}</h4>
                    <span className="text-[10px] font-mono text-zinc-500">{r.winner.shortenedWallet}</span>
                  </div>
                </div>

                <div className="text-right space-y-1.5">
                  <span className="inline-block text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {r.status}
                  </span>
                  {r.explorerUrl && (
                    <a
                      href={r.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-violet-400 hover:underline flex items-center justify-end gap-1"
                    >
                      Tx Hash <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blockchain Protocol Details */}
      <div className="bg-[#111114] border border-[#27272A] rounded-3xl p-6 sm:p-8 space-y-4 font-mono text-xs text-zinc-400">
        <h4 className="text-white font-bold font-sans text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Gnosis Chain Smart Contract Specification
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-3">
            <span className="text-zinc-500 text-[10px] block">STANDARD</span>
            <span className="text-white font-bold block mt-0.5">ERC-721 URI Storage</span>
          </div>
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-3">
            <span className="text-zinc-500 text-[10px] block">CHAIN ID</span>
            <span className="text-white font-bold block mt-0.5">100 (Gnosis Mainnet)</span>
          </div>
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-3">
            <span className="text-zinc-500 text-[10px] block">GAS SUBSIDY</span>
            <span className="text-emerald-400 font-bold block mt-0.5">100% Sponsored (Gasless)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
