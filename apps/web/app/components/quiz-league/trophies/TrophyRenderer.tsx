import React from 'react';
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

export const TrophyRenderer: React.FC<TrophyRendererProps> = ({
  type,
  size = 'md',
  className = '',
  glow = true,
}) => {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size] || 64;

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
        <ChampionTrophy size={28} glow={false} />
        <span className="font-extrabold text-amber-400 text-sm">#1</span>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <RunnerUpTrophy size={26} glow={false} />
        <span className="font-extrabold text-slate-300 text-sm">#2</span>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <ThirdPlaceTrophy size={24} glow={false} />
        <span className="font-extrabold text-amber-600 text-sm">#3</span>
      </div>
    );
  }
  return (
    <div className={`w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center font-mono font-bold text-xs text-zinc-400 ${className}`}>
      #{rank}
    </div>
  );
};

