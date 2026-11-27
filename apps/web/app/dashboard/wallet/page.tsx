'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/app/lib/auth-client';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import LoadingScreen from '@/app/components/ui/LoadingScreen';
import { WalletCards } from '@/app/components/wallet/WalletCards';
import { TransactionHistory, CoinTransactionItem } from '@/app/components/wallet/TransactionHistory';
import { TopUpModal } from '@/app/components/wallet/TopUpModal';
import { getUserCoinBalanceAction, getUserCoinHistoryAction } from '@/app/actions/coins';
import { getLinkedWalletAction } from '@/app/actions/siwe';
import { RefreshCw, Wallet, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function WalletPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isSignedIn = !!user;

  const [coinBalance, setCoinBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<CoinTransactionItem[]>([]);
  const [linkedWallet, setLinkedWallet] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  const loadWalletData = useCallback(async () => {
    try {
      const [balance, history, linkedWalletRes] = await Promise.all([
        getUserCoinBalanceAction(),
        getUserCoinHistoryAction(50),
        getLinkedWalletAction(),
      ]);
      setCoinBalance(balance);
      setTransactions(history as CoinTransactionItem[]);
      setLinkedWallet(linkedWalletRes.walletAddress);
    } catch (err) {
      console.error('Failed to load wallet data:', err);
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!isSignedIn) {
      router.replace('/sign-in');
      return;
    }
    loadWalletData();
  }, [isPending, isSignedIn, router, loadWalletData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadWalletData();
    toast.success('Wallet data refreshed');
  };

  const handleTopUpSuccess = (newBalance: number) => {
    setCoinBalance(newBalance);
    loadWalletData();
  };

  // Compute total earned vs spent
  const totalEarned = transactions
    .filter((t) => t.type === 'EARNED' || t.type === 'REWARD' || t.type === 'TOPUP')
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const totalSpent = transactions
    .filter((t) => t.type === 'SPENT')
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  if (isPending || loading) {
    return <LoadingScreen text="SYNCHRONIZING STUDENT WALLET & COIN TREASURY..." />;
  }

  return (
    <DashboardShell>
      <div className="space-y-6 pb-14 font-sans">
        <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');` }} />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80 relative">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f8bd36]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                Base L2 // Treasury & Rewards
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Student Wallet &amp; Treasury
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              Manage your ETHShala Coins (ESHC), inspect on-chain Base credentials, and review your reward transaction ledger.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-accent text-foreground text-xs font-bold transition-colors cursor-pointer"
              title="Refresh wallet balances"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

          {/* Caveat Handwritten Note Accent */}
          <div className="absolute right-0 top-[-25px] hidden xl:block transform rotate-[-6deg] pointer-events-none">
            <p className="text-xl font-bold text-[#075945] dark:text-[#61d9b9] leading-none" style={{ fontFamily: '"Caveat", cursive' }}>
              Earn coins.<br />Build on Base!
            </p>
          </div>
        </div>

        {/* 1. Wallet Metric Cards */}
        <WalletCards
          coinBalance={coinBalance}
          totalEarned={totalEarned}
          totalSpent={totalSpent}
          linkedWalletAddress={linkedWallet}
          onOpenTopUp={() => setIsTopUpOpen(true)}
          onWalletLinked={setLinkedWallet}
        />

        {/* 2. Transaction Ledger History */}
        <TransactionHistory transactions={transactions} />

        {/* 3. Top-Up Purchase Modal */}
        <TopUpModal
          isOpen={isTopUpOpen}
          onClose={() => setIsTopUpOpen(false)}
          onSuccess={handleTopUpSuccess}
        />
      </div>
    </DashboardShell>
  );
}
