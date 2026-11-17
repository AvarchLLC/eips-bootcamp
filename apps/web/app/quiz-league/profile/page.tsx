'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { TrophyRenderer } from '@/app/components/quiz-league/trophies/TrophyRenderer';
import {
  User,
  Wallet,
  Flame,
  Trophy,
  Award,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ProfileData {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    walletAddress?: string | null;
    shortenedWallet?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
  };
  stats: {
    totalPoints: number;
    totalQuizzes: number;
    highestRank: string;
    currentStreak: number;
    longestStreak: number;
  };
  badges: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    unlocked: boolean;
    progress: number;
  }>;
  nfts: Array<{
    id: string;
    weekNumber: number;
    weekTitle: string;
    tokenId?: string | null;
    tokenUri?: string | null;
    txHash?: string | null;
    status: string;
    network: string;
    mintedAt?: string | null;
    explorerUrl?: string | null;
  }>;
  history: Array<{
    weekId: string;
    weekNumber: number;
    weekTitle: string;
    points: number;
    quizzesCompleted: number;
    rank: number;
    streak: number;
    startDate: string;
    endDate: string;
  }>;
}

export default function QuizLeagueProfile() {
  const { address, isConnected } = useAccount();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncingWallet, setSyncingWallet] = useState(false);

  const fetchProfile = () => {
    fetch('/api/quiz-league/profile')
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) setData(json);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Auto-sync connected EVM wallet to DB user record
  useEffect(() => {
    if (isConnected && address && data?.user && data.user.walletAddress?.toLowerCase() !== address.toLowerCase()) {
      setSyncingWallet(true);
      fetch('/api/quiz-league/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      })
        .then((res) => res.json())
        .then((resp) => {
          if (resp.success) fetchProfile();
        })
        .catch((e) => console.error('Failed to sync wallet:', e))
        .finally(() => setSyncingWallet(false));
    }
  }, [isConnected, address, data?.user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-[#A1A1AA]">Loading Competitor Profile...</span>
      </div>
    );
  }

  const u = data?.user;
  const stats = data?.stats;
  const badges = data?.badges || [];
  const nfts = data?.nfts || [];
  const history = data?.history || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 1. Profile Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111114] via-[#141418] to-[#18181B] border border-[#27272A] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-800 border-2 border-violet-500/40 shadow-xl flex-shrink-0">
              {u?.avatarUrl ? (
                <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-xl text-violet-400 bg-violet-950/40">
                  {u?.name?.slice(0, 2).toUpperCase() || 'ETH'}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{u?.name || 'Competitor'}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-500/10 text-violet-400 border border-violet-500/30">
                  BUILDER
                </span>
              </div>
              <span className="text-xs font-mono text-zinc-400 block">{u?.username}</span>

              {/* Connected Wallet Info */}
              <div className="flex items-center gap-2 pt-1 font-mono text-xs">
                {u?.walletAddress ? (
                  <span className="inline-flex items-center gap-1.5 text-zinc-300 bg-[#09090B] px-3 py-1 rounded-lg border border-[#27272A]">
                    <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{u.shortenedWallet}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-1" />
                  </span>
                ) : (
                  <span className="text-zinc-500 text-xs">No EVM wallet linked for NFT rewards</span>
                )}
              </div>
            </div>
          </div>

          {/* Wallet Connection Button */}
          <div className="self-stretch sm:self-auto flex flex-col items-end gap-2">
            <ConnectButton showBalance={false} />
            {syncingWallet && (
              <span className="text-[10px] font-mono text-violet-400 animate-pulse">
                Syncing wallet with profile...
              </span>
            )}
          </div>
        </div>

        {/* Competition Metrics Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-8 border-t border-[#27272A]/70 mt-6 font-mono text-xs">
          <div className="bg-[#09090B] border border-[#27272A] rounded-xl p-3.5">
            <span className="text-zinc-500 block text-[10px]">TOTAL POINTS</span>
            <span className="text-xl font-black text-amber-400 mt-0.5 block">{stats?.totalPoints || 0} XP</span>
          </div>
          <div className="bg-[#09090B] border border-[#27272A] rounded-xl p-3.5">
            <span className="text-zinc-500 block text-[10px]">QUIZZES COMPLETED</span>
            <span className="text-xl font-black text-white mt-0.5 block">{stats?.totalQuizzes || 0}</span>
          </div>
          <div className="bg-[#09090B] border border-[#27272A] rounded-xl p-3.5">
            <span className="text-zinc-500 block text-[10px]">HIGHEST RANK</span>
            <span className="text-xl font-black text-violet-400 mt-0.5 block">{stats?.highestRank || '-'}</span>
          </div>
          <div className="bg-[#09090B] border border-[#27272A] rounded-xl p-3.5">
            <span className="text-zinc-500 block text-[10px]">CURRENT STREAK</span>
            <span className="text-xl font-black text-violet-400 mt-0.5 block flex items-center gap-1">
              <Flame className="w-4 h-4 fill-violet-400" />
              {stats?.currentStreak || 0}d
            </span>
          </div>
          <div className="bg-[#09090B] border border-[#27272A] rounded-xl p-3.5">
            <span className="text-zinc-500 block text-[10px]">LONGEST STREAK</span>
            <span className="text-xl font-black text-emerald-400 mt-0.5 block">{stats?.longestStreak || 0}d</span>
          </div>
        </div>
      </div>

      {/* 2. Achievement Badges Grid */}
      <div className="bg-[#111114] border border-[#27272A] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Championship Achievements</h3>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {badges.filter((b) => b.unlocked).length} of {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`rounded-2xl border p-5 flex items-center gap-4 transition-all ${
                b.unlocked
                  ? 'bg-[#18181B] border-violet-500/40 shadow-lg shadow-violet-500/5'
                  : 'bg-[#18181B]/40 border-[#27272A] opacity-60'
              }`}
            >
              <TrophyRenderer type={b.type as any} size={64} glow={b.unlocked} />
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{b.title}</h4>
                  {b.unlocked ? (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-500">{b.progress}%</span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 leading-snug">{b.description}</p>
                {!b.unlocked && (
                  <div className="w-full h-1.5 bg-[#09090B] rounded-full overflow-hidden border border-[#27272A] mt-2">
                    <div className="h-full bg-violet-600 rounded-full" style={{ width: `${b.progress}%` }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. NFT Rewards Showcase */}
      <div className="bg-[#111114] border border-[#27272A] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Championship NFT Trophy Collection</h3>
          </div>
          <Link href="/quiz-league/rewards" className="text-xs text-violet-400 hover:underline font-semibold">
            View All Season Rewards →
          </Link>
        </div>

        {nfts.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-2xl bg-[#09090B] border border-[#27272A] space-y-3">
            <Trophy className="w-10 h-10 text-zinc-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Championship NFTs Yet</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Finish 1st in any weekly leaderboard to win an exclusive ERC-721 Championship Trophy NFT minted to your connected wallet on Gnosis Chain.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {nfts.map((nft) => (
              <div
                key={nft.id}
                className="rounded-2xl border border-amber-500/40 bg-gradient-to-b from-[#18181B] to-[#111114] p-5 text-center space-y-4"
              >
                <TrophyRenderer type="CHAMPION" size={120} glow={true} className="mx-auto" />
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                    Week {nft.weekNumber} Champion
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{nft.weekTitle}</h4>
                </div>
                <div className="pt-2 border-t border-[#27272A] flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Token #{nft.tokenId}</span>
                  {nft.explorerUrl ? (
                    <a
                      href={nft.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-400 hover:text-violet-300 flex items-center gap-1 font-semibold"
                    >
                      GnosisScan <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-emerald-400 font-bold">MINTED</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Weekly Participation History */}
      <div className="bg-[#111114] border border-[#27272A] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-bold text-white">Competition Season History</h3>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-6 text-xs text-zinc-500 font-mono">
            No past tournament history recorded. Play today's quiz to enter Week 1!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#27272A] text-zinc-500 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-bold">Week</th>
                  <th className="py-3 px-4 font-bold">Tournament</th>
                  <th className="py-3 px-4 font-bold text-center">Quizzes</th>
                  <th className="py-3 px-4 font-bold text-center">Final Rank</th>
                  <th className="py-3 px-4 font-bold text-right">Points Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]/60">
                {history.map((h) => (
                  <tr key={h.weekId} className="hover:bg-[#18181B]/50 transition-colors text-zinc-300">
                    <td className="py-3.5 px-4 font-bold text-white">Week {h.weekNumber}</td>
                    <td className="py-3.5 px-4 font-sans font-medium text-zinc-200">{h.weekTitle}</td>
                    <td className="py-3.5 px-4 text-center">{h.quizzesCompleted} / 7</td>
                    <td className="py-3.5 px-4 text-center font-bold text-amber-400">#{h.rank}</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-white">+{h.points} XP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

