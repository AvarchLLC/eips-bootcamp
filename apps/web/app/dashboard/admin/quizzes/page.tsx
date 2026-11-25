'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/app/lib/auth-client';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import {
  ShieldAlert,
  Plus,
  Edit2,
  CheckCircle2,
  Trophy,
  Users,
  Flame,
  Clock,
  Sparkles,
  RefreshCw,
  Eye,
  AlertTriangle,
  ArrowRight,
  X,
  Code,
  Bug,
  ListOrdered,
  CheckSquare,
  Send,
  Loader2,
} from 'lucide-react';

export default function QuizLeagueAdminDashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'QUIZZES' | 'COMPETITIONS'>('QUIZZES');

  // Modal / Creator State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiDrafting, setAiDrafting] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

  // Form Fields
  const [selectedWeekId, setSelectedWeekId] = useState('');
  const [dayIndex, setDayIndex] = useState(1);
  const [eipInput, setEipInput] = useState('EIP-7702');
  const [topicInput, setTopicInput] = useState('Set EOA Account Code');
  const [difficulty, setDifficulty] = useState('INTERMEDIATE');
  const [quizTitle, setQuizTitle] = useState('');
  const [quizTopic, setQuizTopic] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(5);
  const [maxPoints, setMaxPoints] = useState(100);
  const [draftedQuestions, setDraftedQuestions] = useState<any[]>([]);

  // Access check
  useEffect(() => {
    if (!isPending) {
      if (!user) {
        router.replace('/sign-in');
      } else if ((user as any).role !== 'ADMIN') {
        router.replace('/dashboard');
      }
    }
  }, [isPending, user, router]);

  const fetchOverview = () => {
    setLoading(true);
    fetch('/api/quiz-league/admin/overview')
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) {
          setData(json);
          if (json.weeks?.length > 0 && !selectedWeekId) {
            setSelectedWeekId(json.weeks[0].id);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user && (user as any).role === 'ADMIN') {
      fetchOverview();
    }
  }, [user]);

  // AI Question Generation
  const handleGenerateAI = async () => {
    setAiDrafting(true);
    setActionError('');
    try {
      const res = await fetch('/api/quiz-league/admin/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eip: eipInput,
          topic: topicInput,
          difficulty,
        }),
      });

      const json = await res.json();
      if (res.ok && json.quiz) {
        setQuizTitle(json.quiz.title || `${eipInput}: ${topicInput}`);
        setQuizTopic(json.quiz.topic || topicInput);
        setDurationMinutes(json.quiz.durationMinutes || 5);
        setMaxPoints(json.quiz.maxPoints || 100);
        setDraftedQuestions(json.quiz.questions || []);
      } else {
        setActionError(json.error || 'Failed to generate questions');
      }
    } catch (e: any) {
      setActionError(e.message || 'AI Generation failed');
    } finally {
      setAiDrafting(false);
    }
  };

  // Publish Quiz
  const handlePublishQuiz = async () => {
    if (!selectedWeekId || !quizTitle || draftedQuestions.length === 0) {
      setActionError('Please select a week, title, and at least one question.');
      return;
    }

    setSubmitting(true);
    setActionError('');
    try {
      const res = await fetch('/api/quiz-league/admin/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekId: selectedWeekId,
          dayIndex: Number(dayIndex),
          title: quizTitle,
          topic: quizTopic || topicInput,
          durationMinutes: Number(durationMinutes),
          maxPoints: Number(maxPoints),
          isPublished: true,
          questions: draftedQuestions,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        setActionMessage(`Quiz successfully published for Day ${dayIndex}: ${quizTitle}`);
        setShowModal(false);
        setDraftedQuestions([]);
        fetchOverview();
      } else {
        setActionError(json.error || 'Failed to save quiz');
      }
    } catch (e: any) {
      setActionError(e.message || 'Failed to save quiz');
    } finally {
      setSubmitting(false);
    }
  };

  // Dispatch Streak Reminders
  const handleSendStreakReminders = async () => {
    if (!confirm('Send streak protection reminder emails to all builders who haven’t completed today’s quiz?')) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/quiz-league/reminders/send', { method: 'POST' });
      const json = await res.json();
      if (res.ok) {
        setActionMessage(`Streak reminders processed: ${json.sentCount || 0} emails dispatched.`);
      } else {
        alert(json.error || 'Failed to send reminders');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || loading) {
    return (
      <DashboardShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-muted-foreground">Verifying Administrator Privileges...</span>
        </div>
      </DashboardShell>
    );
  }

  if (!user || (user as any).role !== 'ADMIN') {
    return null;
  }

  const quizzes = data?.quizzes || [];
  const weeks = data?.weeks || [];
  const recentAttempts = data?.recentAttempts || [];

  return (
    <DashboardShell>
      <div className="space-y-8 max-w-6xl mx-auto py-4">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider">
              <ShieldAlert className="w-4 h-4 text-emerald-500" />
              <span>Admin Management Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground font-display mt-1">
              Quiz League Admin Console
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
              Author daily protocol quizzes, auto-draft questions with AI, audit attempts, and dispatch streak protection reminders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSendStreakReminders}
              disabled={submitting}
              className="px-3.5 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Send streak protection emails to builders who haven't completed today's quiz"
            >
              <Send className="w-3.5 h-3.5" /> Send Streak Reminders
            </button>

            <button
              onClick={() => {
                setShowModal(true);
                if (draftedQuestions.length === 0) {
                  handleGenerateAI();
                }
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer transition-colors"
            >
              <Sparkles className="w-4 h-4" /> AI Question Generator
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-muted/40 border border-border p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('QUIZZES')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'QUIZZES' ? 'bg-emerald-600 text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Quizzes ({quizzes.length})
          </button>
          <button
            onClick={() => setActiveTab('COMPETITIONS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'COMPETITIONS' ? 'bg-emerald-600 text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Audits & Attempts ({recentAttempts.length})
          </button>
        </div>

        {actionMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-center justify-between">
            <span>{actionMessage}</span>
            <button onClick={() => setActionMessage('')} className="text-xs hover:underline cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: QUIZZES */}
        {activeTab === 'QUIZZES' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground font-display">Published Daily Challenges</h3>
                <p className="text-xs text-muted-foreground">Manage active curriculum quizzes across cohort weeks.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz: any) => (
                <div
                  key={quiz.id}
                  className="bg-card border border-border rounded-2xl p-5 space-y-4 hover:border-emerald-500/40 transition-all shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      Week {quiz.week?.weekNumber || 1} • Day {quiz.dayIndex}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground font-semibold">
                      {quiz.questions?.length || 0} Questions
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-foreground font-display line-clamp-1">{quiz.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">{quiz.topic}</p>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-mono">
                    <span className="text-muted-foreground">{quiz.durationMinutes}m limit</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">+{quiz.maxPoints} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: AUDITS & ATTEMPTS */}
        {activeTab === 'COMPETITIONS' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-foreground font-display">Student Submission Logs</h3>
              <p className="text-xs text-muted-foreground">Real-time anti-cheat audit logs of quiz attempts.</p>
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3.5">Student Builder</th>
                    <th className="p-3.5">Quiz Challenged</th>
                    <th className="p-3.5">Score</th>
                    <th className="p-3.5">Points</th>
                    <th className="p-3.5">Time Spent</th>
                    <th className="p-3.5">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {recentAttempts.map((att: any) => (
                    <tr key={att.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3.5 font-semibold text-foreground">{att.user?.name || att.user?.email || 'Student'}</td>
                      <td className="p-3.5 text-muted-foreground">{att.quiz?.title || 'Quiz'}</td>
                      <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">{att.score}%</td>
                      <td className="p-3.5 text-amber-600 dark:text-amber-400">+{att.pointsEarned} XP</td>
                      <td className="p-3.5 text-muted-foreground">{att.timeSpentSeconds}s</td>
                      <td className="p-3.5 text-muted-foreground text-[11px]">
                        {new Date(att.completedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {recentAttempts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No student submission logs recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AI QUESTION GENERATOR MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
              {/* Modal Header */}
              <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground font-display">AI Question Generator</h3>
                    <p className="text-xs text-muted-foreground">Draft 5 balanced technical questions for any EIP or topic.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 overflow-y-auto">
                {actionError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-mono">
                    {actionError}
                  </div>
                )}

                {/* Generator Configuration Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border border-border bg-muted/30">
                  <div>
                    <label className="text-[11px] font-mono font-bold uppercase text-muted-foreground block mb-1">
                      EIP / Standard
                    </label>
                    <input
                      type="text"
                      value={eipInput}
                      onChange={(e) => setEipInput(e.target.value)}
                      placeholder="e.g. EIP-7702, ERC-4337"
                      className="w-full bg-card border border-border rounded-lg px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono font-bold uppercase text-muted-foreground block mb-1">
                      Topic / Focus
                    </label>
                    <input
                      type="text"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      placeholder="e.g. Account Delegation"
                      className="w-full bg-card border border-border rounded-lg px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono font-bold uppercase text-muted-foreground block mb-1">
                      Difficulty
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full bg-card border border-border rounded-lg px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="BEGINNER">BEGINNER</option>
                      <option value="INTERMEDIATE">INTERMEDIATE</option>
                      <option value="ADVANCED">ADVANCED</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3 flex justify-end pt-1">
                    <button
                      onClick={handleGenerateAI}
                      disabled={aiDrafting}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                    >
                      {aiDrafting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> Drafting Questions...
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} /> Draft 5 Questions with AI
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Target Competition Assignment */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-mono font-bold uppercase text-muted-foreground block mb-1">
                      Target Week
                    </label>
                    <select
                      value={selectedWeekId}
                      onChange={(e) => setSelectedWeekId(e.target.value)}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {weeks.map((w: any) => (
                        <option key={w.id} value={w.id}>
                          Week {w.weekNumber}: {w.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono font-bold uppercase text-muted-foreground block mb-1">
                      Day Index (1-7)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={7}
                      value={dayIndex}
                      onChange={(e) => setDayIndex(Number(e.target.value))}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-mono font-bold uppercase text-muted-foreground block mb-1">
                      Quiz Title
                    </label>
                    <input
                      type="text"
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      placeholder="Title of Challenge"
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Drafted Questions Preview */}
                {draftedQuestions.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs font-mono font-bold uppercase text-foreground flex items-center justify-between">
                      <span>Drafted Question Spectrum ({draftedQuestions.length} Questions)</span>
                      <span className="text-emerald-600 dark:text-emerald-400">Total: 100 XP</span>
                    </h4>

                    <div className="space-y-3">
                      {draftedQuestions.map((q, idx) => {
                        const isMulti = q.question.startsWith('[MULTI]');
                        const isOrder = q.question.startsWith('[ORDER]');
                        const isDebug = q.question.startsWith('[DEBUG]');

                        return (
                          <div
                            key={idx}
                            className="p-4 rounded-xl border border-border bg-card space-y-2.5 text-xs font-mono"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-foreground">
                                Q{idx + 1}. {q.question}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                                {isMulti ? 'Multi-Select' : isOrder ? 'Code Ordering' : isDebug ? 'Bug Debugger' : 'Single Choice'}
                              </span>
                            </div>

                            {q.codeSnippet && (
                              <pre className="p-2.5 rounded bg-muted/60 text-[11px] overflow-x-auto text-foreground">
                                {q.codeSnippet}
                              </pre>
                            )}

                            <div className="space-y-1 pl-2 border-l-2 border-border/60">
                              {q.options?.map((opt: any, oIdx: number) => (
                                <div
                                  key={oIdx}
                                  className={`flex items-center gap-2 ${opt.isCorrect ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-muted-foreground'}`}
                                >
                                  <span>{opt.isCorrect ? '✓' : '•'}</span>
                                  <span>{opt.text}</span>
                                </div>
                              ))}
                            </div>

                            {q.explanation && (
                              <p className="text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                                <strong>Explanation:</strong> {q.explanation}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handlePublishQuiz}
                  disabled={submitting || draftedQuestions.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer disabled:opacity-50 transition-all"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  <span>Publish Daily Challenge</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
