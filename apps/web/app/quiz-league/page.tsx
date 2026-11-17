'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChampionTrophy } from '@/app/components/quiz-league/trophies/ChampionTrophy';
import { TrophyRenderer } from '@/app/components/quiz-league/trophies/TrophyRenderer';
import {
  Flame,
  Trophy,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface DashboardData {
  week: {
    id: string;
    weekNumber: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
  };
  userStats: {
    isAuthenticated: boolean;
    name: string;
    rank: number;
    totalPoints: number;
    currentStreak: number;
    quizzesCompleted: number;
    hasSubmittedToday: boolean;
  };
  competitionStats: {
    totalParticipants: number;
    activeParticipants: number;
    quizzesCompletedTotal: number;
  };
  todayQuiz: {
    id: string;
    title: string;
    topic: string;
    dayIndex: number;
    durationMinutes: number;
    maxPoints: number;
    questionCount: number;
    status: string;
    pointsEarned: number;
  };
  calendar: Array<{
    id: string;
    dayIndex: number;
    dayName: string;
    title: string;
    topic: string;
    maxPoints: number;
    durationMinutes: number;
    status: string;
    pointsEarned: number;
    completedAt?: string | null;
  }>;
}

export default function QuizLeagueDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    fetch('/api/quiz-league/dashboard')
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) setData(json);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Countdown timer calculation
  useEffect(() => {
    if (!data?.week?.endDate) return;

    const timer = setInterval(() => {
      const difference = new Date(data.week.endDate).getTime() - new Date().getTime();
      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [data?.week?.endDate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-[#A1A1AA]">Entering Quiz League Arena...</span>
      </div>
    );
  }

  const week = data?.week;
  const userStats = data?.userStats;
  const stats = data?.competitionStats;
  const todayQuiz = data?.todayQuiz;
  const calendar = data?.calendar || [];

  return (
    <div className="space-y-8">
      {/* 1. Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111114] via-[#141418] to-[#18181B] border border-[#27272A] p-6 sm:p-10 shadow-2xl"
      >
        {/* Ambient background glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>WEEK {week?.weekNumber || 1} CHAMPIONSHIP</span>
              <span className="w-1 h-1 rounded-full bg-violet-400" />
              <span className="text-[#F5C451]">ERC-721 TROPHY ON GNOSIS</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                ETHShala <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-amber-300">Quiz League</span>
              </h1>
              <p className="text-sm sm:text-base text-[#A1A1AA] max-w-xl leading-relaxed">
                {week?.description || 'Daily Ethereum and EVM challenges. Test your protocol knowledge, build participation streaks, and win the weekly Championship Trophy NFT.'}
              </p>
            </div>

            {/* Live Countdown to weekly close */}
            <div className="bg-[#09090B]/60 border border-[#27272A] rounded-2xl p-3.5 max-w-md">
              <div className="flex items-center justify-between text-xs text-[#A1A1AA] mb-2 font-mono">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Leaderboard Closes In:
                </span>
                <span className="text-emerald-400 font-bold">Week Active</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center font-mono">
                <div className="bg-[#18181B] rounded-lg py-1.5 border border-[#27272A]/60">
                  <span className="text-lg font-black text-white">{String(timeLeft.days).padStart(2, '0')}</span>
                  <span className="block text-[10px] text-zinc-500">DAYS</span>
                </div>
                <div className="bg-[#18181B] rounded-lg py-1.5 border border-[#27272A]/60">
                  <span className="text-lg font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="block text-[10px] text-zinc-500">HOURS</span>
                </div>
                <div className="bg-[#18181B] rounded-lg py-1.5 border border-[#27272A]/60">
                  <span className="text-lg font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="block text-[10px] text-zinc-500">MINS</span>
                </div>
                <div className="bg-[#18181B] rounded-lg py-1.5 border border-[#27272A]/60">
                  <span className="text-lg font-black text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="block text-[10px] text-zinc-500">SECS</span>
                </div>
              </div>
            </div>

            {/* Student's Current Snapshot */}
            <div className="grid grid-cols-3 gap-3 max-w-md pt-1">
              <div className="bg-[#18181B]/80 border border-[#27272A] rounded-xl p-3">
                <span className="text-[11px] text-[#A1A1AA] block font-mono">YOUR RANK</span>
                <span className="text-xl font-extrabold text-white flex items-center gap-1">
                  #{userStats?.rank || '-'}
                </span>
              </div>
              <div className="bg-[#18181B]/80 border border-[#27272A] rounded-xl p-3">
                <span className="text-[11px] text-[#A1A1AA] block font-mono">TOTAL POINTS</span>
                <span className="text-xl font-extrabold text-amber-400">
                  {userStats?.totalPoints || 0}
                </span>
              </div>
              <div className="bg-[#18181B]/80 border border-[#27272A] rounded-xl p-3">
                <span className="text-[11px] text-[#A1A1AA] block font-mono">STREAK</span>
                <span className="text-xl font-extrabold text-violet-400 flex items-center gap-1">
                  <Flame className="w-4 h-4 fill-violet-400" />
                  {userStats?.currentStreak || 0}d
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={todayQuiz?.id ? `/quiz-league/daily/${todayQuiz.id}` : '/quiz-league/daily'}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{userStats?.hasSubmittedToday ? "Review Today's Quiz" : "Play Today's Quiz"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/quiz-league/leaderboard"
                className="px-6 py-3 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-white border border-[#27272A] font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>View Leaderboard</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Trophy */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-6">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="relative"
            >
              <ChampionTrophy size={210} glow={true} />
            </motion.div>
            <div className="mt-4 text-center">
              <span className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase block">
                Weekly Champion Trophy
              </span>
              <span className="text-[11px] text-[#A1A1AA]">
                Awarded to Rank #1 on Sunday 23:59 UTC
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Today's Quiz Challenge Card & Competition Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Daily Challenge Card (7 Cols) */}
        <div className="lg:col-span-7 bg-[#111114] border border-[#27272A] rounded-2xl p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <Flame className="w-5 h-5 fill-violet-400" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                  Daily Protocol Challenge — Day {todayQuiz?.dayIndex || 1}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {todayQuiz?.title || 'EVM Architecture & Opcodes'}
                </h3>
              </div>
            </div>

            {/* Status Badge */}
            {todayQuiz?.status === 'COMPLETED' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                COMPLETED (+{todayQuiz.pointsEarned} pts)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-violet-500/10 text-violet-400 border border-violet-500/30 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-violet-400" />
                AVAILABLE NOW
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-3">
              <span className="text-zinc-500 block text-[10px]">TOPIC</span>
              <span className="text-white font-semibold truncate block mt-0.5">{todayQuiz?.topic}</span>
            </div>
            <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-3">
              <span className="text-zinc-500 block text-[10px]">QUESTIONS</span>
              <span className="text-white font-semibold block mt-0.5">{todayQuiz?.questionCount} Questions</span>
            </div>
            <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-3">
              <span className="text-zinc-500 block text-[10px]">DURATION</span>
              <span className="text-white font-semibold block mt-0.5">{todayQuiz?.durationMinutes} Minutes</span>
            </div>
            <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-3">
              <span className="text-zinc-500 block text-[10px]">MAX POINTS</span>
              <span className="text-amber-400 font-semibold block mt-0.5">+{todayQuiz?.maxPoints} XP</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-[#A1A1AA]">
              One attempt per quiz. Explanations unlocked immediately upon submission.
            </div>
            <Link
              href={todayQuiz?.id ? `/quiz-league/daily/${todayQuiz.id}` : '/quiz-league/daily'}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                todayQuiz?.status === 'COMPLETED'
                  ? 'bg-[#18181B] hover:bg-[#27272A] text-zinc-300 border border-[#27272A]'
                  : 'bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/30'
              }`}
            >
              <span>{todayQuiz?.status === 'COMPLETED' ? 'Review Submission' : 'Start Quiz'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Competition Statistics (5 Cols) */}
        <div className="lg:col-span-5 bg-[#111114] border border-[#27272A] rounded-2xl p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-400" />
              <h3 className="text-lg font-bold text-white">League Statistics</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Season 1</span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4">
              <span className="text-xs font-mono text-zinc-400 block">Total Competitors</span>
              <span className="text-2xl font-black text-white mt-1 block">{stats?.totalParticipants || 5}</span>
              <span className="text-[10px] text-zinc-500">Registered builders</span>
            </div>

            <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4">
              <span className="text-xs font-mono text-zinc-400 block">Active Learners</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">{stats?.activeParticipants || 4}</span>
              <span className="text-[10px] text-zinc-500">Completed 1+ quiz</span>
            </div>

            <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4">
              <span className="text-xs font-mono text-zinc-400 block">Total Attempts</span>
              <span className="text-2xl font-black text-amber-400 mt-1 block">{stats?.quizzesCompletedTotal || 12}</span>
              <span className="text-[10px] text-zinc-500">Submitted answers</span>
            </div>

            <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4">
              <span className="text-xs font-mono text-zinc-400 block">Reward Chain</span>
              <span className="text-lg font-black text-violet-300 mt-1 block">Gnosis Chain</span>
              <span className="text-[10px] text-zinc-500">ERC-721 NFT Trophy</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Seven-Day Weekly Schedule & Calendar */}
      <div className="bg-[#111114] border border-[#27272A] rounded-2xl p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">7-Day Competition Roadmap</h3>
          </div>
          <span className="text-xs text-[#A1A1AA] font-mono">
            Maintain participation daily to unlock the 7-Day Flame Badge.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {calendar.map((day) => {
            const isCompleted = day.status === 'COMPLETED';
            const isAvailable = day.status === 'AVAILABLE';
            const isMissed = day.status === 'MISSED';

            return (
              <div
                key={day.id}
                className={`relative rounded-xl p-4 border transition-all flex flex-col justify-between h-40 ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                    : isAvailable
                    ? 'bg-violet-950/20 border-violet-500/50 text-violet-300 ring-1 ring-violet-500/40'
                    : isMissed
                    ? 'bg-[#18181B]/40 border-[#27272A] opacity-60'
                    : 'bg-[#18181B] border-[#27272A]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                    <span className="text-zinc-400">Day {day.dayIndex}</span>
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {isAvailable && <Flame className="w-3.5 h-3.5 text-violet-400 fill-violet-400" />}
                  </div>
                  <span className="font-extrabold text-sm text-white block line-clamp-1">{day.dayName}</span>
                  <span className="text-[11px] text-zinc-400 block truncate mt-1">{day.topic}</span>
                </div>

                <div className="pt-2 border-t border-[#27272A]/40 flex items-center justify-between font-mono text-[10px]">
                  {isCompleted ? (
                    <span className="text-emerald-400 font-bold">+{day.pointsEarned} pts</span>
                  ) : isAvailable ? (
                    <Link
                      href={`/quiz-league/daily/${day.id}`}
                      className="text-violet-400 hover:underline font-bold"
                    >
                      Play Now →
                    </Link>
                  ) : isMissed ? (
                    <span className="text-zinc-500">Missed</span>
                  ) : (
                    <span className="text-zinc-500">Upcoming</span>
                  )}
                  <span className="text-zinc-600">{day.maxPoints} pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Trophy & Achievement Showcase */}
      <div className="bg-[#111114] border border-[#27272A] rounded-2xl p-6 sm:p-7 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Championship Achievements & Badges</h3>
          </div>
          <Link href="/quiz-league/profile" className="text-xs text-violet-400 hover:underline font-semibold">
            View All in Profile →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 flex items-center gap-3.5">
            <TrophyRenderer type="PERFECT_SCORE" size={56} glow={false} />
            <div>
              <span className="text-sm font-bold text-white block">Perfect Lightning</span>
              <span className="text-[11px] text-zinc-400">Score 100% on any daily quiz</span>
            </div>
          </div>

          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 flex items-center gap-3.5">
            <TrophyRenderer type="STREAK_7" size={56} glow={false} />
            <div>
              <span className="text-sm font-bold text-white block">7-Day Violet Flame</span>
              <span className="text-[11px] text-zinc-400">7 consecutive daily completions</span>
            </div>
          </div>

          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 flex items-center gap-3.5">
            <TrophyRenderer type="QUIZ_MASTER" size={56} glow={false} />
            <div>
              <span className="text-sm font-bold text-white block">EVM Quiz Master</span>
              <span className="text-[11px] text-zinc-400">Complete 5+ protocol quizzes</span>
            </div>
          </div>

          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 flex items-center gap-3.5">
            <TrophyRenderer type="ETHSHALA_SCHOLAR" size={56} glow={false} />
            <div>
              <span className="text-sm font-bold text-white block">Diamond Scholar</span>
              <span className="text-[11px] text-zinc-400">Earn 500+ total league points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

