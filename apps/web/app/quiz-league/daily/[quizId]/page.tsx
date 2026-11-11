'use client';

import React, { useEffect, useState, use, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Flame,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
} from 'lucide-react';
import { ChampionTrophy } from '@/app/components/quiz-league/trophies/ChampionTrophy';

interface QuestionOption {
  id: string;
  orderIndex: number;
  text: string;
  isCorrect?: boolean;
}

interface Question {
  id: string;
  orderIndex: number;
  question: string;
  codeSnippet?: string | null;
  explanation?: string;
  points: number;
  correctOptionId?: string;
  options: QuestionOption[];
}

interface QuizData {
  id: string;
  title: string;
  topic: string;
  description?: string;
  durationMinutes: number;
  maxPoints: number;
  dayIndex: number;
  weekNumber: number;
  questions: Question[];
}

interface AttemptResult {
  score: number;
  pointsEarned: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpentSeconds: number;
  breakdown: Array<{
    questionId: string;
    question: string;
    selectedOptionId: string | null;
    selectedText: string | null;
    correctOptionId: string | null;
    correctText: string | null;
    isCorrect: boolean;
    pointsAwarded: number;
    explanation: string;
  }>;
  newRank?: number;
  totalWeeklyPoints?: number;
  currentStreak?: number;
}

