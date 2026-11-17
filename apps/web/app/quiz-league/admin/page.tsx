'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Plus,
  Edit2,
  CheckCircle2,
  Trophy,
  Award,
  Users,
  Flame,
  Clock,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { ChampionTrophy } from '@/app/components/quiz-league/trophies/ChampionTrophy';

export default function QuizLeagueAdminPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'QUIZZES' | 'COMPETITIONS' | 'REWARDS'>('QUIZZES');

  // Modal / Creator State
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const fetchOverview = () => {
    setLoading(true);
    fetch('/api/quiz-league/admin/overview')
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) setData(json);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleFinalizeWeek = async (weekId: string) => {
    if (!confirm('Finalize this competition week, calculate final standings, and trigger the Gnosis Champion NFT mint?')) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/quiz-league/admin/finalize-week', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekId }),
      });
      const json = await res.json();
      if (res.ok) {
        setActionMessage(`Week finalized! Winner: ${json.winner?.name}. NFT Status: ${json.mintResult?.status || 'Initiated'}`);
        fetchOverview();
      } else {
        alert(json.error || 'Failed to finalize week');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTriggerMint = async (weekId: string) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/quiz-league/admin/mint-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekId }),
      });
      const json = await res.json();
      if (res.ok) {
        setActionMessage(`NFT Minting process complete! TxHash: ${json.result?.txHash || 'Generated'}`);
        fetchOverview();
      } else {
        alert(json.error || 'Failed to trigger mint');
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-[#A1A1AA]">Authorizing Admin Operations...</span>
      </div>
    );
  }

  const quizzes = data?.quizzes || [];
  const weeks = data?.weeks || [];
  const recentAttempts = data?.recentAttempts || [];
  const rewards = data?.rewards || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272A] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-violet-400 uppercase font-bold tracking-wider">
            <ShieldAlert className="w-4 h-4 text-violet-400" />
            <span>Tournament Administration Control</span>
          </div>
          <h1 className="text-3xl font-black text-white mt-1">Quiz League Admin Console</h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Author and publish protocol quizzes, audit attempts, finalize weekly standings, and dispatch ERC-721 Gnosis trophies.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-[#111114] border border-[#27272A] p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('QUIZZES')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'QUIZZES' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Quizzes ({quizzes.length})
          </button>
          <button
            onClick={() => setActiveTab('COMPETITIONS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'COMPETITIONS' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Attempts & Audits
          </button>
          <button
            onClick={() => setActiveTab('REWARDS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'REWARDS' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            NFT Minter ({rewards.length})
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage('')} className="text-emerald-400 font-bold">×</button>
        </div>
      )}

      {/* 1. QUIZZES MANAGEMENT TAB */}
      {activeTab === 'QUIZZES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-sans">Active & Scheduled Quizzes</h3>
            <button
              onClick={() => {
                setEditingQuiz({
                  weekId: weeks[0]?.id || '',
                  dayIndex: 1,
                  title: '',
                  topic: '',
                  description: '',
                  durationMinutes: 5,
                  maxPoints: 100,
                  isPublished: true,
                });
                setShowQuizModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-md shadow-violet-600/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create New Quiz
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((q: any) => (
              <div
                key={q.id}
                className="bg-[#111114] border border-[#27272A] rounded-2xl p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-amber-400 font-bold">
                      Week {q.week.weekNumber} • Day {q.dayIndex}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        q.isPublished
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {q.isPublished ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">{q.title}</h4>
                  <span className="text-xs font-mono text-zinc-400 block">Topic: {q.topic}</span>
                </div>

                <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-xs font-mono">
                  <div className="text-zinc-500 text-[11px]">
                    <span>{q.questions.length} Questions</span> • <span>{q._count.attempts} attempts</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/quiz-league/daily/${q.id}`}
                      className="p-1.5 rounded-lg bg-[#18181B] hover:text-white text-zinc-400 border border-[#27272A]"
                      title="Preview Quiz"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. COMPETITIONS & ATTEMPTS AUDIT TAB */}
      {activeTab === 'COMPETITIONS' && (
        <div className="space-y-6">
          {/* Active Weeks Finalizer */}
          <div className="bg-[#111114] border border-[#27272A] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Weekly Tournaments
            </h3>
            <div className="divide-y divide-[#27272A]">
              {weeks.map((w: any) => (
                <div key={w.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400 block">
                      Week {w.weekNumber} — {w.status}
                    </span>
                    <h4 className="text-sm font-bold text-white">{w.title}</h4>
                    <span className="text-xs font-mono text-zinc-500">
                      {w._count.weeklyScores} active participants • {w.quizzes.length} quizzes scheduled
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {w.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleFinalizeWeek(w.id)}
                        disabled={submitting}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs font-mono flex items-center gap-1.5 shadow-md shadow-amber-600/30 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Finalize & Mint Trophy
                      </button>
                    )}
                    {w.status === 'FINALIZED' && (
                      <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                        FINALIZED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Submissions Audit Table */}
          <div className="bg-[#111114] border border-[#27272A] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-sans">Recent Student Quiz Attempts</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#27272A] text-zinc-500 uppercase text-[10px]">
                    <th className="py-3 px-3">Student</th>
                    <th className="py-3 px-3">Quiz</th>
                    <th className="py-3 px-3 text-center">Score</th>
                    <th className="py-3 px-3 text-center">Time</th>
                    <th className="py-3 px-3 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272A]/50">
                  {recentAttempts.map((att: any) => (
                    <tr key={att.id} className="text-zinc-300 hover:bg-[#18181B]/40">
                      <td className="py-3 px-3 font-sans font-medium text-white">
                        {att.user.name || att.user.email}
                      </td>
                      <td className="py-3 px-3 text-zinc-400">{att.quiz.title}</td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-400">{att.score}%</td>
                      <td className="py-3 px-3 text-center text-zinc-400">{att.timeSpentSeconds}s</td>
                      <td className="py-3 px-3 text-right font-extrabold text-amber-400">+{att.pointsEarned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. REWARD MANAGEMENT TAB */}
      {activeTab === 'REWARDS' && (
        <div className="space-y-6">
          <div className="bg-[#111114] border border-[#27272A] rounded-2xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Gnosis Chain NFT Trophy Dispatches
            </h3>

            <div className="divide-y divide-[#27272A]">
              {rewards.map((r: any) => (
                <div key={r.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      Week {r.week.weekNumber} Trophy — {r.network}
                    </span>
                    <h4 className="text-sm font-bold text-white">Winner: {r.winner.name || r.winner.email}</h4>
                    <span className="text-xs font-mono text-zinc-500 block">
                      Wallet: {r.recipientAddress}
                    </span>
                    {r.txHash && (
                      <span className="text-[11px] font-mono text-violet-400 block truncate max-w-md">
                        Tx: {r.txHash}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {r.status}
                    </span>

                    <button
                      onClick={() => handleTriggerMint(r.weekId)}
                      disabled={submitting}
                      className="px-3.5 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-zinc-300 text-xs font-mono font-bold border border-[#27272A] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Retry Mint
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111114] border border-[#27272A] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create Daily Protocol Quiz</h3>
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Competition Week</label>
                <select
                  value={editingQuiz?.weekId}
                  onChange={(e) => setEditingQuiz({ ...editingQuiz, weekId: e.target.value })}
                  className="w-full bg-[#18181B] text-white p-2.5 rounded-xl border border-[#27272A] outline-none"
                >
                  {weeks.map((w: any) => (
                    <option key={w.id} value={w.id}>
                      Week {w.weekNumber}: {w.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Day of Week (1-7)</label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={editingQuiz?.dayIndex}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, dayIndex: Number(e.target.value) })}
                    className="w-full bg-[#18181B] text-white p-2.5 rounded-xl border border-[#27272A] outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Time Limit (mins)</label>
                  <input
                    type="number"
                    value={editingQuiz?.durationMinutes}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz, durationMinutes: Number(e.target.value) })}
                    className="w-full bg-[#18181B] text-white p-2.5 rounded-xl border border-[#27272A] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Quiz Title</label>
                <input
                  type="text"
                  placeholder="e.g. EVM Gas & State Storage"
                  value={editingQuiz?.title}
                  onChange={(e) => setEditingQuiz({ ...editingQuiz, title: e.target.value })}
                  className="w-full bg-[#18181B] text-white p-2.5 rounded-xl border border-[#27272A] outline-none font-sans"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Gas Optimization"
                  value={editingQuiz?.topic}
                  onChange={(e) => setEditingQuiz({ ...editingQuiz, topic: e.target.value })}
                  className="w-full bg-[#18181B] text-white p-2.5 rounded-xl border border-[#27272A] outline-none font-sans"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#27272A]">
              <button
                onClick={() => setShowQuizModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!editingQuiz.title || !editingQuiz.topic) return alert('Please enter title and topic');
                  setSubmitting(true);
                  try {
                    const res = await fetch('/api/quiz-league/admin/quiz', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(editingQuiz),
                    });
                    if (res.ok) {
                      setShowQuizModal(false);
                      fetchOverview();
                      setActionMessage('Quiz created successfully!');
                    }
                  } catch (e: any) {
                    alert(e.message);
                  } finally {
                    setSubmitting(false);
                  }
                }}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono font-bold shadow-md shadow-violet-600/30 cursor-pointer disabled:opacity-50"
              >
                Save & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

