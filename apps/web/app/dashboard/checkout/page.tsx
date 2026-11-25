'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from '@/app/lib/auth-client';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import {
  CreditCard,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Coins,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Zap,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi';
import { parseEther } from 'viem';

const DEFAULT_TREASURY_ADDRESS: `0x${string}` =
  (process.env.NEXT_PUBLIC_TREASURY_ADDRESS as `0x${string}`) ||
  '0x44AE96b3a246D218c5e608035D5a9FeB48d79F21';

type PaymentTab = 'FIAT_PAYPAL' | 'CRYPTO';
type CryptoNetworkKey = 'base' | 'polygon' | 'ethereum' | 'sepolia';

interface NetworkQuote {
  chainId: number;
  name: string;
  symbol: string;
  amount: string;
  gasEstimate: string;
  explorerUrl: string;
}

function getDefaultQuotes(priceUsd: number): Record<CryptoNetworkKey, NetworkQuote> {
  const safePrice = Math.max(0, priceUsd || 25);
  const ethRate = 2800;
  const polRate = 0.35;

  const ethAmount = (safePrice / ethRate).toFixed(6);
  const polAmount = (safePrice / polRate).toFixed(4);

  return {
    base: {
      chainId: 8453,
      name: 'Base',
      symbol: 'ETH',
      amount: ethAmount,
      gasEstimate: '~ $0.01',
      explorerUrl: 'https://basescan.org',
    },
    polygon: {
      chainId: 137,
      name: 'Polygon',
      symbol: 'POL',
      amount: polAmount,
      gasEstimate: '< $0.01',
      explorerUrl: 'https://polygonscan.com',
    },
    ethereum: {
      chainId: 1,
      name: 'Ethereum Mainnet',
      symbol: 'ETH',
      amount: ethAmount,
      gasEstimate: '~ $2.50 - $5.00',
      explorerUrl: 'https://etherscan.io',
    },
    sepolia: {
      chainId: 11155111,
      name: 'Sepolia (Testnet)',
      symbol: 'ETH',
      amount: ethAmount,
      gasEstimate: 'Free (Testnet)',
      explorerUrl: 'https://sepolia.etherscan.io',
    },
  };
}

