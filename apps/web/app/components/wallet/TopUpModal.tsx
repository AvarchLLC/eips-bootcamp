'use client';

import React, { useState } from 'react';
import { X, Sparkles, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { topUpCoinsAction } from '@/app/actions/coins';
import { toast } from 'sonner';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newBalance: number) => void;
}

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Pouch',
    coins: 500,
    price: '$4.99',
    eth: '0.002 ETH',
    tag: 'Quick Start',
    accent: 'border-border bg-card',
  },
  {
    id: 'builder',
    name: 'Builder Sack',
    coins: 1200,
    price: '$9.99',
    eth: '0.004 ETH',
    tag: 'Most Popular',
    popular: true,
    accent: 'border-[#f8bd36] bg-[#ffd359]/10 shadow-[4px_4px_0px_#f8bd36]',
  },
  {
    id: 'vault',
    name: 'Protocol Vault',
    coins: 3000,
    price: '$19.99',
    eth: '0.008 ETH',
    tag: 'Best Value',
    accent: 'border-[#0e7955] bg-[#0e7955]/10 shadow-[4px_4px_0px_#0e7955]',
  },
];

export function TopUpModal({ isOpen, onClose, onSuccess }: TopUpModalProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePurchase = async (pkg: typeof PACKAGES[0]) => {
    setLoadingId(pkg.id);
    try {
      const res = await topUpCoinsAction(pkg.coins, pkg.name);
      if (res.success && res.newBalance !== undefined) {
        toast.success(`Successfully added ${pkg.coins.toLocaleString()} ESHC coins to your wallet!`);
        onSuccess(res.newBalance);
        onClose();
      } else {
        toast.error(res.error || 'Failed to complete top-up.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error processing top-up');
    } finally {
      setLoadingId(null);
    }
  };

  const handleTestFaucet = async () => {
    setLoadingId('faucet');
    try {
      const res = await topUpCoinsAction(100, 'Student Test Faucet');
      if (res.success && res.newBalance !== undefined) {
        toast.success('Claimed 100 ESHC from student test faucet!');
        onSuccess(res.newBalance);
        onClose();
      } else {
        toast.error(res.error || 'Faucet request failed.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Faucet error');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#fcfbf7] dark:bg-[#0c1814] border-2 border-[#111] dark:border-white/20 rounded-2xl shadow-[8px_8px_0px_#111] dark:shadow-[8px_8px_0px_rgba(255,255,255,0.15)] overflow-hidden p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl border border-black/10 dark:border-white/10 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffd359]/20 border border-[#f8bd36]/40 text-amber-900 dark:text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles size={13} className="text-[#f8bd36]" />
            ETHShala Coin Top-Up
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111] dark:text-white tracking-tight">
            Acquire ETHShala Coins (ESHC)
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Coins let you unlock avatar frames, custom theme badges, and booster passes in the marketplace.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-xl border-2 p-5 flex flex-col justify-between transition-all ${pkg.accent}`}
            >
              {pkg.tag && (
                <span className="absolute -top-3 left-4 px-2 py-0.5 rounded-md bg-[#111] text-white text-[9px] font-extrabold uppercase tracking-widest shadow-xs">
                  {pkg.tag}
                </span>
              )}

              <div>
                <h3 className="font-bold text-sm text-[#111] dark:text-white">{pkg.name}</h3>
                <div className="my-3">
                  <span className="text-3xl font-black text-[#075945] dark:text-[#61d9b9]">
                    +{pkg.coins}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground ml-1">ESHC</span>
                </div>
                <div className="text-xs text-muted-foreground font-medium mb-4">
                  <span className="font-bold text-foreground">{pkg.price}</span> ({pkg.eth})
                </div>
              </div>

              <button
                onClick={() => handlePurchase(pkg)}
                disabled={loadingId !== null}
                className="w-full py-2.5 px-3 rounded-lg bg-[#064a3a] hover:bg-[#043328] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loadingId === pkg.id ? (
                  <span className="animate-spin text-xs">...</span>
                ) : (
                  <>
                    Select Package <ArrowRight size={13} />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Test Faucet & Student Dev Banner */}
        <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black/[0.02] dark:bg-white/[0.02] p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Zap size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Student Testing Faucet</p>
              <p className="text-[11px] text-muted-foreground">Claim 100 free ESHC test coins to test store purchases.</p>
            </div>
          </div>
          <button
            onClick={handleTestFaucet}
            disabled={loadingId !== null}
            className="py-2 px-4 rounded-lg border-2 border-[#111] dark:border-white/20 bg-white dark:bg-card text-[#111] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 font-bold text-xs transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            {loadingId === 'faucet' ? 'Claiming...' : 'Claim 100 Test ESHC'}
          </button>
        </div>
      </div>
    </div>
  );
}