export default function DailyQuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = use(params);
  const router = useRouter();

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Flow State: 'BRIEFING' | 'ACTIVE' | 'RESULTS'
  const [gameState, setGameState] = useState<'BRIEFING' | 'ACTIVE' | 'RESULTS'>('BRIEFING');

  // Active Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 mins
  const [submitting, setSubmitting] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  // Result State
  const [result, setResult] = useState<AttemptResult | null>(null);

  useEffect(() => {
    fetch(`/api/quiz-league/quiz/${quizId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setQuiz(data.quiz);
          setTimerSeconds((data.quiz.durationMinutes || 5) * 60);

          if (data.alreadySubmitted && data.attempt) {
            setResult({
              score: data.attempt.score,
              pointsEarned: data.attempt.pointsEarned,
              totalQuestions: data.attempt.totalQuestions,
              correctAnswers: data.attempt.correctAnswers,
              timeSpentSeconds: data.attempt.timeSpentSeconds,
              breakdown: data.attempt.userAnswers,
            });
            setGameState('RESULTS');
          }
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [quizId]);

  const handleSubmit = useCallback(async () => {
    if (!quiz || submitting) return;
    setSubmitting(true);

    const answersPayload = Object.entries(selectedAnswers).map(([qId, optId]) => ({
      questionId: qId,
      selectedOptionId: optId,
    }));

    try {
      const res = await fetch(`/api/quiz-league/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: answersPayload,
          timeSpentSeconds: timeSpent,
        }),
      });

      const json = await res.json();
      if (res.ok && json.result) {
        setResult(json.result);
        setGameState('RESULTS');

        // Confetti celebration if score >= 80%
        if (json.result.score >= 80) {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#8B5CF6', '#F5C451', '#22C55E', '#FFFFFF'],
          });
        }
      } else {
        alert(json.error || 'Failed to submit quiz');
      }
    } catch (err: any) {
      alert(err.message || 'Submission error');
    } finally {
      setSubmitting(false);
    }
  }, [quiz, submitting, selectedAnswers, quizId, timeSpent]);

  // Quiz active timer countdown
  useEffect(() => {
    if (gameState !== 'ACTIVE') return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, handleSubmit]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (gameState !== 'ACTIVE') return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (!quiz) return;
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-[#A1A1AA]">Retrieving Protocol Challenge...</span>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-2xl bg-[#111114] border border-red-500/30 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Quiz Unavailable</h2>
        <p className="text-xs text-zinc-400">{error || 'Unable to load quiz details.'}</p>
        <Link
          href="/quiz-league"
          className="inline-block px-5 py-2.5 rounded-xl bg-[#18181B] text-white text-xs font-semibold border border-[#27272A]"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  // 1. BRIEFING SCREEN (Before Starting)
  if (gameState === 'BRIEFING') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto bg-[#111114] border border-[#27272A] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8"
      >
        <div className="flex items-center justify-between border-b border-[#27272A] pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <Flame className="w-6 h-6 fill-violet-400" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                Week {quiz.weekNumber} — Day {quiz.dayIndex}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">{quiz.title}</h1>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
            +{quiz.maxPoints} XP
          </span>
        </div>

        {/* Challenge Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-3.5">
            <span className="text-zinc-500 block text-[10px]">TOPIC</span>
            <span className="text-white font-semibold truncate block mt-0.5">{quiz.topic}</span>
          </div>
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-3.5">
            <span className="text-zinc-500 block text-[10px]">QUESTIONS</span>
            <span className="text-white font-semibold block mt-0.5">{quiz.questions.length} Items</span>
          </div>
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-3.5">
            <span className="text-zinc-500 block text-[10px]">TIME LIMIT</span>
            <span className="text-white font-semibold block mt-0.5">{quiz.durationMinutes} Minutes</span>
          </div>
          <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-3.5">
            <span className="text-zinc-500 block text-[10px]">SUBMISSION</span>
            <span className="text-emerald-400 font-semibold block mt-0.5">1 Attempt Only</span>
          </div>
        </div>

        {/* Rules & Guidelines */}
        <div className="bg-[#18181B]/60 border border-[#27272A] rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-violet-400" /> Tournament Rules
          </h4>
          <ul className="space-y-2 text-xs text-[#A1A1AA] leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
              <span>Each correct answer awards <strong>20 XP</strong> toward your weekly leaderboard standing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
              <span>Answers are final upon clicking <strong>Submit Quiz</strong>. Scores and detailed explanations appear immediately.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
              <span>Server-side anti-cheat is active. All scores are calculated directly on the server.</span>
            </li>
          </ul>
        </div>

        {/* Start Button */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/quiz-league/daily"
            className="text-xs font-mono text-[#A1A1AA] hover:text-white flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <button
            onClick={() => setGameState('ACTIVE')}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-violet-600/30 flex items-center gap-2 cursor-pointer transition-all transform hover:-translate-y-0.5"
          >
            <span>Begin Daily Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  // 2. ACTIVE QUIZ TAKING SCREEN
  if (gameState === 'ACTIVE') {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const totalQuestions = quiz.questions.length;
    const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
    const selectedOptionId = selectedAnswers[currentQuestion.id];
    const allAnswered = quiz.questions.every((q) => selectedAnswers[q.id]);

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header with Progress & Timer */}
        <div className="bg-[#111114] border border-[#27272A] rounded-2xl p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-xs font-mono text-zinc-400">
              Question <span className="text-white font-extrabold">{currentQuestionIndex + 1}</span> of{' '}
              <span className="text-zinc-500">{totalQuestions}</span>
            </div>
            <div className="w-24 sm:w-36 h-2 bg-[#18181B] rounded-full overflow-hidden border border-[#27272A]">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1.5 rounded-xl bg-[#18181B] border border-[#27272A] text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-[#111114] border border-[#27272A] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl"
          >
            {/* Question Header */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider block">
                Item {currentQuestionIndex + 1} • {currentQuestion.points} Points
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                {currentQuestion.question}
              </h2>

              {/* Code Snippet if applicable */}
              {currentQuestion.codeSnippet && (
                <div className="bg-[#09090B] border border-[#27272A] rounded-xl p-3.5 font-mono text-xs text-violet-200 overflow-x-auto">
                  <pre>{currentQuestion.codeSnippet}</pre>
                </div>
              )}
            </div>

            {/* 4 Answer Options */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                const letter = String.fromCharCode(65 + idx);

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-violet-600/15 border-violet-500 text-white ring-1 ring-violet-500 shadow-md shadow-violet-500/10'
                        : 'bg-[#18181B] border-[#27272A] text-zinc-300 hover:border-zinc-500 hover:bg-[#1c1c20]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs border ${
                          isSelected
                            ? 'bg-violet-600 border-violet-400 text-white'
                            : 'bg-[#111114] border-[#27272A] text-zinc-400'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="text-xs sm:text-sm font-medium">{option.text}</span>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-violet-400 bg-violet-600' : 'border-zinc-600'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation & Submission Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-[#27272A]">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-violet-600/30"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                >
                  {submitting ? 'Calculating Score...' : 'Submit Quiz'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Quick Question Picker Strip */}
        <div className="flex items-center justify-center gap-2">
          {quiz.questions.map((q, qIdx) => {
            const isAnswered = !!selectedAnswers[q.id];
            const isCurrent = currentQuestionIndex === qIdx;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(qIdx)}
                className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-violet-600 text-white ring-2 ring-violet-400'
                    : isAnswered
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                    : 'bg-[#18181B] text-zinc-500 border border-[#27272A]'
                }`}
              >
                {qIdx + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. POST-SUBMISSION RESULTS & EXPLANATIONS SCREEN
  if (gameState === 'RESULTS' && result) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Results Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#111114] via-[#18181B] to-[#141418] border border-[#27272A] rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#F5C451]">
              Daily Challenge Complete
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white">
              {result.score >= 80 ? 'Mastery Achieved!' : result.score >= 50 ? 'Good Effort!' : 'Keep Learning!'}
            </h1>
            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto">
              Your answers have been verified on the server and your weekly championship standings have been updated.
            </p>
          </div>

          {/* Score Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto font-mono text-xs">
            <div className="bg-[#09090B] border border-[#27272A] rounded-xl p-3">
              <span className="text-zinc-500 block text-[10px]">FINAL SCORE</span>
              <span className="text-2xl font-black text-emerald-400 mt-0.5 block">{result.score}%</span>
            </div>
            <div className="bg-[#09090B] border border-[#27272A] rounded-xl p-3">
              <span className="text-zinc-500 block text-[10px]">POINTS EARNED</span>
              <span className="text-2xl font-black text-amber-400 mt-0.5 block">+{result.pointsEarned}</span>
            </div>
            <div className="bg-[#09090B] border border-[#27272A] rounded-xl p-3">
              <span className="text-zinc-500 block text-[10px]">CORRECT</span>
              <span className="text-2xl font-black text-white mt-0.5 block">
                {result.correctAnswers}/{result.totalQuestions}
              </span>
            </div>
            <div className="bg-[#09090B] border border-[#27272A] rounded-xl p-3">
              <span className="text-zinc-500 block text-[10px]">LEAGUE RANK</span>
              <span className="text-2xl font-black text-violet-400 mt-0.5 block">
                #{result.newRank || 1}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/quiz-league/leaderboard"
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-violet-600/30"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>View Updated Leaderboard</span>
            </Link>
            <Link
              href="/quiz-league"
              className="px-5 py-2.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-zinc-300 text-xs font-semibold border border-[#27272A]"
            >
              Back to Overview
            </Link>
          </div>
        </motion.div>

        {/* Detailed Question Explanations Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Question Explanations & Answer Key
            </h3>
            <span className="text-xs font-mono text-zinc-400">
              {result.breakdown.length} questions reviewed
            </span>
          </div>

          {result.breakdown.map((item, idx) => (
            <div
              key={item.questionId || idx}
              className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${
                item.isCorrect
                  ? 'bg-[#111114] border-emerald-500/30'
                  : 'bg-[#111114] border-red-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-zinc-500 block">Question {idx + 1}</span>
                  <h4 className="text-sm sm:text-base font-bold text-white">{item.question}</h4>
                </div>
                {item.isCorrect ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> +{item.pointsAwarded} XP
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/30 flex-shrink-0">
                    <XCircle className="w-3.5 h-3.5" /> 0 XP
                  </span>
                )}
              </div>

              {/* Answers comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-3">
                  <span className="text-[10px] text-zinc-500 block">YOUR ANSWER</span>
                  <span className={`block font-semibold mt-1 ${item.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                    {item.selectedText || 'No answer selected'}
                  </span>
                </div>
                <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-3">
                  <span className="text-[10px] text-zinc-500 block">CORRECT ANSWER</span>
                  <span className="text-emerald-400 font-semibold block mt-1">
                    {item.correctText}
                  </span>
                </div>
              </div>

              {/* Protocol Explanation */}
              <div className="bg-[#09090B] border border-[#27272A] rounded-xl p-3.5 text-xs text-zinc-300 leading-relaxed font-sans">
                <span className="font-mono font-bold text-violet-400 block mb-1 text-[11px] uppercase tracking-wider">
                  Technical Explanation:
                </span>
                {item.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
