'use client';

import React, { useEffect, useState, use, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  CheckSquare,
  ListOrdered,
  Bug,
  MoveUp,
  MoveDown,
  LogOut,
  BookOpen,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { TrophyRenderer } from '@/app/components/quiz-league/trophies/TrophyRenderer';

// Built-in Web Audio API synthesizer for zero-dependency sound interactions
class QuizSoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playTick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {}
  }

  playSelect() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(650, this.ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {}
  }

  playChime() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      // Uplifting two-note major chime (C5 523Hz -> E5 659Hz)
      [523.25, 659.25].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const startTime = this.ctx.currentTime + idx * 0.08;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.07, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.28);
      });
    } catch {}
  }

  playBuzz() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {}
  }

  playFanfare() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const startTime = this.ctx.currentTime + idx * 0.1;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.09, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch {}
  }
}

const sounds = new QuizSoundEffects();

interface QuestionOption {
  id: string;
  orderIndex: number;
  text: string;
  isCorrect?: boolean;
}

type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'CODE_ORDERING' | 'VULNERABILITY_DEBUG';

interface Question {
  id: string;
  orderIndex: number;
  question: string;
  type?: QuestionType;
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
    selectedOptionId?: string | null;
    selectedOptionIds?: string[];
    selectedText?: string | null;
    correctOptionId?: string | null;
    correctOptionIds?: string[];
    correctText?: string | null;
    submittedOrder?: string[];
    expectedOrder?: string[];
    isCorrect: boolean;
    pointsAwarded: number;
    explanation: string;
  }>;
  newRank?: number;
  totalWeeklyPoints?: number;
  currentStreak?: number;
  isPractice?: boolean;
}

function QuizLoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      <div className="h-4 w-32 bg-muted rounded" />
      <div className="rounded-3xl border border-border/70 bg-card/60 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 bg-muted rounded-full" />
          <div className="h-4 w-36 bg-muted rounded" />
        </div>
        <div className="space-y-3">
          <div className="h-8 w-3/4 bg-muted rounded-lg" />
          <div className="h-4 w-1/2 bg-muted/60 rounded" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="h-20 bg-muted/30 rounded-2xl" />
          <div className="h-20 bg-muted/30 rounded-2xl" />
          <div className="h-20 bg-muted/30 rounded-2xl" />
        </div>
        <div className="h-12 bg-muted/50 rounded-xl" />
      </div>
    </div>
  );
}

