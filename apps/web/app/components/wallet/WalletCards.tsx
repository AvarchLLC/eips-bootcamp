'use client';

import React, { useState } from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  Coins,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Wallet,
  ArrowUpRight,
  Plus,
  Flame,
  Gamepad2,
  RefreshCw,
  Sparkles,
  Award,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { generateSiweChallengeAction, verifyAndLinkWalletAction, unlinkWalletAction } from '@/app/actions/siwe';
import { ETHSHALA_COIN_ADDRESSES } from '@/app/lib/contracts/ethshala-coin';

interface WalletCardsProps {
  coinBalance: number;
  totalEarned: number;
  totalSpent: number;
  linkedWalletAddress?: string | null;
  onOpenTopUp: () => void;
  onWalletLinked?: (newAddress: string | null) => void;
}

export function WalletCards({
  coinBalance,
  totalEarned,
  totalSpent,
  linkedWalletAddress,
  onOpenTopUp,
  onWalletLinked,
}: WalletCardsProps) {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const [copied, setCopied] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLinked = isConnected && !!address && !!linkedWalletAddress && linkedWalletAddress.toLowerCase() === address.toLowerCase();
  const truncatedAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : 'Not connected';

  const eshcContractAddress = ETHSHALA_COIN_ADDRESSES[84532];

  const handleSignAndLink = async () => {
    if (!address) {
      toast.error('Connect your Web3 wallet first');
      return;
    }

    setIsSigning(true);
    try {
      const challengeRes = await generateSiweChallengeAction(address, chain?.id || 84532);
      if (!challengeRes.success || !challengeRes.message) {
        toast.error(challengeRes.error || 'Failed to initialize verification challenge');
        return;
      }

      toast.info('Please sign verification in your browser wallet...');
      const signature = await signMessageAsync({ message: challengeRes.message });

      const verifyRes = await verifyAndLinkWalletAction({
        address,
        message: challengeRes.message,
        signature,
      });

      if (!verifyRes.success) {
        toast.error(verifyRes.error || 'Failed to verify signature');
        return;
      }

      toast.success('Wallet successfully verified and linked to your profile!');
      onWalletLinked?.(verifyRes.walletAddress || address);
    } catch (err: any) {
      console.error('SIWE link error:', err);
      toast.error(err?.message || 'Signature rejected or failed');
    } finally {
      setIsSigning(false);
    }
  };

  const handleUnlink = async () => {
    setIsUnlinking(true);
    try {
      const res = await unlinkWalletAction();
      if (res.success) {
        toast.success('Wallet unlinked from profile');
        onWalletLinked?.(null);
      } else {
        toast.error(res.error || 'Failed to unlink wallet');
      }
    } catch (err: any) {
      toast.error('Error unlinking wallet');
    } finally {
      setIsUnlinking(false);
    }
  };

  const handleAddTokenToWallet = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      toast.error('No Web3 wallet extension found');
      return;
    }
    try {
      await (window as any).ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: eshcContractAddress,
            symbol: 'ESHC',
            decimals: 18,
            image: 'https://ethshala.com/icons/coin.png',
          },
        },
      });
      toast.success('Added ESHC token to your wallet!');
    } catch (err: any) {
      console.error('Failed to add token:', err);
      toast.error('Could not add token to wallet');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 1. Main Coin Balance Card */}
      <div className="relative rounded-2xl border-2 border-[#111] dark:border-white/20 bg-[#fcfbf7] dark:bg-[#0c1814] p-6 shadow-[5px_5px_0px_#f8bd36] flex flex-col justify-between overflow-hidden">
        {/* Subtle decorative stamp */}
        <div className="absolute top-3 right-4 opacity-15 pointer-events-none">
          <Coins size={80} className="text-[#f8bd36]" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f8bd36] animate-pulse" />
              Available Balance
            </span>
            <span className="px-2 py-0.5 rounded bg-[#ffd359]/30 text-amber-900 dark:text-amber-300 font-extrabold text-[10px] uppercase tracking-wider">
              ESHC Token
            </span>
          </div>

          <div className="my-2 flex items-baseline gap-2">
            <h2 className="text-4xl sm:text-5xl font-black text-[#111] dark:text-white tracking-tight">
              {coinBalance.toLocaleString()}
            </h2>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400">ESHC</span>
          </div>

          <p className="text-xs text-muted-foreground font-medium">
            Spend coins on avatar frames, custom theme borders, and shop items.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenTopUp}
            className="flex-1 min-h-[42px] px-4 rounded-xl bg-[#064a3a] hover:bg-[#043328] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Top-Up Coins
          </button>
          <Link
            href="/dashboard/marketplace"
            className="min-h-[42px] px-3.5 rounded-xl border-2 border-border bg-card hover:bg-accent text-foreground font-bold text-xs transition-colors flex items-center justify-center gap-1"
          >
            Store <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* 2. Connected Web3 Wallet & SIWE Card */}
      <div className="relative rounded-2xl border-2 border-[#111] dark:border-white/20 bg-card p-6 shadow-[5px_5px_0px_#0e7955] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <Wallet size={14} className="text-[#0e7955]" />
              Web3 Identity
            </span>
            <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] uppercase tracking-wider ${
              isLinked
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                : isConnected
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                : 'bg-muted text-muted-foreground'
            }`}>
              {isLinked ? 'Verified SIWE' : isConnected ? 'Connected (Unlinked)' : 'Disconnected'}
            </span>
          </div>

          {isConnected ? (
            <div className="my-2 space-y-2.5">
              <div className="flex items-center gap-2 bg-muted/60 border border-border rounded-xl p-3">
                <span className="font-mono text-sm font-bold text-foreground select-all">
                  {truncatedAddress}
                </span>
                <button
                  onClick={() => handleCopy(address || '')}
                  className="ml-auto p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Copy full address"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
                <a
                  href={`https://sepolia.basescan.org/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
                  title="View on Basescan"
                >
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Verification status pill / button */}
              {isLinked ? (
                <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold">
                    <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Cryptographically Linked</span>
                  </div>
                  <button
                    onClick={handleUnlink}
                    disabled={isUnlinking}
                    className="text-[11px] text-muted-foreground hover:text-red-500 underline transition-colors cursor-pointer"
                  >
                    {isUnlinking ? 'Unlinking...' : 'Unlink'}
                  </button>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-2">
                  <div className="flex items-start gap-1.5">
                    <Sparkles size={14} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <span className="text-[11px] leading-tight text-foreground font-medium">
                      {linkedWalletAddress
                        ? 'Connected address differs from your verified profile wallet.'
                        : 'Link this wallet to your account to claim on-chain rewards.'}
                    </span>
                  </div>
                  <button
                    onClick={handleSignAndLink}
                    disabled={isSigning}
                    className="w-full py-1.5 px-3 rounded-lg bg-[#0e7955] hover:bg-[#08553c] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSigning ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" /> Signing...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={13} /> Sign &amp; Link with SIWE
                      </>
                    )}
                  </button>
                </div>
              )}

              <p className="text-[10px] text-muted-foreground">
                Network: <span className="font-semibold text-foreground">{chain?.name || 'Base Sepolia'}</span> (Chain ID: {chain?.id || 84532})
              </p>
            </div>
          ) : (
            <div className="my-2">
              <p className="text-sm font-bold text-foreground">No Web3 wallet connected</p>
              <p className="text-xs text-muted-foreground mt-1">
                Connect your browser wallet (MetaMask, Coinbase, Rainbow) to verify on-chain Base credentials.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-2">
          <ConnectButton.Custom>
            {({ openConnectModal, account, mounted }) => {
              if (!mounted || !account) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="w-full py-2.5 px-4 rounded-xl border-2 border-[#111] dark:border-white/20 bg-white dark:bg-card text-[#111] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Wallet size={15} /> Connect Wallet
                  </button>
                );
              }
              return (
                <button
                  onClick={() => disconnect()}
                  className="w-full py-2 px-3 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Disconnect Wallet
                </button>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>

      {/* 3. Earn & Economy Summary Card + On-Chain ESHC */}
      <div className="relative rounded-2xl border-2 border-[#111] dark:border-white/20 bg-card p-6 shadow-[5px_5px_0px_#111] dark:shadow-[5px_5px_0px_rgba(255,255,255,0.15)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <Award size={14} className="text-primary" />
              Coin Activity &amp; Contract
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-2">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Earned</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">+{totalEarned}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Spent</span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400">-{totalSpent}</span>
            </div>
          </div>

          {/* On-Chain Base Contract Info */}
          <div className="mt-3 p-2.5 rounded-xl bg-muted/60 border border-border text-[11px] space-y-1.5">
            <div className="flex items-center justify-between font-mono font-bold">
              <span className="text-muted-foreground text-[10px]">BASE SEPOLIA ERC-20</span>
              <button
                onClick={handleAddTokenToWallet}
                className="text-[10px] text-[#0e7955] dark:text-emerald-400 hover:underline font-bold cursor-pointer"
              >
                + Add to Wallet
              </button>
            </div>
            <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
              <span className="truncate max-w-[150px] text-muted-foreground">{eshcContractAddress}</span>
              <a
                href={`https://sepolia.basescan.org/token/${eshcContractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground text-muted-foreground inline-flex items-center gap-0.5"
              >
                Basescan <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
          <Link
            href="/quiz-league"
            className="flex-1 py-2 px-3 rounded-lg bg-muted hover:bg-accent text-foreground font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5"
          >
            <Flame size={13} className="text-amber-500" /> Quizzes
          </Link>
          <Link
            href="/dashboard/arcade"
            className="flex-1 py-2 px-3 rounded-lg bg-muted hover:bg-accent text-foreground font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5"
          >
            <Gamepad2 size={13} className="text-primary" /> Arcade
          </Link>
        </div>
      </div>
    </div>
  );
}
