'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrophyRenderer } from '@/app/components/quiz-league/trophies/TrophyRenderer';
import {
  Trophy,
  Flame,
  Search,
  Sparkles,
  ArrowRight,
  Calendar,
  Wallet,
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

const medalEmoji: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export default function QuizLeagueLeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const fetchLeaderboard = (weekNumber?: number, search = '', pageNum = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (weekNumber) params.set('week', weekNumber.toString());
    if (search) params.set('search', search);
    params.set('page', pageNum.toString());

    fetch(`/api/quiz-league/leaderboard?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) {
          setData(json);
          if (!selectedWeek && json.week) {
            setSelectedWeek(json.week.weekNumber);
          }
          if (!weekNumber && !search && pageNum === 1) {
            try {
              sessionStorage.setItem('ethshala_quiz_leaderboard', JSON.stringify(json));
            } catch {}
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Instant cache-first load
    try {
      const cached = sessionStorage.getItem('ethshala_quiz_leaderboard');
      if (cached) {
        const parsed = JSON.parse(cached);
        setData(parsed);
        if (parsed.week) setSelectedWeek(parsed.week.weekNumber);
        setLoading(false);
      }
    } catch {}

    fetchLeaderboard();
  }, []);

  const handleWeekChange = (wNum: number) => {
    setSelectedWeek(wNum);
    setPage(1);
    fetchLeaderboard(wNum, searchQuery, 1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLeaderboard(selectedWeek || undefined, searchQuery, 1);
  };

  if (loading && !data) {
    return (
      <div className="space-y-8 w-full max-w-6xl mx-auto animate-pulse">
        <div className="border-b border-border/60 pb-6 space-y-3">
          <div className="h-4 w-40 bg-muted rounded" />
          <div className="h-9 w-72 bg-muted rounded-lg" />
          <div className="h-4 w-96 bg-muted/60 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          <div className="h-64 rounded-2xl bg-card/60 border border-border/40" />
          <div className="h-80 rounded-2xl bg-card/60 border border-border/40" />
          <div className="h-64 rounded-2xl bg-card/60 border border-border/40" />
        </div>
        <div className="h-96 rounded-2xl bg-card/60 border border-border/40" />
      </div>
    );
  }

  const week = data?.week;
  const podium = data?.podium || [];
  const rankings = data?.rankings || [];
  const currentUser = data?.currentUser;

  const first = podium[0];
  const second = podium[1];
  const third = podium[2];

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary dark:text-emerald-400">
              Campus Chapter Standings // Weekly Tournament
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight flex items-center gap-2.5">
            <Trophy className="text-amber-500 shrink-0" size={32} />
            <span>Championship Leaderboard</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-xl">
            Real-time verified standings based on daily challenge scores, accuracy, and active streaks.
          </p>
        </div>

        {/* Week Selector Dropdown */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <select
            value={selectedWeek || ''}
            onChange={(e) => handleWeekChange(Number(e.target.value))}
            className="bg-card border border-border text-foreground rounded-xl px-3.5 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer shadow-xs"
          >
            {(data?.availableWeeks || []).map((w) => (
              <option key={w.id} value={w.weekNumber}>
                Week {w.weekNumber}: {w.title} {w.status === 'ACTIVE' ? '(Live)' : '(Finalized)'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Podium (Top 3) — Clean & Open, NO nested boxes */}
      {podium.length === 0 ? (
        <div className="rounded-2xl border border-border/80 bg-card/60 p-10 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <Trophy size={28} className="text-amber-500" />
          </div>
          <h3 className="text-base font-bold text-foreground">Be the First on the Podium</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            No submissions recorded yet for Week {week?.weekNumber || 1}. Step into the arena and claim Rank #1!
          </p>
          <div className="pt-2">
            <Link
              href="/quiz-league/daily"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-xs"
            >
              <span>Take Today&apos;s Challenge</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end py-4">
          {/* Rank 2 (Silver) */}
          {second ? (
            <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border/70 bg-card/70 order-2 md:order-1">
              <div className="relative -mt-10 mb-2 flex flex-col items-center">
                <TrophyRenderer type="RUNNER_UP" size={110} glow={true} />
              </div>
              <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                Rank #2 // Runner Up
              </span>
              <h4 className="text-base font-bold text-foreground mt-1 truncate max-w-full px-2">{second.name}</h4>
              <div className="text-2xl font-black text-foreground font-mono mt-1">
                {second.totalPoints} <span className="text-xs font-normal text-muted-foreground">XP</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mt-2">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Flame size={13} className="fill-emerald-500" /> {second.streak}d
                </span>
                <span>•</span>
                <span>{second.quizzesCompleted} solved</span>
              </div>
            </div>
          ) : (
            <div className="hidden md:block order-2 md:order-1" />
          )}

          {/* Rank 1 (Gold) — Elevated */}
          {first && (
            <div className="flex flex-col items-center text-center p-8 rounded-2xl border-2 border-amber-400/50 bg-amber-500/5 order-1 md:order-2 shadow-sm relative">
              <div className="relative -mt-16 mb-2 flex flex-col items-center">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                >
                  <TrophyRenderer type="CHAMPION" size={160} glow={true} />
                </motion.div>
              </div>
              <span className="text-[11px] font-mono font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={12} /> Rank #1 // Weekly Champion
              </span>
              <h4 className="text-lg font-black text-foreground mt-1 truncate max-w-full px-2">{first.name}</h4>
              <div className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
                {first.totalPoints} <span className="text-xs font-normal text-muted-foreground">XP</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mt-2">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Flame size={14} className="fill-emerald-500 text-emerald-500" /> {first.streak}d streak
                </span>
                <span>•</span>
                <span>{first.quizzesCompleted} solved</span>
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {third ? (
            <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border/70 bg-card/70 order-3">
              <div className="relative -mt-10 mb-2 flex flex-col items-center">
                <TrophyRenderer type="THIRD_PLACE" size={100} glow={true} />
              </div>
              <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-500 uppercase tracking-wider">
                Rank #3 // Podium
              </span>
              <h4 className="text-base font-bold text-foreground mt-1 truncate max-w-full px-2">{third.name}</h4>
              <div className="text-2xl font-black text-foreground font-mono mt-1">
                {third.totalPoints} <span className="text-xs font-normal text-muted-foreground">XP</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mt-2">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Flame size={13} className="fill-emerald-500" /> {third.streak}d
                </span>
                <span>•</span>
                <span>{third.quizzesCompleted} solved</span>
              </div>
            </div>
          ) : (
            <div className="hidden md:block order-3" />
          )}
        </div>
      )}

      {/* 3. Standings Table — Consistent with ETHShala LeaderboardTable */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground font-display">Global Competitor Standings</h3>
            <p className="text-xs text-muted-foreground font-mono">
              Verified scores updated immediately upon daily submission.
            </p>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search builder or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-9 pr-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-xs"
            />
          </form>
        </div>

        {/* Current User Standing Bar */}
        {currentUser && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-mono font-bold text-xs">
                YOUR RANK #{currentUser.rank}
              </span>
              <span className="font-bold text-sm text-foreground">{currentUser.name}</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Flame size={14} className="fill-emerald-500" /> {currentUser.streak}d streak
              </span>
              <span className="text-foreground font-bold text-sm">
                {currentUser.totalPoints} XP
              </span>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-2xl overflow-hidden border border-border/80 bg-card/90 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/70 bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3.5 w-16 text-center">Rank</th>
                  <th className="px-5 py-3.5 min-w-[200px]">Student Builder</th>
                  <th className="px-5 py-3.5 w-32 hidden sm:table-cell text-center">Quizzes</th>
                  <th className="px-5 py-3.5 w-32 text-center">Daily Streak</th>
                  <th className="px-5 py-3.5 w-28 text-right pr-6">Verified XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-sm font-sans">
                {rankings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-muted-foreground font-mono text-xs">
                      No participants found matching this criteria.
                    </td>
                  </tr>
                ) : (
                  rankings.map((p) => {
                    const isTopThree = p.rank <= 3;
                    const cleanInitial = p.name ? p.name.charAt(0).toUpperCase() : 'B';

                    return (
                      <tr
                        key={p.userId}
                        className={`transition-colors ${
                          p.isCurrentUser
                            ? 'bg-emerald-500/10 font-medium'
                            : 'hover:bg-muted/40'
                        }`}
                      >
                        {/* Rank */}
                        <td className="px-5 py-4 text-center align-middle">
                          {isTopThree ? (
                            <span className="text-xl select-none" title={`Rank ${p.rank}`}>
                              {medalEmoji[p.rank]}
                            </span>
                          ) : (
                            <span className="font-mono text-xs font-bold text-muted-foreground">
                              #{p.rank}
                            </span>
                          )}
                        </td>

                        {/* Builder */}
                        <td className="px-5 py-4 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 border border-border flex items-center justify-center font-bold text-xs text-primary dark:text-emerald-400 shrink-0">
                              {p.avatarUrl ? (
                                <img
                                  src={p.avatarUrl}
                                  alt={p.name}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                cleanInitial
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-foreground text-sm truncate">
                                  {p.name}
                                </span>
                                {p.isCurrentUser && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white tracking-wide">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground font-mono truncate">
                                {p.username ? (p.username.startsWith('@') ? p.username : `@${p.username}`) : '@builder'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Quizzes Completed */}
                        <td className="px-5 py-4 text-center align-middle font-mono text-xs text-foreground font-semibold hidden sm:table-cell">
                          {p.quizzesCompleted}
                        </td>

                        {/* Streak */}
                        <td className="px-5 py-4 text-center align-middle">
                          <span className="inline-flex items-center gap-1 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                            <Flame size={13} className="fill-emerald-500" />
                            {p.streak}d
                          </span>
                        </td>

                        {/* Verified XP */}
                        <td className="px-5 py-4 text-right pr-6 align-middle font-mono font-bold text-sm text-amber-600 dark:text-amber-400">
                          {p.totalPoints}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