function DailyQuizContent({
  params,
  searchParams,
}: {
  params: Promise<{ quizId: string }>;
  searchParams?: Promise<{ mode?: string }>;
}) {
  const { quizId } = use(params);
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const isPractice = searchParamsHook?.get('mode') === 'practice';

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Flow State: 'BRIEFING' | 'ACTIVE' | 'RESULTS'
  const [gameState, setGameState] = useState<'BRIEFING' | 'ACTIVE' | 'RESULTS'>('BRIEFING');

  // Controls
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  // Active Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Answers storage
  const [singleAnswers, setSingleAnswers] = useState<Record<string, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<string, string[]>>({});
  const [orderAnswers, setOrderAnswers] = useState<Record<string, string[]>>({});
  const [debugAnswers, setDebugAnswers] = useState<Record<string, string>>({});

  // Practice instant feedback state
  const [practiceRevealed, setPracticeRevealed] = useState<Record<string, boolean>>({});

  const [timerSeconds, setTimerSeconds] = useState(300);
  const [submitting, setSubmitting] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  // Result State
  const [result, setResult] = useState<AttemptResult | null>(null);

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen request:', err);
    }
  };

  const toggleSound = () => {
    sounds.enabled = soundMuted;
    setSoundMuted(!soundMuted);
  };

  // Fetch Quiz
  useEffect(() => {
    // Instant cache-first load
    try {
      const cached = sessionStorage.getItem(`ethshala_quiz_${quizId}`);
      if (cached) {
        const data = JSON.parse(cached);
        if (data?.quiz) {
          setQuiz(data.quiz);
          setTimerSeconds((data.quiz.durationMinutes || 5) * 60);

          if (data.quiz?.questions) {
            const initialOrders: Record<string, string[]> = {};
            data.quiz.questions.forEach((q: Question) => {
              if (q.type === 'CODE_ORDERING') {
                initialOrders[q.id] = q.options.map((o) => o.id);
              }
            });
            setOrderAnswers(initialOrders);
          }

          if (data.alreadySubmitted && data.attempt && !isPractice) {
            setResult({
              score: data.attempt.score,
              pointsEarned: data.attempt.pointsEarned,
              totalQuestions: data.attempt.totalQuestions,
              correctAnswers: data.attempt.correctAnswers,
              timeSpentSeconds: data.attempt.timeSpentSeconds,
              breakdown: data.attempt.userAnswers,
              isPractice: false,
            });
            setGameState('RESULTS');
          }
          setLoading(false);
        }
      }
    } catch {}

    fetch(`/api/quiz-league/quiz/${quizId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setQuiz(data.quiz);
          setTimerSeconds((data.quiz.durationMinutes || 5) * 60);

          try {
            sessionStorage.setItem(`ethshala_quiz_${quizId}`, JSON.stringify(data));
          } catch {}

          if (data.quiz?.questions) {
            const initialOrders: Record<string, string[]> = {};
            data.quiz.questions.forEach((q: Question) => {
              if (q.type === 'CODE_ORDERING') {
                initialOrders[q.id] = q.options.map((o) => o.id);
              }
            });
            setOrderAnswers(initialOrders);
          }

          // If already submitted and NOT in practice mode, jump directly to results
          if (data.alreadySubmitted && data.attempt && !isPractice) {
            setResult({
              score: data.attempt.score,
              pointsEarned: data.attempt.pointsEarned,
              totalQuestions: data.attempt.totalQuestions,
              correctAnswers: data.attempt.correctAnswers,
              timeSpentSeconds: data.attempt.timeSpentSeconds,
              breakdown: data.attempt.userAnswers,
              isPractice: false,
            });
            setGameState('RESULTS');
          }
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [quizId, isPractice]);

  // Submit Handler
  const handleSubmit = useCallback(async () => {
    if (!quiz || submitting) return;
    setSubmitting(true);

    const answersPayload = quiz.questions.map((q) => {
      const qType = q.type || 'SINGLE_CHOICE';
      if (qType === 'MULTIPLE_CHOICE') {
        return { questionId: q.id, selectedOptionIds: multiAnswers[q.id] || [] };
      }
      if (qType === 'CODE_ORDERING') {
        return { questionId: q.id, orderedOptionIds: orderAnswers[q.id] || q.options.map((o) => o.id) };
      }
      if (qType === 'VULNERABILITY_DEBUG') {
        return { questionId: q.id, selectedOptionId: debugAnswers[q.id] || null };
      }
      return { questionId: q.id, selectedOptionId: singleAnswers[q.id] || null };
    });

    try {
      const res = await fetch(`/api/quiz-league/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: answersPayload,
          timeSpentSeconds: timeSpent,
          isPractice,
        }),
      });

      const json = await res.json();
      if (res.ok && json.result) {
        setResult(json.result);
        setGameState('RESULTS');
        sounds.playFanfare();

        if (json.result.score >= 70) {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#10b981', '#059669', '#f59e0b', '#3b82f6'],
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
  }, [quiz, submitting, singleAnswers, multiAnswers, orderAnswers, debugAnswers, quizId, timeSpent, isPractice]);

  // Timer loop
  useEffect(() => {
    if (gameState !== 'ACTIVE') return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        // Soft ticking tension in the last 30 seconds
        if (prev <= 30) {
          sounds.playTick();
        }
        return prev - 1;
      });
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, handleSubmit]);

  // Start challenge handler (Strict server timer for ranked mode)
  const handleBeginChallenge = () => {
    sounds.playSelect();
    setGameState('ACTIVE');
    if (!isPractice) {
      fetch(`/api/quiz-league/quiz/${quizId}/start`, { method: 'POST' }).catch((e) => {
        console.warn('Strict server timer init error:', e);
      });
    }
  };

  const handleSelectSingle = (questionId: string, optionId: string) => {
    sounds.playSelect();
    setSingleAnswers((prev) => ({ ...prev, [questionId]: optionId }));

    if (isPractice && quiz) {
      const q = quiz.questions.find((item) => item.id === questionId);
      if (q) {
        setPracticeRevealed((prev) => ({ ...prev, [questionId]: true }));
        const correctOpt = q.options.find((o) => o.isCorrect);
        if (correctOpt && correctOpt.id === optionId) {
          sounds.playChime();
        } else {
          sounds.playBuzz();
        }
      }
    }
  };

  const handleToggleMulti = (questionId: string, optionId: string) => {
    sounds.playSelect();
    setMultiAnswers((prev) => {
      const current = prev[questionId] || [];
      const exists = current.includes(optionId);
      const updated = exists ? current.filter((id) => id !== optionId) : [...current, optionId];
      return { ...prev, [questionId]: updated };
    });
  };

  const handleMoveOrder = (questionId: string, index: number, direction: 'UP' | 'DOWN') => {
    sounds.playSelect();
    setOrderAnswers((prev) => {
      const current = [...(prev[questionId] || quiz?.questions.find((q) => q.id === questionId)?.options.map((o) => o.id) || [])];
      const targetIndex = direction === 'UP' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.length) return prev;
      const temp = current[index];
      current[index] = current[targetIndex];
      current[targetIndex] = temp;
      return { ...prev, [questionId]: current };
    });
  };

  const handleSelectDebug = (questionId: string, optionId: string) => {
    sounds.playSelect();
    setDebugAnswers((prev) => ({ ...prev, [questionId]: optionId }));

    if (isPractice && quiz) {
      const q = quiz.questions.find((item) => item.id === questionId);
      if (q) {
        setPracticeRevealed((prev) => ({ ...prev, [questionId]: true }));
        const correctOpt = q.options.find((o) => o.isCorrect);
        if (correctOpt && correctOpt.id === optionId) {
          sounds.playChime();
        } else {
          sounds.playBuzz();
        }
      }
    }
  };

  const handleVerifyPractice = (questionId: string) => {
    if (!quiz) return;
    const q = quiz.questions.find((item) => item.id === questionId);
    if (!q) return;

    setPracticeRevealed((prev) => ({ ...prev, [questionId]: true }));

    let isCorrect = false;
    const qType = q.type || 'SINGLE_CHOICE';
    if (qType === 'MULTIPLE_CHOICE') {
      const correctOptIds = q.options.filter((o) => o.isCorrect).map((o) => o.id).sort();
      const userSelected = (multiAnswers[questionId] || []).slice().sort();
      isCorrect = correctOptIds.length === userSelected.length && correctOptIds.every((id, i) => id === userSelected[i]);
    } else if (qType === 'CODE_ORDERING') {
      const expectedOrder = q.options.map((o) => o.id);
      const submittedOrder = orderAnswers[questionId] || [];
      isCorrect = expectedOrder.length === submittedOrder.length && expectedOrder.every((id, i) => id === submittedOrder[i]);
    }

    if (isCorrect) {
      sounds.playChime();
    } else {
      sounds.playBuzz();
    }
  };

  const handleNext = () => {
    sounds.playSelect();
    if (!quiz) return;
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    sounds.playSelect();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return <QuizLoadingSkeleton />;
  }

  if (error || !quiz) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-2xl border border-border bg-card text-center space-y-4">
        <ShieldAlert className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-foreground">Challenge Unavailable</h2>
        <p className="text-xs text-muted-foreground">{error || 'Unable to retrieve quiz challenge.'}</p>
        <Link
          href="/quiz-league/daily"
          className="inline-block px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-colors cursor-pointer"
        >
          Return to Arena
        </Link>
      </div>
    );
  }

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  // 1. BRIEFING SCREEN (Clean, matches ETHShala)
  if (gameState === 'BRIEFING') {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-8">
        {/* Practice Mode Banner */}
        {isPractice && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-3">
            <BookOpen className="w-5 h-5 shrink-0 text-amber-500" />
            <div>
              <span className="font-bold block">📘 Unranked Practice / Study Mode</span>
              <span>Test your technical knowledge with instant answer reveals and explanations. Unranked attempt does not modify your competitive points.</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary dark:text-emerald-400">
              Week {quiz.weekNumber} • Day {quiz.dayIndex} Challenge
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight font-display">
            {quiz.title}
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Topic: <span className="text-foreground font-semibold font-mono">{quiz.topic}</span>. Test your smart contract and protocol knowledge in this timed challenge.
          </p>
        </div>

        {/* Clean metadata strip */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono border-y border-border/70 py-4 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-amber-500" /> {quiz.durationMinutes} Minutes
          </span>
          <span>•</span>
          <span>{quiz.questions.length} Questions</span>
          <span>•</span>
          <span className="text-amber-600 dark:text-amber-400 font-bold">+{quiz.maxPoints} Max XP</span>
          <span>•</span>
          <span className={isPractice ? 'text-amber-500 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-bold'}>
            {isPractice ? 'Practice Attempt (Unranked)' : 'Strict Server-Timed Ranked Attempt'}
          </span>
        </div>

        {/* Guidelines */}
        <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
          <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px]">
            Challenge Guidelines:
          </h4>
          <ul className="space-y-2 list-disc list-inside">
            <li>Interactive formats: single choice, multi-select checkboxes, code ordering, and vulnerability debugging.</li>
            <li>Server validates start and submit timestamps to maintain strict competitive anti-cheat standards.</li>
            <li>Toggle <strong>Fullscreen Mode</strong> anytime to minimize external distractions.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/quiz-league/daily"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Challenges
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
            </button>

            <button
              onClick={handleBeginChallenge}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>{isPractice ? 'Begin Practice Session' : 'Begin Challenge'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. ACTIVE QUIZ STAGE
  if (gameState === 'ACTIVE') {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const totalQuestions = quiz.questions.length;
    const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
    const qType = currentQuestion.type || 'SINGLE_CHOICE';
    const isRevealedInPractice = isPractice && !!practiceRevealed[currentQuestion.id];

    return (
      <div className="max-w-2xl mx-auto py-4 space-y-6">
        {/* Practice Mode Strip */}
        {isPractice && (
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-mono flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold">
              <BookOpen size={14} /> Practice Mode Active
            </span>
            <span>Unranked • Instant Explanations</span>
          </div>
        )}

        {/* Arena Top Bar */}
        <div className="flex items-center justify-between border-b border-border/70 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/quiz-league/daily"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title="Exit Arena"
            >
              <LogOut size={16} />
            </Link>
            <span className="text-xs font-mono font-bold text-muted-foreground">
              Question <span className="text-foreground">{currentQuestionIndex + 1}</span> of {totalQuestions}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleSound}
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title={soundMuted ? 'Unmute' : 'Mute'}
            >
              {soundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            {/* Countdown Clock with Micro-Interaction tension states */}
            <div
              className={`flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                timerSeconds <= 30
                  ? 'bg-red-500/15 border-red-500/40 text-red-500 animate-pulse'
                  : timerSeconds <= 60
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                  : 'bg-muted/40 border-border text-foreground'
              }`}
            >
              <Clock size={13} className={timerSeconds <= 30 ? 'text-red-500 animate-spin' : 'text-amber-500'} />
              <span>{formatTimer(timerSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Progress Line */}
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Area */}
        <div className="space-y-6 pt-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                {qType === 'SINGLE_CHOICE' && <CheckCircle2 size={13} />}
                {qType === 'MULTIPLE_CHOICE' && <CheckSquare size={13} />}
                {qType === 'CODE_ORDERING' && <ListOrdered size={13} />}
                {qType === 'VULNERABILITY_DEBUG' && <Bug size={13} />}
                <span>{qType.replace(/_/g, ' ')}</span>
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">+{currentQuestion.points} XP</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug font-display">
              {currentQuestion.question}
            </h2>

            {currentQuestion.codeSnippet && qType !== 'VULNERABILITY_DEBUG' && (
              <div className="bg-muted/50 border border-border/80 rounded-xl p-3.5 font-mono text-xs text-foreground overflow-x-auto my-3">
                <pre>{currentQuestion.codeSnippet}</pre>
              </div>
            )}
          </div>

          {/* 1. SINGLE_CHOICE */}
          {qType === 'SINGLE_CHOICE' && (
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = singleAnswers[currentQuestion.id] === option.id;
                const letter = String.fromCharCode(65 + idx);

                // Practice mode feedback styling
                let borderClass = 'border-border/80 bg-card hover:bg-muted/50 text-foreground';
                if (isRevealedInPractice) {
                  if (option.isCorrect) {
                    borderClass = 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500';
                  } else if (isSelected && !option.isCorrect) {
                    borderClass = 'border-red-500 bg-red-500/15 text-red-600 dark:text-red-400';
                  }
                } else if (isSelected) {
                  borderClass = 'border-emerald-500 bg-emerald-500/10 text-foreground ring-1 ring-emerald-500';
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectSingle(currentQuestion.id, option.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${borderClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs ${
                          isRevealedInPractice && option.isCorrect
                            ? 'bg-emerald-600 text-white'
                            : isRevealedInPractice && isSelected && !option.isCorrect
                            ? 'bg-red-500 text-white'
                            : isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="text-sm font-medium">{option.text}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-emerald-500 bg-emerald-600' : 'border-muted-foreground/40'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 2. MULTIPLE_CHOICE */}
          {qType === 'MULTIPLE_CHOICE' && (
            <div className="space-y-2.5">
              <span className="text-xs font-mono text-muted-foreground block">
                Select all that apply (partial credit awarded for valid subsets):
              </span>
              {currentQuestion.options.map((option, idx) => {
                const selectedList = multiAnswers[currentQuestion.id] || [];
                const isSelected = selectedList.includes(option.id);
                const letter = String.fromCharCode(65 + idx);

                let borderClass = 'border-border/80 bg-card hover:bg-muted/50 text-foreground';
                if (isRevealedInPractice) {
                  if (option.isCorrect) {
                    borderClass = 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500';
                  } else if (isSelected && !option.isCorrect) {
                    borderClass = 'border-red-500 bg-red-500/15 text-red-600 dark:text-red-400';
                  }
                } else if (isSelected) {
                  borderClass = 'border-emerald-500 bg-emerald-500/10 text-foreground ring-1 ring-emerald-500';
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleToggleMulti(currentQuestion.id, option.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${borderClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="text-sm font-medium">{option.text}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        isSelected ? 'border-emerald-500 bg-emerald-600 text-white' : 'border-muted-foreground/40'
                      }`}
                    >
                      {isSelected && <CheckSquare size={13} />}
                    </div>
                  </button>
                );
              })}

              {isPractice && !isRevealedInPractice && (
                <button
                  onClick={() => handleVerifyPractice(currentQuestion.id)}
                  className="mt-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={13} /> Check Answer & Reveal Explanation
                </button>
              )}
            </div>
          )}

          {/* 3. CODE_ORDERING */}
          {qType === 'CODE_ORDERING' && (
            <div className="space-y-2.5">
              <span className="text-xs font-mono text-muted-foreground block">
                Arrange lines into the correct execution sequence:
              </span>
              {(orderAnswers[currentQuestion.id] || currentQuestion.options.map((o) => o.id)).map((optId, index, arr) => {
                const option = currentQuestion.options.find((o) => o.id === optId);
                if (!option) return null;

                return (
                  <div
                    key={option.id}
                    className="p-3 rounded-xl border border-border/80 bg-card flex items-center justify-between gap-3 font-mono text-xs"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-muted flex items-center justify-center font-bold text-muted-foreground text-[10px] shrink-0">
                        {index + 1}
                      </span>
                      <span className="truncate text-foreground">{option.text}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleMoveOrder(currentQuestion.id, index, 'UP')}
                        disabled={index === 0}
                        className="p-1 rounded-md border border-border hover:bg-muted disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <MoveUp size={13} />
                      </button>
                      <button
                        onClick={() => handleMoveOrder(currentQuestion.id, index, 'DOWN')}
                        disabled={index === arr.length - 1}
                        className="p-1 rounded-md border border-border hover:bg-muted disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <MoveDown size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {isPractice && !isRevealedInPractice && (
                <button
                  onClick={() => handleVerifyPractice(currentQuestion.id)}
                  className="mt-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={13} /> Verify Sequence & Explanation
                </button>
              )}
            </div>
          )}

          {/* 4. VULNERABILITY_DEBUG */}
          {qType === 'VULNERABILITY_DEBUG' && (
            <div className="space-y-2.5">
              <span className="text-xs font-mono text-red-500 block">
                Click the line containing the security bug or vulnerability:
              </span>
              <div className="rounded-xl border border-border/80 bg-card overflow-hidden font-mono text-xs">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = debugAnswers[currentQuestion.id] === option.id;

                  let rowClass = 'hover:bg-muted/50 text-foreground';
                  if (isRevealedInPractice) {
                    if (option.isCorrect) {
                      rowClass = 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border-l-4 border-l-emerald-500';
                    } else if (isSelected && !option.isCorrect) {
                      rowClass = 'bg-red-500/20 text-red-600 dark:text-red-400 font-bold border-l-4 border-l-red-500';
                    }
                  } else if (isSelected) {
                    rowClass = 'bg-red-500/15 text-red-600 dark:text-red-400 font-bold border-l-4 border-l-red-500';
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectDebug(currentQuestion.id, option.id)}
                      className={`w-full text-left px-3.5 py-2.5 border-b border-border/60 last:border-b-0 flex items-center gap-3 transition-colors cursor-pointer ${rowClass}`}
                    >
                      <span className="w-5 text-right text-muted-foreground select-none text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="flex-1 truncate">{option.text}</span>
                      {isSelected && (
                        <span className="text-[10px] uppercase font-bold text-red-500 px-1.5 py-0.5 rounded bg-red-500/10">
                          Flagged
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Practice Mode Instant Explanation Box */}
          {isRevealedInPractice && currentQuestion.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-xs text-foreground space-y-1.5"
            >
              <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={14} />
                <span>Technical Architecture Analysis:</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </motion.div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-border/70">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30 flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft size={15} /> Previous
            </button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                Next <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {submitting ? 'Verifying...' : isPractice ? 'Complete Practice' : 'Submit Challenge'}
                <CheckCircle2 size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. RESULTS SCREEN
  if (gameState === 'RESULTS' && result) {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-8">
        <div className="text-center space-y-4">
          {/* Floating Transparent Trophy */}
          <div className="flex justify-center py-2">
            <TrophyRenderer
              type={result.score >= 80 ? 'CHAMPION' : result.score >= 50 ? 'RUNNER_UP' : 'THIRD_PLACE'}
              size={140}
              glow={true}
            />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              {result.isPractice ? 'Practice Session Completed' : 'Daily Challenge Complete'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground font-display">
              {result.score >= 80 ? 'Mastery Achieved!' : result.score >= 50 ? 'Solid Effort!' : 'Keep Learning!'}
            </h1>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {result.isPractice
                ? 'Unranked practice attempt finished. Your technical breakdown is detailed below.'
                : 'Your results are verified and recorded on your weekly championship standing.'}
            </p>
          </div>

          {/* Metrics Strip */}
          <div className="flex items-center justify-center gap-6 font-mono text-xs border-y border-border/70 py-3">
            <div>
              <span className="text-muted-foreground block text-[10px]">SCORE</span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{result.score}%</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div>
              <span className="text-muted-foreground block text-[10px]">XP EARNED</span>
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                {result.isPractice ? '0 (Unranked)' : `+${result.pointsEarned}`}
              </span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div>
              <span className="text-muted-foreground block text-[10px]">ACCURACY</span>
              <span className="text-xl font-bold text-foreground">{result.correctAnswers}/{result.totalQuestions}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            {!result.isPractice && (
              <Link
                href="/quiz-league/leaderboard"
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Trophy size={14} className="text-amber-400" />
                <span>View Leaderboard</span>
              </Link>
            )}

            <Link
              href="/quiz-league/daily"
              className="px-4 py-2.5 rounded-xl border border-border hover:bg-muted text-foreground text-xs font-semibold transition-colors cursor-pointer"
            >
              Back to Challenges
            </Link>

            {result.isPractice && (
              <button
                onClick={() => {
                  setGameState('ACTIVE');
                  setCurrentQuestionIndex(0);
                  setPracticeRevealed({});
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} /> Practice Again
              </button>
            )}
          </div>
        </div>

        {/* Technical Explanations */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono">
            Question Explanations & Review
          </h3>

          <div className="space-y-3">
            {result.breakdown.map((item, idx) => (
              <div
                key={item.questionId || idx}
                className="rounded-xl border border-border/80 bg-card p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-bold text-foreground">
                    {idx + 1}. {item.question}
                  </span>
                  {item.isCorrect ? (
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center gap-1">
                      <CheckCircle2 size={14} /> {result.isPractice ? 'Correct' : `+${item.pointsAwarded} XP`}
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-bold text-red-500 shrink-0 flex items-center gap-1">
                      <XCircle size={14} /> {result.isPractice ? 'Incorrect' : '0 XP'}
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono space-y-1">
                  <div className="text-muted-foreground">
                    Your Answer:{' '}
                    <span className={item.isCorrect ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-red-500 font-semibold'}>
                      {item.selectedText || (item.selectedOptionIds && item.selectedOptionIds.length > 0 ? `${item.selectedOptionIds.length} options selected` : item.submittedOrder ? 'Sequence arranged' : 'No answer')}
                    </span>
                  </div>
                  {!item.isCorrect && item.correctText && (
                    <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Correct Answer: {item.correctText}
                    </div>
                  )}
                </div>

                {item.explanation && (
                  <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground leading-relaxed">
                    <span className="font-mono font-bold text-foreground text-[11px] block mb-0.5">Explanation:</span>
                    {item.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function DailyQuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ quizId: string }>;
  searchParams?: Promise<{ mode?: string }>;
}) {
  return (
    <Suspense fallback={<QuizLoadingSkeleton />}>
      <DailyQuizContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
