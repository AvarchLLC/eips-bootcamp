'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChampionTrophy } from './ChampionTrophy';
import { RunnerUpTrophy } from './RunnerUpTrophy';
import { ThirdPlaceTrophy } from './ThirdPlaceTrophy';
import { PerfectScoreBadge, StreakBadge, QuizMasterBadge, EthshalaScholarBadge } from './AchievementBadges';

export type TrophyType =
  | 'CHAMPION'
  | 'RUNNER_UP'
  | 'THIRD_PLACE'
  | 'PERFECT_SCORE'
  | 'STREAK_7'
  | 'QUIZ_MASTER'
  | 'ETHSHALA_SCHOLAR';

interface TrophyRendererProps {
  type: TrophyType;
  size?: number | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  glow?: boolean;
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 80,
  xl: 120,
  hero: 220,
};

// Map each asset type to its target PNG path
const pngPathMap: Record<TrophyType, string> = {
  CHAMPION: '/brand/trophies/trophy-gold.png',
  RUNNER_UP: '/brand/trophies/trophy-silver.png',
  THIRD_PLACE: '/brand/trophies/trophy-bronze.png',
  PERFECT_SCORE: '/badges/badge-perfect.png',
  STREAK_7: '/badges/streak-fire.png',
  QUIZ_MASTER: '/badges/badge-master.png',
  ETHSHALA_SCHOLAR: '/badges/badge-scholar.png',
};

export const TrophyRenderer: React.FC<TrophyRendererProps> = ({
  type,
  size = 'md',
  className = '',
  glow = true,
}) => {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size] || 64;
  const [imgFailed, setImgFailed] = useState(false);
  const targetPng = pngPathMap[type];

  // If PNG is provided and has not failed, attempt to render it
  if (targetPng && !imgFailed) {
    return (
      <div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: pixelSize, height: pixelSize }}
      >
        {glow && (
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-40 pointer-events-none"
            style={{
              background:
                type === 'CHAMPION'
                  ? 'radial-gradient(circle, #f59e0b 0%, transparent 70%)'
                  : type === 'RUNNER_UP'
                  ? 'radial-gradient(circle, #cbd5e1 0%, transparent 70%)'
                  : type === 'THIRD_PLACE'
                  ? 'radial-gradient(circle, #d97706 0%, transparent 70%)'
                  : 'radial-gradient(circle, #10b981 0%, transparent 70%)',
            }}
          />
        )}
        <Image
          src={targetPng}
          alt={type}
          width={pixelSize}
          height={pixelSize}
          className="relative z-10 object-contain drop-shadow-md"
          onError={() => setImgFailed(true)}
          unoptimized
        />
      </div>
    );
  }

  // Graceful SVG fallback
  switch (type) {
    case 'CHAMPION':
      return <ChampionTrophy size={pixelSize} className={className} glow={glow} />;
    case 'RUNNER_UP':
      return <RunnerUpTrophy size={pixelSize} className={className} glow={glow} />;
    case 'THIRD_PLACE':
      return <ThirdPlaceTrophy size={pixelSize} className={className} glow={glow} />;
    case 'PERFECT_SCORE':
      return <PerfectScoreBadge size={pixelSize} className={className} glow={glow} />;
    case 'STREAK_7':
      return <StreakBadge size={pixelSize} className={className} glow={glow} />;
    case 'QUIZ_MASTER':
      return <QuizMasterBadge size={pixelSize} className={className} glow={glow} />;
    case 'ETHSHALA_SCHOLAR':
      return <EthshalaScholarBadge size={pixelSize} className={className} glow={glow} />;
    default:
      return <ChampionTrophy size={pixelSize} className={className} glow={glow} />;
  }
};

/**
 * Small Rank Badge for Leaderboard Rows (1st, 2nd, 3rd, and 4+)
 */
export const RankBadge: React.FC<{ rank: number; className?: string }> = ({ rank, className = '' }) => {
  if (rank === 1) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <TrophyRenderer type="CHAMPION" size={28} glow={false} />
        <span className="font-extrabold text-amber-500 dark:text-amber-400 text-sm font-mono">#1</span>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <TrophyRenderer type="RUNNER_UP" size={26} glow={false} />
        <span className="font-extrabold text-slate-500 dark:text-slate-300 text-sm font-mono">#2</span>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <TrophyRenderer type="THIRD_PLACE" size={24} glow={false} />
        <span className="font-extrabold text-amber-700 dark:text-amber-600 text-sm font-mono">#3</span>
      </div>
    );
  }
  return (
    <div className={`w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center font-mono font-bold text-xs text-muted-foreground ${className}`}>
      #{rank}
    </div>
  );
};
