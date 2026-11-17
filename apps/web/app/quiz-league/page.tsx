'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrophyRenderer } from '@/app/components/quiz-league/trophies/TrophyRenderer';
import {
  Flame,
  Clock,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Sparkles,
  Calendar,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface QuizLeagueData {
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
    totalPoints: number;
    currentStreak: number;
    longestStreak: number;
    quizzesCompleted: number;
    rank: number | null;
    hasSubmittedToday: boolean;
  };
  todayQuiz: {
    id: string;
    title: string;
    topic: string;
    difficulty: string;
    durationMinutes: number;
    maxPoints: number;
    dayIndex: number;
    questionsCount: number;
    hasAttempted: boolean;
    attemptScore?: number;
    status?: string;
  } | null;
  calendar: Array<{
    dayIndex: number;
    date: string;
    isToday: boolean;
    isPast: boolean;
    isUpcoming: boolean;
    hasCompleted: boolean;
    quizId?: string;
    title?: string;
    points?: number;
  }>;
}

export default function QuizLeagueOverviewPage() {
  const [data, setData] = useState<QuizLeagueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Instant cache-first load (SWR pattern)
    try {
      const cached = sessionStorage.getItem('ethshala_quiz_overview');
      if (cached) {
        const parsed = JSON.parse(cached);
        setData(parsed);
        setLoading(false);
      }
    } catch {}

    fetch('/api/quiz-league/overview')
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) {
          setData(json);
          try {
            sessionStorage.setItem('ethshala_quiz_overview', JSON.stringify(json));
          } catch {}
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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

  if (loading && !data) {
    return (
      <div className="w-full space-y-10 animate-pulse">
        <div className="pt-2 pb-6 space-y-4 max-w-xl">
          <div className="h-4 w-48 bg-muted rounded" />
          <div className="h-10 w-80 bg-muted rounded-lg" />
          <div className="h-16 w-full bg-muted/60 rounded-lg" />
          <div className="flex gap-4 pt-2">
            <div className="h-8 w-28 bg-muted rounded-full" />
            <div className="h-8 w-28 bg-muted rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 h-64 bg-card/60 border border-border/40 rounded-3xl" />
          <div className="lg:col-span-4 h-64 bg-card/60 border border-border/40 rounded-3xl" />
        </div>
        <div className="h-44 bg-card/60 border border-border/40 rounded-3xl" />
      </div>
    );
  }

  const week = data?.week;
  const userStats = data?.userStats;
  const todayQuiz = data?.todayQuiz;
  const calendar = data?.calendar || [];

  return (
    <div className="w-full space-y-10">
      {/* 1. HERO MASTHEAD: Clean, open, seamless layout without boxed containers */}
      <section className="relative w-full pt-2 pb-6">
        {/* Soft Ambient Glow */}
        <div className="pointer-events-none absolute -top-12 left-1/4 w-[500px] h-64 rounded-full bg-primary/10 dark:bg-emerald-500/10 blur-[140px]" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Details */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Subtle Label */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-emerald-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary dark:text-emerald-400">
                Ethereum Protocol Track // Week {week?.weekNumber || 1} Tournament
              </span>
            </div>

            {/* Bold Headline */}
            <h1 className="text-foreground font-black text-3xl sm:text-5xl tracking-tight leading-[1.1] mb-3">
              ETHShala <span className="text-emerald-600 dark:text-emerald-400">Quiz League</span>
            </h1>

            {/* Subtitle */}
            <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-xl leading-relaxed">
              {week?.description || 'Daily hands-on Ethereum challenges. Verify your protocol knowledge on EVM opcodes, L2 rollups, and smart contracts to climb the weekly championship leaderboard.'}
            </p>

            {/* Quick Metrics Bar (Clean pills, no rigid boxes) */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="px-3.5 py-1.5 rounded-xl bg-muted/50 border border-border flex items-center gap-2">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Rank</span>
                <span className="text-sm font-bold text-foreground font-mono">
                  {userStats?.rank ? `#${userStats.rank}` : 'Unranked'}
                </span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-muted/50 border border-border flex items-center gap-2">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Verified XP</span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">
                  {userStats?.totalPoints ?? 0}
                </span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-muted/50 border border-border flex items-center gap-2">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Streak</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-emerald-500" />
                  {userStats?.currentStreak ?? 0}d
                </span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-muted/50 border border-border flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  Closes in {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link
                href={todayQuiz?.id ? `/quiz-league/daily/${todayQuiz.id}` : '/quiz-league/daily'}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              >
                <span>{todayQuiz?.hasAttempted || todayQuiz?.status === 'COMPLETED' || userStats?.hasSubmittedToday ? "Review Today's Challenge" : "Enter Daily Challenge"}</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/quiz-league/leaderboard"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-card hover:bg-muted border border-border text-foreground text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
              >
                <Trophy size={15} className="text-amber-500" />
                <span>View Leaderboard</span>
              </Link>
            </div>
          </div>

          {/* Right: Transparent Trophy Presentation with NO box container */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-4">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="relative flex items-center justify-center"
            >
              <TrophyRenderer type="CHAMPION" size={220} glow={true} />
            </motion.div>
            <div className="mt-2 text-center">
              <span className="text-xs font-mono font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase block">
                Championship Trophy
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                Awarded to Rank #1 on Sunday 23:59 UTC
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROPER SECTION: Today's Daily Challenge */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <div>
            <h2 className="text-lg font-bold text-foreground font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Today&apos;s Protocol Challenge
            </h2>
            <p className="text-xs text-muted-foreground">Fresh curriculum questions released every 24 hours.</p>
          </div>
          <Link
            href="/quiz-league/daily"
            className="text-xs font-semibold text-primary dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All Days</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {todayQuiz ? (
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Day {todayQuiz.dayIndex}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {todayQuiz.questionsCount} Questions • {todayQuiz.durationMinutes} Mins
                </span>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  +{todayQuiz.maxPoints} XP
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground font-display">{todayQuiz.title}</h3>
              <p className="text-xs text-muted-foreground font-mono">Topic: {todayQuiz.topic}</p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              {(todayQuiz.hasAttempted || todayQuiz.status === 'COMPLETED' || userStats?.hasSubmittedToday) ? (
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs border border-emerald-500/25">
                    <CheckCircle2 size={14} /> Completed {todayQuiz.attemptScore ? `(${todayQuiz.attemptScore}%)` : ''}
                  </span>
                  <Link
                    href={`/quiz-league/daily/${todayQuiz.id}`}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors"
                  >
                    Review Answers
                  </Link>
                </div>
              ) : (
                <Link
                  href={`/quiz-league/daily/${todayQuiz.id}`}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span>Start Challenge</span>
                  <ArrowRight size={13} />
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-2xl border border-border text-center text-muted-foreground text-xs font-mono">
            No quiz scheduled for today. Check back tomorrow!
          </div>
        )}
      </section>

      {/* 3. PROPER SECTION: 7-Day Competition Roadmap */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <div>
            <h2 className="text-lg font-bold text-foreground font-display flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              Weekly Curriculum Roadmap
            </h2>
            <p className="text-xs text-muted-foreground">Maintain participation daily to unlock tournament streak bonuses.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {calendar.map((item) => {
            const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const dayLabel = dayNames[(item.dayIndex - 1) % 7] || `Day ${item.dayIndex}`;

            return (
              <div
                key={item.dayIndex}
                className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between h-28 ${
                  item.isToday
                    ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/30'
                    : item.hasCompleted
                    ? 'border-emerald-500/30 bg-card'
                    : 'border-border/70 bg-card/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase">{dayLabel}</span>
                  {item.hasCompleted ? (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  ) : item.isToday ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  ) : null}
                </div>

                <div className="my-1">
                  <span className="text-xs font-bold text-foreground line-clamp-1">
                    {item.title || `Challenge ${item.dayIndex}`}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-muted-foreground flex items-center justify-between pt-1 border-t border-border/40">
                  <span>Day {item.dayIndex}</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">+{item.points || 100} XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
