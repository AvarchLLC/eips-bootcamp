'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, CheckCircle2, Clock, ArrowRight, ArrowLeft, Shield, Sparkles } from 'lucide-react';

export default function DailyQuizDirectory() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/quiz-league/dashboard')
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) {
          setData(json);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-[#A1A1AA]">Loading Daily Quiz Arena...</span>
      </div>
    );
  }

  const calendar = data?.calendar || [];
  const todayQuiz = data?.todayQuiz;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272A] pb-6">
        <div>
          <Link
            href="/quiz-league"
            className="inline-flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-white font-mono mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to League Overview
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Flame className="w-7 h-7 text-violet-400 fill-violet-400" />
            Daily Quiz Arena
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            One new Ethereum protocol challenge released each day. Complete daily to maximize your weekly championship score.
          </p>
        </div>

        {todayQuiz?.id && (
          <Link
            href={`/quiz-league/daily/${todayQuiz.id}`}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 self-start sm:self-auto shadow-md shadow-violet-600/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Go to Today's Challenge</span>
          </Link>
        )}
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {calendar.map((quiz: any) => {
          const isCompleted = quiz.status === 'COMPLETED';
          const isAvailable = quiz.status === 'AVAILABLE';
          const isMissed = quiz.status === 'MISSED';

          return (
            <div
              key={quiz.id}
              className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                isCompleted
                  ? 'bg-[#111114] border-emerald-500/30'
                  : isAvailable
                  ? 'bg-gradient-to-br from-[#18181B] to-[#111114] border-violet-500/50 ring-1 ring-violet-500/30'
                  : 'bg-[#111114] border-[#27272A] opacity-75'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-400">
                    Day {quiz.dayIndex} — {quiz.dayName}
                  </span>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> COMPLETED (+{quiz.pointsEarned} pts)
                    </span>
                  ) : isAvailable ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/30 animate-pulse">
                      AVAILABLE NOW
                    </span>
                  ) : isMissed ? (
                    <span className="text-[11px] font-mono text-zinc-500">MISSED</span>
                  ) : (
                    <span className="text-[11px] font-mono text-zinc-500">UPCOMING</span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{quiz.title}</h3>
                  <span className="text-xs text-[#A1A1AA] font-mono block mt-0.5">Topic: {quiz.topic}</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#27272A] flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-500" /> {quiz.durationMinutes}m
                  </span>
                  <span>+{quiz.maxPoints} pts</span>
                </div>

                <Link
                  href={`/quiz-league/daily/${quiz.id}`}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isCompleted
                      ? 'bg-[#18181B] text-zinc-300 hover:text-white border border-[#27272A]'
                      : isAvailable
                      ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-sm shadow-violet-600/30'
                      : 'bg-[#18181B] text-zinc-500 hover:text-zinc-400 border border-[#27272A]'
                  }`}
                >
                  <span>{isCompleted ? 'Review' : isAvailable ? 'Play Now' : 'View'}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

