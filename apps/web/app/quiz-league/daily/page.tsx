'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Flame, CheckCircle2, Clock, ArrowRight, ArrowLeft, Trophy, Sparkles, BookOpen } from 'lucide-react';

export default function DailyQuizDirectory() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

    fetch('/api/quiz-league/dashboard')
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

  if (loading && !data) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
        <div className="border-b border-border pb-6 space-y-3">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-8 w-64 bg-muted rounded-lg" />
          <div className="h-4 w-96 bg-muted/60 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-card/60 border border-border/40 p-5" />
          ))}
        </div>
      </div>
    );
  }

  const calendar = data?.calendar || [];
  const todayQuiz = data?.todayQuiz;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <Link
            href="/quiz-league"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-mono mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to League Overview
          </Link>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-foreground flex items-center gap-2">
            <Flame className="w-7 h-7 text-emerald-500 fill-emerald-500" />
            Daily Quiz Arena
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            One new Ethereum protocol challenge released each day. Complete daily to maximize your weekly championship score.
          </p>
        </div>

        {todayQuiz?.id && (
          <Link
            href={`/quiz-league/daily/${todayQuiz.id}`}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-grotesk font-bold text-xs flex items-center gap-2 self-start sm:self-auto shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enter Today&apos;s Arena (Day {todayQuiz.dayIndex})</span>
          </Link>
        )}
      </div>

      {/* Daily Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {calendar.map((quiz: any) => {
          const isCompleted = quiz.status === 'COMPLETED';
          const isAvailable = quiz.status === 'AVAILABLE';
          const isMissed = quiz.status === 'MISSED';

          return (
            <div
              key={quiz.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-all shadow-sm ${
                isAvailable
                  ? 'bg-card border-emerald-500/50 ring-1 ring-emerald-500/30'
                  : isCompleted
                  ? 'bg-card border-border'
                  : 'bg-muted/40 border-border opacity-70'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    Day {quiz.dayIndex} — {quiz.dayName}
                  </span>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> COMPLETED (+{quiz.pointsEarned} pts)
                    </span>
                  ) : isAvailable ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 animate-pulse">
                      <Flame className="w-3 h-3 fill-amber-500" /> ACTIVE NOW
                    </span>
                  ) : isMissed ? (
                    <span className="text-[11px] font-mono text-muted-foreground">MISSED</span>
                  ) : (
                    <span className="text-[11px] font-mono text-muted-foreground">UPCOMING</span>
                  )}
                </div>

                <h3 className="text-base font-grotesk font-bold text-foreground">{quiz.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{quiz.topic}</p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    {quiz.durationMinutes}m
                  </span>
                  <span>+{quiz.maxPoints} pts</span>
                </div>

                <div className="flex items-center gap-2">
                  {isAvailable && (
                    <Link
                      href={`/quiz-league/daily/${quiz.id}`}
                      className="px-4 py-1.5 rounded-lg text-xs font-grotesk font-bold flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all cursor-pointer"
                    >
                      <span>Enter Arena</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}

                  {isCompleted && (
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/quiz-league/daily/${quiz.id}?mode=practice`}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted border border-border flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Practice again without affecting score"
                      >
                        <BookOpen className="w-3 h-3 text-amber-500" />
                        <span>Practice</span>
                      </Link>
                      <Link
                        href={`/quiz-league/daily/${quiz.id}`}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-grotesk font-bold bg-muted hover:bg-accent text-foreground border border-border flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>Review</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}

                  {isMissed && (
                    <Link
                      href={`/quiz-league/daily/${quiz.id}?mode=practice`}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <BookOpen className="w-3 h-3 text-amber-500" />
                      <span>Practice Mode</span>
                    </Link>
                  )}

                  {!isAvailable && !isCompleted && !isMissed && (
                    <span className="text-xs font-mono text-muted-foreground">Locked</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