function CheckoutContent() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = searchParams?.get('moduleId');

  // SSR hydration safety for Wagmi/RainbowKit
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Wagmi Hooks
  const { isConnected, chain } = useAccount();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const { sendTransactionAsync, isPending: isSendingTx } = useSendTransaction();

  // Module state
  const [moduleData, setModuleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Tab & Crypto selection
  const [paymentTab, setPaymentTab] = useState<PaymentTab>('CRYPTO');
  const [selectedNetwork, setSelectedNetwork] = useState<CryptoNetworkKey>('base');
  const [quotes, setQuotes] = useState<Record<CryptoNetworkKey, NetworkQuote>>(getDefaultQuotes(25));

  // Payment execution states
  const [processing, setProcessing] = useState(false);
  const [cryptoTxHash, setCryptoTxHash] = useState<string | null>(null);
  const [explorerUrl, setExplorerUrl] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // PayPal container ref
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const hasRealPayPalClientId =
    !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID &&
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID !== 'sb' &&
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID !== 'your_paypal_client_id';

  // Confetti celebration callback
  const triggerSuccess = useCallback(() => {
    setSuccess(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
    });
  }, []);

  // 1. Fetch Module Data safely (never hangs on loading)
  useEffect(() => {
    let isCancelled = false;

    const fetchModule = async () => {
      setLoading(true);
      try {
        if (moduleId) {
          const res = await fetch(`/api/bootcamp/modules/${moduleId}`);
          if (res.ok) {
            const data = await res.json();
            if (!isCancelled && data?.id) {
              setModuleData(data);
              setQuotes(getDefaultQuotes(data.price || 0));
              return;
            }
          }
        }

        // If no moduleId or fetch failed, fallback to modules directory
        const listRes = await fetch(`/api/bootcamp/modules`);
        if (listRes.ok) {
          const list = await listRes.json();
          if (Array.isArray(list) && list.length > 0) {
            const matched = moduleId ? list.find((m: any) => m.id === moduleId) : list[0];
            const chosen = matched || list[0];
            if (!isCancelled) {
              setModuleData(chosen);
              setQuotes(getDefaultQuotes(chosen.price || 0));
              return;
            }
          }
        }

        // Safe fallback module if database has no records
        if (!isCancelled) {
          const defaultModule = {
            id: moduleId || 'module-evm-genesis',
            title: 'Ethereum Protocol & EVM Architecture Bootcamp',
            description: 'Comprehensive curriculum covering EVM opcodes, Layer 2 scaling, account abstraction, and protocol auditing.',
            category: 'Core Protocol',
            price: 25,
            duration: '6 Weeks',
            lessons: 12,
            thumbnailUrl: null,
            isSubscribed: false,
          };
          setModuleData(defaultModule);
          setQuotes(getDefaultQuotes(defaultModule.price));
        }
      } catch (err) {
        console.warn('Module load error, using default:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchModule();

    return () => {
      isCancelled = true;
    };
  }, [moduleId]);

  // 2. Fetch Live Crypto Quotes
  useEffect(() => {
    if (!moduleData?.price || moduleData.price <= 0) return;

    fetch(`/api/payments/crypto/quote?usd=${moduleData.price}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.networks) {
          setQuotes(data.networks);
        }
      })
      .catch((err) => console.warn('Live quote fetch warning:', err));
  }, [moduleData?.price]);

  // 3. Load PayPal SDK only if a real client ID is configured
  useEffect(() => {
    if (paymentTab !== 'FIAT_PAYPAL' || !hasRealPayPalClientId || typeof window === 'undefined') {
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const scriptId = 'paypal-sdk-script';

    if (document.getElementById(scriptId)) {
      setPaypalLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    script.async = true;
    script.onload = () => setPaypalLoaded(true);
    script.onerror = () => console.warn('PayPal SDK could not be reached.');
    document.body.appendChild(script);
  }, [paymentTab, hasRealPayPalClientId]);

  // 4. Mount PayPal Smart Buttons if SDK loaded
  useEffect(() => {
    if (!paypalLoaded || paymentTab !== 'FIAT_PAYPAL' || !paypalContainerRef.current) return;
    if (!(window as any).paypal?.Buttons) return;

    paypalContainerRef.current.innerHTML = '';

    try {
      (window as any).paypal
        .Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'pay',
          },
          createOrder: async () => {
            const res = await fetch('/api/payments/paypal/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ moduleId: moduleData?.id || moduleId }),
            });
            const data = await res.json();
            return data.id;
          },
          onApprove: async (data: any) => {
            setProcessing(true);
            try {
              const res = await fetch('/api/payments/paypal/capture-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: data.orderID, moduleId: moduleData?.id || moduleId }),
              });
              const json = await res.json();
              if (res.ok && json.success) {
                triggerSuccess();
              } else {
                toast.error(json.error || 'Payment capture failed');
              }
            } catch (err: any) {
              toast.error(err.message || 'Payment approval error');
            } finally {
              setProcessing(false);
            }
          },
          onError: (err: any) => {
            console.warn('PayPal button error:', err);
            toast.error('PayPal encountered an issue. You may also use the instant sandbox or crypto options.');
          },
        })
        .render(paypalContainerRef.current);
    } catch (err) {
      console.warn('Error mounting PayPal buttons:', err);
    }
  }, [paypalLoaded, paymentTab, moduleId, moduleData?.id, triggerSuccess]);

  // Free module enrollment handler
  const handleFreeCheckout = async () => {
    setProcessing(true);
    try {
      const targetId = moduleData?.id || moduleId;
      const res = await fetch(`/api/bootcamp/modules/${targetId}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id || 'demo-student' }),
      });

      if (res.ok) {
        triggerSuccess();
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(`Error: ${errorData.error || errorData.message || 'Subscription failed'}`);
      }
    } catch {
      toast.error('An error occurred during enrollment.');
    } finally {
      setProcessing(false);
    }
  };

  // Instant Sandbox PayPal Capture (Guaranteed zero-config testing)
  const handleDemoPayPalCapture = async () => {
    setProcessing(true);
    try {
      const targetId = moduleData?.id || moduleId;
      const createRes = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId: targetId }),
      });
      const createData = await createRes.json();

      const captureRes = await fetch('/api/payments/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: createData.id, moduleId: targetId }),
      });

      const captureData = await captureRes.json();
      if (captureRes.ok && captureData.success) {
        triggerSuccess();
      } else {
        toast.error(captureData.error || 'Failed to complete PayPal payment');
      }
    } catch (err: any) {
      toast.error(err.message || 'Payment simulation failed');
    } finally {
      setProcessing(false);
    }
  };

  // Crypto Payment Handler (Base, Polygon, Ethereum, Sepolia)
  const handleCryptoPayment = async () => {
    if (!isConnected) {
      toast.error('Please connect your Web3 wallet first.');
      return;
    }

    const currentQuote = quotes[selectedNetwork];
    if (!currentQuote?.amount) {
      toast.error('Price quote unavailable. Please retry in a few moments.');
      return;
    }

    setProcessing(true);
    try {
      // 1. Ensure wallet is on the selected network
      if (chain?.id !== currentQuote.chainId) {
        toast.info(`Switching your wallet to ${currentQuote.name}...`);
        try {
          await switchChain({ chainId: currentQuote.chainId });
        } catch (switchErr: any) {
          toast.error(`Please switch your wallet to ${currentQuote.name} to continue.`);
          setProcessing(false);
          return;
        }
      }

      // 2. Dispatch native transaction to treasury
      const amountWei = parseEther(currentQuote.amount);
      toast.loading('Please confirm transaction in your wallet...');

      const hash = await sendTransactionAsync({
        to: DEFAULT_TREASURY_ADDRESS,
        value: amountWei,
      });

      setCryptoTxHash(hash);
      toast.dismiss();
      toast.loading(`Transaction broadcast: ${hash.slice(0, 8)}... Verifying on-chain...`);

      // 3. Verify transaction on backend
      const verifyRes = await fetch('/api/payments/crypto/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash: hash,
          chainId: currentQuote.chainId,
          moduleId: moduleData?.id || moduleId,
        }),
      });

      const verifyData = await verifyRes.json();
      toast.dismiss();

      if (verifyRes.ok && verifyData.success) {
        setExplorerUrl(verifyData.explorerUrl);
        triggerSuccess();
      } else {
        toast.error(verifyData.error || 'Transaction verification failed.');
      }
    } catch (err: any) {
      toast.dismiss();
      console.warn('Crypto checkout note:', err);
      if (err.message?.includes('User rejected') || err.message?.includes('denied')) {
        toast.error('Transaction was cancelled by user.');
      } else {
        toast.error(err.shortMessage || err.message || 'Crypto transaction failed.');
      }
    } finally {
      setProcessing(false);
    }
  };

  const copyTreasuryAddress = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(DEFAULT_TREASURY_ADDRESS);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
      toast.success('Treasury address copied to clipboard');
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <span className="text-xs font-mono text-muted-foreground">Preparing Secure Checkout...</span>
        </div>
      </DashboardShell>
    );
  }

  if (!moduleData) {
    return (
      <DashboardShell>
        <div className="max-w-md mx-auto my-16 p-8 rounded-2xl border border-border bg-card text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-foreground font-display">Module Not Found</h2>
          <p className="text-xs text-muted-foreground">The requested course module is not available.</p>
          <Link
            href="/dashboard/marketplace"
            className="inline-block px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all"
          >
            Return to Marketplace
          </Link>
        </div>
      </DashboardShell>
    );
  }

  // SUCCESS SCREEN
  if (success) {
    return (
      <DashboardShell>
        <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl border border-emerald-500/40 bg-card text-center space-y-6 shadow-xl">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500 animate-pulse">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Payment Confirmed & Verified
            </span>
            <h1 className="text-3xl font-black text-foreground font-display">Welcome to the Cohort!</h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              You are now enrolled in <strong>{moduleData.title}</strong>. All curriculum lessons, quizzes, and resources are unlocked.
            </p>
          </div>

          {cryptoTxHash && explorerUrl && (
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs font-mono text-left space-y-1">
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">On-Chain Proof:</span>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 break-all font-semibold"
              >
                <span>{cryptoTxHash}</span>
                <ExternalLink size={13} className="shrink-0" />
              </a>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => router.push(`/dashboard/my-modules?moduleId=${moduleData.id}`)}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              Start Learning Now
            </button>
            <Link
              href="/dashboard/marketplace"
              className="w-full sm:w-auto px-6 py-3.5 border border-border hover:bg-muted text-foreground text-xs font-semibold rounded-xl transition-colors text-center"
            >
              Browse More Modules
            </Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const isFree = !moduleData.price || moduleData.price === 0;
  const currentQuote = quotes[selectedNetwork];

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto py-6 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <Link
            href="/dashboard/marketplace"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-mono transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
            <ShieldCheck size={15} />
            <span>Encrypted Multi-Rail Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-xs">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Order Summary
                </span>
                <h3 className="text-xl font-black text-foreground font-display mt-1">{moduleData.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-3 leading-relaxed">
                  {moduleData.description}
                </p>
              </div>

              {moduleData.thumbnailUrl && (
                <div className="w-full h-36 rounded-xl overflow-hidden bg-muted border border-border/70">
                  <img
                    src={moduleData.thumbnailUrl}
                    alt={moduleData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2.5 pt-4 border-t border-border text-xs font-mono">
                <div className="flex justify-between text-muted-foreground">
                  <span>Category</span>
                  <span className="text-foreground font-semibold">{moduleData.category || 'Core Protocol'}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Curriculum</span>
                  <span className="text-foreground font-semibold">{moduleData.lessons || 5} Technical Lessons</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Credential</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Verified Completion Badge</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Access Tier</span>
                  <span className="text-foreground font-semibold">Lifetime Access</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase block">Total Due</span>
                  <span className="text-2xl font-black text-foreground font-display">
                    {isFree ? 'FREE' : `$${moduleData.price}.00`}
                  </span>
                </div>
                {!isFree && (
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Fiat or Crypto
                  </span>
                )}
              </div>
            </div>

            {/* Treasury Guarantee */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-border text-xs font-mono text-muted-foreground space-y-2">
              <div className="flex items-center gap-2 text-foreground font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Zero-Intermediary Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Crypto payments are settled directly on-chain to the platform treasury. Instant access is granted automatically upon transaction confirmation.
              </p>
            </div>
          </div>

          {/* RIGHT: Payment Rail Selection */}
          <div className="lg:col-span-7 space-y-6">
            {isFree ? (
              /* Free Module Case */
              <div className="bg-card border border-border rounded-2xl p-6 space-y-6 text-center">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto text-emerald-500">
                  <Sparkles size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground font-display">Free Curriculum Module</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    This module is sponsored for open-source Web3 builders. No payment or credit card is required.
                  </p>
                </div>
                <button
                  onClick={handleFreeCheckout}
                  disabled={processing}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{processing ? 'Enrolling...' : 'Enroll in Module for Free'}</span>
                </button>
              </div>
            ) : (
              /* Paid Module Multi-Rail Checkout */
              <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-foreground font-display">Select Payment Rail</h3>
                  <p className="text-xs text-muted-foreground">
                    Choose fiat via PayPal or settle with low gas fees on Base or Polygon.
                  </p>
                </div>

                {/* Rail Tabs */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-muted/40 border border-border rounded-xl">
                  <button
                    onClick={() => setPaymentTab('CRYPTO')}
                    className={`py-2.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      paymentTab === 'CRYPTO'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Coins size={14} />
                    <span>Crypto (Base, Polygon, L1)</span>
                  </button>

                  <button
                    onClick={() => setPaymentTab('FIAT_PAYPAL')}
                    className={`py-2.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      paymentTab === 'FIAT_PAYPAL'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <CreditCard size={14} />
                    <span>Fiat (PayPal & Cards)</span>
                  </button>
                </div>

                {/* TAB 1: CRYPTO PAYMENT */}
                {paymentTab === 'CRYPTO' && (
                  <div className="space-y-5">
                    {/* Network Selector with Gas estimates */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-mono font-bold uppercase text-muted-foreground block">
                        Select Payment Network:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* BASE */}
                        <button
                          onClick={() => setSelectedNetwork('base')}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                            selectedNetwork === 'base'
                              ? 'border-emerald-500 bg-emerald-500/10 text-foreground ring-1 ring-emerald-500'
                              : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-500" /> Base Network
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                              Recommended
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-muted-foreground mt-1 flex items-center justify-between">
                            <span>Gas: ~ $0.01</span>
                            <span className="text-foreground font-semibold">
                              {quotes.base.amount} ETH
                            </span>
                          </div>
                        </button>

                        {/* POLYGON */}
                        <button
                          onClick={() => setSelectedNetwork('polygon')}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedNetwork === 'polygon'
                              ? 'border-emerald-500 bg-emerald-500/10 text-foreground ring-1 ring-emerald-500'
                              : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-purple-500" /> Polygon PoS
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground">Low Gas</span>
                          </div>
                          <div className="text-[11px] font-mono text-muted-foreground mt-1 flex items-center justify-between">
                            <span>Gas: &lt; $0.01</span>
                            <span className="text-foreground font-semibold">
                              {quotes.polygon.amount} POL
                            </span>
                          </div>
                        </button>

                        {/* ETHEREUM MAINNET */}
                        <button
                          onClick={() => setSelectedNetwork('ethereum')}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedNetwork === 'ethereum'
                              ? 'border-emerald-500 bg-emerald-500/10 text-foreground ring-1 ring-emerald-500'
                              : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-slate-400" /> Ethereum L1
                            </span>
                            <span className="text-[10px] font-mono text-amber-500">L1 Gas</span>
                          </div>
                          <div className="text-[11px] font-mono text-muted-foreground mt-1 flex items-center justify-between">
                            <span>Gas: $2 - $5</span>
                            <span className="text-foreground font-semibold">
                              {quotes.ethereum.amount} ETH
                            </span>
                          </div>
                        </button>

                        {/* SEPOLIA TESTNET */}
                        <button
                          onClick={() => setSelectedNetwork('sepolia')}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedNetwork === 'sepolia'
                              ? 'border-emerald-500 bg-emerald-500/10 text-foreground ring-1 ring-emerald-500'
                              : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-400" /> Sepolia Testnet
                            </span>
                            <span className="text-[10px] font-mono text-emerald-500">Free Test</span>
                          </div>
                          <div className="text-[11px] font-mono text-muted-foreground mt-1 flex items-center justify-between">
                            <span>Test ETH</span>
                            <span className="text-foreground font-semibold">
                              {quotes.sepolia.amount} SepoliaETH
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Converted Price & Treasury Preview */}
                    <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Amount to Pay:</span>
                        <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                          {currentQuote?.amount} {currentQuote?.symbol}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                        <span>Selected Network:</span>
                        <span className="text-foreground font-semibold">{currentQuote?.name}</span>
                      </div>
                      <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Platform Treasury:</span>
                        <div className="flex items-center gap-1.5 text-foreground font-semibold">
                          <span>{DEFAULT_TREASURY_ADDRESS.slice(0, 6)}...{DEFAULT_TREASURY_ADDRESS.slice(-4)}</span>
                          <button
                            onClick={copyTreasuryAddress}
                            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Copy treasury address"
                          >
                            {copiedAddress ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Wallet Action Button (Protected by mounted SSR guard) */}
                    <div className="space-y-3 pt-2">
                      {!mounted ? (
                        <div className="w-full py-4 bg-muted animate-pulse rounded-xl" />
                      ) : !isConnected ? (
                        <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-border bg-muted/20 gap-3">
                          <span className="text-xs text-muted-foreground">Connect your Web3 wallet to settle on {currentQuote?.name}</span>
                          <ConnectButton showBalance={false} chainStatus="icon" />
                        </div>
                      ) : chain?.id !== currentQuote?.chainId ? (
                        <button
                          onClick={() => switchChain({ chainId: currentQuote.chainId })}
                          disabled={isSwitchingChain}
                          className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                        >
                          {isSwitchingChain ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap size={14} />}
                          <span>Switch Wallet to {currentQuote?.name}</span>
                        </button>
                      ) : (
                        <button
                          onClick={handleCryptoPayment}
                          disabled={processing || isSendingTx}
                          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {processing || isSendingTx ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Broadcasting & Verifying On-Chain...</span>
                            </>
                          ) : (
                            <>
                              <Coins size={15} />
                              <span>Pay {currentQuote?.amount} {currentQuote?.symbol} on {currentQuote?.name}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: FIAT (PAYPAL & CREDIT/DEBIT CARDS) */}
                {paymentTab === 'FIAT_PAYPAL' && (
                  <div className="space-y-5">
                    <div className="p-4 rounded-xl border border-border bg-muted/30 text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center justify-between text-foreground font-semibold">
                        <span>PayPal & Major Credit Cards</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                          ${moduleData.price}.00 USD
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Pay securely with your PayPal account, Debit Card, or Credit Card (Visa, Mastercard, Amex, Discover).
                      </p>
                    </div>

                    {/* Official PayPal Buttons Mount Point if valid client ID exists */}
                    {hasRealPayPalClientId ? (
                      <div ref={paypalContainerRef} className="min-h-[50px] w-full" />
                    ) : (
                      /* Clean Instant Sandbox / Demo UI without broken script injection */
                      <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                          <CreditCard size={15} />
                          <span>PayPal Sandbox Gateway</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          PayPal sandbox is active. You can execute an instant verified checkout to test the enrollment pipeline:
                        </p>
                        <button
                          onClick={handleDemoPayPalCapture}
                          disabled={processing}
                          className="w-full py-3 bg-[#0070ba] hover:bg-[#003087] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard size={14} />}
                          <span>Simulate PayPal Payment (${moduleData.price}.00 USD)</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default function CheckoutPage() {
  return (
    <React.Suspense
      fallback={
        <DashboardShell>
          <div className="flex-1 flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        </DashboardShell>
      }
    >
      <CheckoutContent />
    </React.Suspense>
  );
}
