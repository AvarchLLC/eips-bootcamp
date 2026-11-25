'use client';

import React, { useState, useMemo } from 'react';
import { ArrowDownLeft, ArrowUpRight, Coins, Search, Filter, Sparkles } from 'lucide-react';
import Link from 'next/link';

export interface CoinTransactionItem {
  id: string;
  userId: string;
  amount: number;
  type: 'EARNED' | 'SPENT' | 'TOPUP' | 'REFUND' | 'REWARD';
  reason: string;
  category: string;
  referenceId: string | null;
  createdAt: Date | string;
}

interface TransactionHistoryProps {
  transactions: CoinTransactionItem[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchesType =
        filterType === 'ALL' ||
        (filterType === 'EARNED' && (t.type === 'EARNED' || t.type === 'REWARD')) ||
        (filterType === 'SPENT' && t.type === 'SPENT') ||
        (filterType === 'TOPUP' && t.type === 'TOPUP');

      const matchesSearch =
        !searchQuery.trim() ||
        t.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [transactions, filterType, searchQuery]);

  return (
    <div className="rounded-2xl border-2 border-[#111] dark:border-white/20 bg-card p-6 shadow-[5px_5px_0px_#111] dark:shadow-[5px_5px_0px_rgba(255,255,255,0.15)] mt-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
        <div>
          <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
            Coin Transaction Ledger
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit history of your earned, spent, and purchased ETHShala Coins.
          </p>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
            {['ALL', 'EARNED', 'SPENT', 'TOPUP'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === type
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {type === 'ALL' ? 'All' : type === 'EARNED' ? 'Earned' : type === 'SPENT' ? 'Spent' : 'Top-Up'}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reason..."
              className="pl-8 pr-3 py-1.5 bg-muted/60 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary w-40 sm:w-48"
            />
          </div>
        </div>
      </div>

      {/* Table / List */}
      <div className="mt-4 overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="py-14 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-3">
              <Coins size={24} />
            </div>
            <h4 className="font-bold text-base text-foreground">No coin transactions yet</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-5">
              Complete daily quizzes, submit assignments, or challenge other students in the arcade to start earning coins!
            </p>
            <Link
              href="/quiz-league"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#064a3a] text-white font-bold text-xs shadow-md hover:bg-[#043328] transition-colors"
            >
              <Sparkles size={14} /> Start Earning Coins
            </Link>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((t) => {
                const isEarned = t.type === 'EARNED' || t.type === 'REWARD';
                const isTopUp = t.type === 'TOPUP';

                return (
                  <tr key={t.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-3 text-xs text-muted-foreground font-mono">
                      {new Date(t.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          isEarned
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                            : isTopUp
                            ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {isEarned ? (
                          <ArrowDownLeft size={11} />
                        ) : isTopUp ? (
                          <Sparkles size={11} />
                        ) : (
                          <ArrowUpRight size={11} />
                        )}
                        {t.type}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-xs text-foreground">{t.reason}</p>
                      {t.referenceId && (
                        <p className="text-[10px] font-mono text-muted-foreground">Ref: {t.referenceId.slice(0, 12)}</p>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-black text-sm">
                      <span
                        className={
                          isEarned || isTopUp
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }
                      >
                        {isEarned || isTopUp ? `+${t.amount}` : `${t.amount}`} ESHC
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
