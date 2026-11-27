'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from '@/app/lib/auth-client';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import LoadingScreen from '@/app/components/ui/LoadingScreen';
import {
  getAdminPaymentsData,
  grantManualCourseAccess,
  revokeCourseAccess,
} from '@/app/actions/admin-payments';
import {
  CreditCard,
  ShieldCheck,
  Users,
  Layers,
  Search,
  Plus,
  Trash2,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPaymentsPage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const userRole = (user as any)?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'admin';

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<{
    subscriptions: any[];
    paymentReceipts: any[];
    modules: any[];
    users: any[];
    stats: any;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'subscriptions' | 'receipts'>('subscriptions');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);

  // Manual Grant Form state
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [grantNotes, setGrantNotes] = useState('');
  const [submittingGrant, setSubmittingGrant] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await getAdminPaymentsData();
      setData(res);
      if (res.modules.length > 0 && !selectedModuleId) {
        setSelectedModuleId(res.modules[0].id);
      }
      if (res.users.length > 0 && !selectedUserId) {
        setSelectedUserId(res.users[0].id);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load payment administration data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedModuleId, selectedUserId]);

  useEffect(() => {
    if (!isPending) {
      if (isAdmin) {
        loadData();
      } else {
        setLoading(false);
      }
    }
  }, [isPending, isAdmin, loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    toast.success('Admin payments data refreshed');
  };

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedModuleId) {
      toast.error('Please select both a student and a module');
      return;
    }

    setSubmittingGrant(true);
    try {
      const res = await grantManualCourseAccess(selectedUserId, selectedModuleId, grantNotes);
      if (res.success) {
        toast.success('Course access granted successfully!');
        setIsGrantModalOpen(false);
        setGrantNotes('');
        await loadData();
      } else {
        toast.error(res.error || 'Failed to grant course access');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error granting course access');
    } finally {
      setSubmittingGrant(false);
    }
  };

  const handleRevoke = async (userId: string, moduleId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to revoke course access for ${studentName}?`)) {
      return;
    }

    try {
      const res = await revokeCourseAccess(userId, moduleId);
      if (res.success) {
        toast.success(`Revoked course access for ${studentName}`);
        await loadData();
      } else {
        toast.error(res.error || 'Failed to revoke access');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error revoking access');
    }
  };

  // Filtered subscriptions
  const filteredSubscriptions = useMemo(() => {
    if (!data?.subscriptions) return [];
    if (!searchQuery.trim()) return data.subscriptions;
    const q = searchQuery.toLowerCase();
    return data.subscriptions.filter(
      (s) =>
        s.user?.name?.toLowerCase().includes(q) ||
        s.user?.email?.toLowerCase().includes(q) ||
        s.module?.title?.toLowerCase().includes(q)
    );
  }, [data?.subscriptions, searchQuery]);

  // Filtered receipts
  const filteredReceipts = useMemo(() => {
    if (!data?.paymentReceipts) return [];
    if (!searchQuery.trim()) return data.paymentReceipts;
    const q = searchQuery.toLowerCase();
    return data.paymentReceipts.filter(
      (r) =>
        r.identifier.toLowerCase().includes(q) ||
        JSON.stringify(r.data).toLowerCase().includes(q)
    );
  }, [data?.paymentReceipts, searchQuery]);

  if (isPending || loading) {
    return <LoadingScreen text="VERIFYING ADMIN PRIVILEGES & RETRIEVING AUDITS..." />;
  }

  if (!isAdmin) {
    return (
      <DashboardShell>
        <div className="min-h-[500px] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-black text-foreground">Access Restricted</h2>
          <p className="text-sm text-muted-foreground max-w-md mt-1 mb-6">
            You need administrator permissions to view payment audits and manage course access.
          </p>
          <a
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md"
          >
            Return to Dashboard
          </a>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6 pb-14 font-sans">
        <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');` }} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80 relative">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0e7955]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                Admin Panel // Order Verification &amp; Grants
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Payment Audits &amp; Course Grants
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              Inspect verified on-chain crypto and PayPal transactions, track active course enrollments, and manually grant student access.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-accent text-foreground text-xs font-bold transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            <button
              onClick={() => setIsGrantModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#064a3a] hover:bg-[#043328] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              <Plus size={15} />
              <span>Grant Course Access</span>
            </button>
          </div>
        </div>

        {/* 1. Stat Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border-2 border-[#111] dark:border-white/20 bg-[#fcfbf7] dark:bg-[#0c1814] shadow-[4px_4px_0px_#0e7955]">
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
              <Users size={14} className="text-[#0e7955]" /> Total Subscriptions
            </span>
            <div className="my-2">
              <span className="text-3xl font-black text-foreground">{data?.stats.totalSubscriptions || 0}</span>
              <span className="text-xs text-muted-foreground ml-1.5 font-medium">students</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Active course enrollments across platform</p>
          </div>

          <div className="p-5 rounded-2xl border-2 border-[#111] dark:border-white/20 bg-card shadow-[4px_4px_0px_#f8bd36]">
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
              <CreditCard size={14} className="text-[#f8bd36]" /> Total Track Value
            </span>
            <div className="my-2">
              <span className="text-3xl font-black text-foreground">${data?.stats.totalRevenue?.toLocaleString() || 0}</span>
              <span className="text-xs text-muted-foreground ml-1.5 font-medium">USD</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Combined value of enrolled premium tracks</p>
          </div>

          <div className="p-5 rounded-2xl border-2 border-[#111] dark:border-white/20 bg-card shadow-[4px_4px_0px_#111] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.15)]">
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-primary" /> Verified Receipts
            </span>
            <div className="my-2">
              <span className="text-3xl font-black text-foreground">{data?.stats.receiptsLogged || 0}</span>
              <span className="text-xs text-muted-foreground ml-1.5 font-medium">proofs</span>
            </div>
            <p className="text-[11px] text-muted-foreground">On-chain crypto &amp; PayPal audit records</p>
          </div>

          <div className="p-5 rounded-2xl border-2 border-[#111] dark:border-white/20 bg-card shadow-[4px_4px_0px_#111] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.15)]">
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
              <Layers size={14} className="text-muted-foreground" /> Premium Modules
            </span>
            <div className="my-2">
              <span className="text-3xl font-black text-foreground">{data?.stats.premiumModulesCount || 0}</span>
              <span className="text-xs text-muted-foreground ml-1.5 font-medium">of {data?.modules.length || 0} tracks</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Live curriculum tracks requiring enrollment</p>
          </div>
        </div>

        {/* 2. Main Ledger & Table Section */}
        <div className="rounded-2xl border-2 border-[#111] dark:border-white/20 bg-card p-6 shadow-[5px_5px_0px_#111] dark:shadow-[5px_5px_0px_rgba(255,255,255,0.15)]">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
            <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'subscriptions'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Active Enrolled Students ({data?.subscriptions.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('receipts')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'receipts'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Verification Audit Receipts ({data?.paymentReceipts.length || 0})
              </button>
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students, modules, hashes..."
                className="pl-8 pr-3 py-1.5 bg-muted/60 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary w-52 sm:w-64"
              />
            </div>
          </div>

          {/* Table Contents */}
          <div className="mt-4 overflow-x-auto">
            {activeTab === 'subscriptions' ? (
              filteredSubscriptions.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  No student subscriptions found.
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      <th className="py-3 px-3">Student</th>
                      <th className="py-3 px-3">Enrolled Track / Module</th>
                      <th className="py-3 px-3">Price</th>
                      <th className="py-3 px-3">Date Enrolled</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredSubscriptions.map((s) => (
                      <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                              {s.user?.image ? (
                                <img src={s.user.image} alt="" className="w-full h-full rounded-full object-cover" />
                              ) : (
                                s.user?.name?.charAt(0) || 'U'
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-xs text-foreground leading-tight">
                                {s.user?.name || 'Anonymous Student'}
                              </p>
                              <p className="text-[10px] text-muted-foreground font-mono">{s.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-xs text-foreground">{s.module?.title || 'Unknown Track'}</p>
                          <span className={`inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded mt-0.5 ${
                            s.module?.isPremium ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' : 'bg-muted text-muted-foreground'
                          }`}>
                            {s.module?.isPremium ? 'Premium Track' : 'Standard'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-xs font-bold text-foreground">
                          ${s.module?.price || 0}
                        </td>
                        <td className="py-3 px-3 text-xs text-muted-foreground font-mono">
                          {new Date(s.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleRevoke(s.userId, s.moduleId, s.user?.name || s.user?.email || 'student')}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Revoke course access"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : filteredReceipts.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No payment receipts logged yet.
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Provider</th>
                    <th className="py-3 px-3">Verification Identifier</th>
                    <th className="py-3 px-3">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredReceipts.map((r) => {
                    const isCrypto = r.identifier.startsWith('crypto_payment:');
                    const isPaypal = r.identifier.startsWith('paypal_payment:');

                    return (
                      <tr key={r.id} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3 px-3 text-xs text-muted-foreground font-mono">
                          {new Date(r.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              isCrypto
                                ? 'bg-[#0e7955]/15 text-[#0e7955] dark:text-[#61d9b9]'
                                : isPaypal
                                ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                                : 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                            }`}
                          >
                            {isCrypto ? 'Crypto (Base)' : isPaypal ? 'PayPal' : 'Manual Grant'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-xs text-foreground max-w-xs truncate">
                          {r.identifier}
                        </td>
                        <td className="py-3 px-3 text-xs text-muted-foreground font-mono max-w-sm truncate">
                          {JSON.stringify(r.data)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 3. Manual Course Access Grant Modal */}
        {isGrantModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-[#fcfbf7] dark:bg-[#0c1814] border-2 border-[#111] dark:border-white/20 rounded-2xl shadow-[8px_8px_0px_#111] dark:shadow-[8px_8px_0px_rgba(255,255,255,0.15)] p-6 sm:p-7">
              <button
                onClick={() => setIsGrantModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="mb-5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0e7955] dark:text-[#61d9b9]">
                  Admin Action // Manual Enrollment
                </span>
                <h3 className="text-2xl font-black text-foreground tracking-tight mt-1">
                  Grant Course Access
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Directly activate a student's course subscription after verifying manual bank transfer or fellowship grant.
                </p>
              </div>

              <form onSubmit={handleGrantAccess} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Select Student User
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:border-primary"
                    required
                  >
                    {data?.users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name ? `${u.name} (${u.email})` : u.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Select Course Track / Module
                  </label>
                  <select
                    value={selectedModuleId}
                    onChange={(e) => setSelectedModuleId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:border-primary"
                    required
                  >
                    {data?.modules.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title} {m.isPremium ? `($${m.price} Premium)` : '(Free)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Verification Notes &amp; Audit Reason
                  </label>
                  <textarea
                    value={grantNotes}
                    onChange={(e) => setGrantNotes(e.target.value)}
                    placeholder="e.g. Verified UPI transfer ref #39482, or Campus Ambassador Fellowship scholarship"
                    rows={3}
                    className="w-full p-2.5 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsGrantModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingGrant}
                    className="px-5 py-2 rounded-xl bg-[#064a3a] hover:bg-[#043328] text-white text-xs font-bold shadow-md transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {submittingGrant ? 'Granting...' : 'Confirm & Grant Access'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
