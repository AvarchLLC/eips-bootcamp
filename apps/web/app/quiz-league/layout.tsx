'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ThemedLogoGif } from '@/app/components/ThemedLogoGif';
import { Flame, Trophy, Award, User, ShieldAlert, Sparkles, LayoutDashboard } from 'lucide-react';

interface QuizLeagueLayoutProps {
  children: React.ReactNode;
}

export default function QuizLeagueLayout({ children }: QuizLeagueLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/quiz-league', icon: LayoutDashboard },
    { label: "Today's Quiz", href: '/quiz-league/daily', icon: Flame },
    { label: 'Leaderboard', href: '/quiz-league/leaderboard', icon: Trophy },
    { label: 'NFT Rewards', href: '/quiz-league/rewards', icon: Award },
    { label: 'My Profile', href: '/quiz-league/profile', icon: User },
    { label: 'Admin', href: '/quiz-league/admin', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] font-sans selection:bg-violet-500/30 selection:text-violet-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#09090B]/90 backdrop-blur-md border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 group">
                <ThemedLogoGif alt="ETHShala" width={38} height={38} unoptimized />
                <div className="flex flex-col">
                  <span className="font-extrabold text-lg tracking-tight flex items-center gap-1.5 text-white">
                    ETH<span className="text-violet-400">Shala</span>
                  </span>
                  <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-[#F5C451] flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    Quiz League
                  </span>
                </div>
              </Link>

              {/* Navigation Tabs (Desktop) */}
              <nav className="hidden md:flex items-center gap-1">
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
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-[#18181B] text-white border border-[#27272A] shadow-inner shadow-violet-500/10 text-violet-300'
                          : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]/60'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-violet-400' : 'text-zinc-500'}`} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Wallet Connect & Back to Main LMS */}
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#A1A1AA] hover:text-white bg-[#111114] border border-[#27272A] hover:border-zinc-600 transition-colors"
              >
                Campus LMS
              </Link>

              {/* RainbowKit Wallet Connect Button with custom styled wrapper */}
              <div className="quiz-league-wallet-wrapper scale-90 sm:scale-95 origin-right">
                <ConnectButton
                  showBalance={false}
                  chainStatus="icon"
                  accountStatus={{
                    smallScreen: 'avatar',
                    largeScreen: 'full',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Mobile Navigation Tabs */}
          <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-[#27272A]/40 scrollbar-none">
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#18181B] text-violet-300 border border-[#27272A]'
                      : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}

