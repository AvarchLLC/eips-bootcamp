'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import { Flame, Trophy, LayoutDashboard } from 'lucide-react';

interface QuizLeagueLayoutProps {
  children: React.ReactNode;
}

export default function QuizLeagueLayout({ children }: QuizLeagueLayoutProps) {
  const pathname = usePathname();

  // If inside an active daily quiz stage arena, render focused stage mode
  const isPlayingQuiz = pathname ? /^\/quiz-league\/daily\/[^/]+$/.test(pathname) : false;

  const navItems = [
    { label: 'Overview', href: '/quiz-league', icon: LayoutDashboard },
    { label: 'Daily Challenges', href: '/quiz-league/daily', icon: Flame },
    { label: 'Championship Leaderboard', href: '/quiz-league/leaderboard', icon: Trophy },
  ];

  if (isPlayingQuiz) {
    return (
      <DashboardShell>
        <div className="py-2">
          {children}
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-7xl mx-auto py-2">
        {/* Clean Sub-Navigation Pills (No duplicate branding banner) */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {navItems.map((item) => {
              const isActive =
                item.href === '/quiz-league'
                  ? pathname === '/quiz-league'
                  : pathname?.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-grotesk font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Weekly Season Active</span>
          </div>
        </div>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </DashboardShell>
  );
}
