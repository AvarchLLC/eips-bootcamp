'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChampionTrophy } from '@/app/components/quiz-league/trophies/ChampionTrophy';
import { RunnerUpTrophy } from '@/app/components/quiz-league/trophies/RunnerUpTrophy';
import { ThirdPlaceTrophy } from '@/app/components/quiz-league/trophies/ThirdPlaceTrophy';
import { RankBadge } from '@/app/components/quiz-league/trophies/TrophyRenderer';
import {
  Trophy,
  Flame,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Award,
  Wallet,
  CheckCircle2,
} from 'lucide-react';

interface LeaderboardParticipant {
  userId: string;
  rank: number;
  name: string;
  username: string;
  avatarUrl?: string | null;
  walletAddress?: string | null;
  shortenedWallet?: string | null;
  totalPoints: number;
  quizzesCompleted: number;
  streak: number;
  isCurrentUser: boolean;
}

interface LeaderboardData {
  week: {
    id: string;
    weekNumber: number;
    title: string;
    status: string;
    startDate: string;
    endDate: string;
    nftReward?: {
      tokenId?: string;
      txHash?: string;
      status?: string;
      network?: string;
    } | null;
  };
  availableWeeks: Array<{
    id: string;
    weekNumber: number;
    title: string;
    status: string;
  }>;
  podium: LeaderboardParticipant[];
  rankings: LeaderboardParticipant[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  currentUser?: LeaderboardParticipant | null;
}

export default function QuizLeagueLeaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchLeaderboard = (weekNum?: number | null, searchQuery = '', pageNum = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (weekNum) params.set('week', weekNum.toString());
    if (searchQuery) params.set('search', searchQuery);
    params.set('page', pageNum.toString());
    params.set('limit', '15');

    fetch(`/api/quiz-league/leaderboard?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) {
          setData(json);
          if (selectedWeek === null) setSelectedWeek(json.week.weekNumber);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaderboard(selectedWeek, search, page);
  }, [selectedWeek, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLeaderboard(selectedWeek, search, 1);
  };

  const podium = data?.podium || [];
  const first = podium[0];
  const second = podium[1];
  const third = podium[2];

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Header with Week Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272A] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#F5C451] uppercase font-bold tracking-wider">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Weekly Championship Standings</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
            Championship Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Live rankings calculated from verified daily quiz submissions and participation streaks.
          </p>
        </div>

        {/* Week Switcher Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-mono text-zinc-400">Week:</label>
          <select
            value={selectedWeek || 1}
            onChange={(e) => {
              setSelectedWeek(Number(e.target.value));
              setPage(1);
            }}
            className="bg-[#18181B] text-white text-xs font-mono font-bold border border-[#27272A] rounded-xl px-3.5 py-2.5 outline-none focus:border-violet-500 cursor-pointer"
          >
            {data?.availableWeeks.map((w) => (
              <option key={w.id} value={w.weekNumber}>
                Week {w.weekNumber} ({w.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. Large 3-Person Esports Championship Podium */}
      <div className="relative py-8 px-4 rounded-3xl bg-gradient-to-b from-[#111114] to-[#09090B] border border-[#27272A] overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8">
          <span className="text-xs font-mono font-bold text-amber-400 tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Weekly Podium Leaders
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">Current Tournament Honors</h2>
        </div>

        <div className="flex flex-col md:flex-row items-end justify-center gap-4 sm:gap-6 pt-4 max-w-4xl mx-auto">
          {/* Second Place (Left) */}
          {second && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="w-full md:w-64 flex flex-col items-center order-2 md:order-1"
            >
              <div className="relative mb-3 flex flex-col items-center">
                <RunnerUpTrophy size={110} glow={true} />
                <div className="w-14 h-14 rounded-full border-2 border-slate-300 overflow-hidden bg-zinc-800 -mt-3 shadow-lg">
                  {second.avatarUrl ? (
                    <img src={second.avatarUrl} alt={second.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-sm text-slate-300">
                      {second.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Second Podium Pedestal */}
              <div className="w-full bg-gradient-to-t from-[#18181B] to-[#1e1e24] border-t-2 border-slate-400/60 rounded-2xl p-4 text-center space-y-1.5 shadow-xl h-44 flex flex-col justify-center">
                <span className="text-xs font-mono font-extrabold text-slate-300 tracking-wider">#2 RUNNER UP</span>
                <h4 className="text-sm font-bold text-white truncate px-2">{second.name}</h4>
                <div className="text-xl font-black text-slate-200">{second.totalPoints} <span className="text-xs font-normal text-zinc-400">PTS</span></div>
                <div className="flex items-center justify-center gap-2 font-mono text-[11px] text-zinc-400">
                  <span className="flex items-center gap-0.5 text-violet-400">
                    <Flame className="w-3 h-3 fill-violet-400" /> {second.streak}d
                  </span>
                  <span>•</span>
                  <span>{second.quizzesCompleted} quizzes</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* First Place (Center, Elevated & Larger) */}
          {first && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-full md:w-72 flex flex-col items-center order-1 md:order-2 z-10"
            >
              <div className="relative mb-4 flex flex-col items-center">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                >
                  <ChampionTrophy size={160} glow={true} />
                </motion.div>
                <div className="w-16 h-16 rounded-full border-2 border-amber-400 overflow-hidden bg-zinc-800 -mt-4 shadow-xl ring-4 ring-amber-400/20">
                  {first.avatarUrl ? (
                    <img src={first.avatarUrl} alt={first.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-base text-amber-400">
                      {first.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* First Podium Pedestal */}
              <div className="w-full bg-gradient-to-t from-[#18181B] via-[#221e14] to-[#2a2418] border-t-4 border-amber-400 rounded-2xl p-5 text-center space-y-2 shadow-2xl h-56 flex flex-col justify-center">
                <span className="text-xs font-mono font-extrabold text-amber-400 tracking-wider flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" /> #1 WEEKLY CHAMPION
                </span>
                <h4 className="text-base font-extrabold text-white truncate px-2">{first.name}</h4>
                <div className="text-3xl font-black text-amber-400">{first.totalPoints} <span className="text-xs font-normal text-amber-300/80">XP</span></div>
                <div className="flex items-center justify-center gap-2 font-mono text-xs text-zinc-300">
                  <span className="flex items-center gap-0.5 text-violet-400 font-bold">
                    <Flame className="w-3.5 h-3.5 fill-violet-400" /> {first.streak}d streak
                  </span>
                  <span>•</span>
                  <span>{first.quizzesCompleted} quizzes</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Third Place (Right) */}
          {third && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="w-full md:w-64 flex flex-col items-center order-3"
            >
              <div className="relative mb-3 flex flex-col items-center">
                <ThirdPlaceTrophy size={100} glow={true} />
                <div className="w-14 h-14 rounded-full border-2 border-amber-600 overflow-hidden bg-zinc-800 -mt-3 shadow-lg">
                  {third.avatarUrl ? (
                    <img src={third.avatarUrl} alt={third.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-sm text-amber-600">
                      {third.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Third Podium Pedestal */}
              <div className="w-full bg-gradient-to-t from-[#18181B] to-[#1f1915] border-t-2 border-amber-700/60 rounded-2xl p-4 text-center space-y-1.5 shadow-xl h-36 flex flex-col justify-center">
                <span className="text-xs font-mono font-extrabold text-amber-600 tracking-wider">#3 THIRD PLACE</span>
                <h4 className="text-sm font-bold text-white truncate px-2">{third.name}</h4>
                <div className="text-xl font-black text-amber-500">{third.totalPoints} <span className="text-xs font-normal text-zinc-400">PTS</span></div>
                <div className="flex items-center justify-center gap-2 font-mono text-[11px] text-zinc-400">
                  <span className="flex items-center gap-0.5 text-violet-400">
                    <Flame className="w-3 h-3 fill-violet-400" /> {third.streak}d
                  </span>
                  <span>•</span>
                  <span>{third.quizzesCompleted} quizzes</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 2. Full Rankings Table */}
      <div className="bg-[#111114] border border-[#27272A] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search builder or wallet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#18181B] text-white text-xs font-mono rounded-xl pl-10 pr-4 py-2.5 border border-[#27272A] focus:border-violet-500 outline-none transition-colors"
            />
          </form>

          <span className="text-xs font-mono text-zinc-400 self-end sm:self-auto">
            Showing {data?.rankings.length || 0} competitors
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#27272A] text-zinc-500 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-bold">Rank</th>
                <th className="py-3.5 px-4 font-bold">Competitor</th>
                <th className="py-3.5 px-4 font-bold hidden sm:table-cell">Wallet</th>
                <th className="py-3.5 px-4 font-bold text-center">Quizzes</th>
                <th className="py-3.5 px-4 font-bold text-center">Streak</th>
                <th className="py-3.5 px-4 font-bold text-right">Total Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/60">
              {data?.rankings.map((p) => {
                return (
                  <tr
                    key={p.userId}
                    className={`transition-colors ${
                      p.isCurrentUser
                        ? 'bg-violet-950/20 text-white font-semibold'
                        : 'hover:bg-[#18181B]/50 text-zinc-300'
                    }`}
                  >
                    <td className="py-4 px-4 font-bold">
                      <RankBadge rank={p.rank} />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3 font-sans">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 border border-[#27272A] flex-shrink-0">
                          {p.avatarUrl ? (
                            <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xs text-violet-400">
                              {p.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-white block">
                            {p.name} {p.isCurrentUser && <span className="text-[10px] text-violet-400 font-mono">(You)</span>}
                          </span>
                          <span className="text-[11px] text-zinc-500 font-mono">{p.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden sm:table-cell font-mono text-zinc-400">
                      {p.shortenedWallet ? (
                        <span className="inline-flex items-center gap-1 hover:text-white">
                          <Wallet className="w-3 h-3 text-zinc-500" />
                          {p.shortenedWallet}
                        </span>
                      ) : (
                        <span className="text-zinc-600">Not linked</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center font-mono text-zinc-300">
                      {p.quizzesCompleted}
                    </td>
                    <td className="py-4 px-4 text-center font-mono">
                      <span className="inline-flex items-center gap-1 text-violet-400 font-bold">
                        <Flame className="w-3.5 h-3.5 fill-violet-400" />
                        {p.streak}d
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-extrabold text-amber-400 text-sm">
                      {p.totalPoints} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-[#27272A] font-mono text-xs">
            <span className="text-zinc-500">
              Page {data.pagination.page} of {data.pagination.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={data.pagination.page === 1}
                className="px-3 py-1.5 rounded-lg bg-[#18181B] text-zinc-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none border border-[#27272A]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={data.pagination.page === data.pagination.totalPages}
                className="px-3 py-1.5 rounded-lg bg-[#18181B] text-zinc-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none border border-[#27272A]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

