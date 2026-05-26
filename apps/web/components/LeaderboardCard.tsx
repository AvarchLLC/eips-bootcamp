'use client';

import React from 'react';
import { Crown, Medal, Star, Award, TrendingUp, Flame } from 'lucide-react';

interface LeaderboardCardProps {
  rank: number;
  username: string;
  xp: number;
  level: number;
  avatar: string;
  badge?: string;
  courseProgress: number;
  coursesCompleted: number;
  lastActive?: string;
  isCurrentUser?: boolean;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  rank,
  username,
  xp,
  level,
  avatar,
  badge,
  courseProgress,
  coursesCompleted,
  lastActive,
  isCurrentUser = false,
}) => {
  // Get rank icon/color
  const getRankDisplay = () => {
    if (rank === 1) {
      return {
        icon: <Crown size={28} className="text-yellow-400" />,
        color: 'from-yellow-500/20 to-orange-500/20',
        borderColor: 'border-yellow-500/30',
      };
    } else if (rank === 2) {
      return {
        icon: <Medal size={28} className="text-slate-300" />,
        color: 'from-slate-400/20 to-slate-500/20',
        borderColor: 'border-slate-400/30',
      };
    } else if (rank === 3) {
      return {
        icon: <Medal size={28} className="text-orange-400" />,
        color: 'from-orange-500/20 to-orange-400/20',
        borderColor: 'border-orange-500/30',
      };
    } else {
      return {
        icon: (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/30 to-emerald-500/30 border border-teal-500/30 flex items-center justify-center">
            <span className="text-teal-300 font-bold text-lg">#{rank}</span>
          </div>
        ),
        color: 'from-teal-500/20 to-emerald-500/20',
        borderColor: 'border-teal-500/30',
      };
    }
  };

  const rankDisplay = getRankDisplay();

  return (
    <div
      className={`bg-gradient-to-br ${rankDisplay.color} border ${rankDisplay.borderColor} rounded-2xl p-6 hover:border-teal-500/50 transition-all cursor-pointer transform hover:scale-105 ${
        isCurrentUser ? 'ring-2 ring-teal-500' : ''
      }`}
    >
      {/* Header with Rank */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {rankDisplay.icon}
        </div>

        {badge && (
          <span className="text-xs font-bold px-2 py-1 bg-gradient-to-r from-teal-500/30 to-emerald-500/30 border border-teal-500/50 rounded-full text-teal-300">
            {badge}
          </span>
        )}
      </div>

      {/* Avatar & Username */}
      <div className="flex items-center gap-3 mb-4">
        <img src={avatar} alt={username} className="w-14 h-14 rounded-full border-2 border-slate-600" />
        <div>
          <p className="font-bold text-white text-lg">{username}</p>
          {isCurrentUser && <p className="text-xs text-teal-400 font-semibold">YOU</p>}
          {lastActive && !isCurrentUser && (
            <p className="text-xs text-slate-400">{lastActive}</p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4 p-4 bg-slate-800/30 rounded-lg">
        {/* Level */}
        <div className="text-center">
          <div className="flex justify-center mb-1">
            <Star size={16} className="text-purple-400" />
          </div>
          <p className="text-sm font-bold text-white">{level}</p>
          <p className="text-xs text-slate-400">Level</p>
        </div>

        {/* XP */}
        <div className="text-center">
          <div className="flex justify-center mb-1">
            <TrendingUp size={16} className="text-teal-400" />
          </div>
          <p className="text-sm font-bold text-white">{(xp / 1000).toFixed(1)}k</p>
          <p className="text-xs text-slate-400">XP</p>
        </div>

        {/* Courses */}
        <div className="text-center">
          <div className="flex justify-center mb-1">
            <Award size={16} className="text-emerald-400" />
          </div>
          <p className="text-sm font-bold text-white">{coursesCompleted}</p>
          <p className="text-xs text-slate-400">Courses</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between mb-2">
          <p className="text-xs text-slate-400">Course Progress</p>
          <p className="text-xs font-semibold text-teal-400">{courseProgress}%</p>
        </div>
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all"
            style={{ width: `${courseProgress}%` }}
          ></div>
        </div>
      </div>

      {/* View Profile Button */}
      <button className="w-full py-2 text-center text-sm font-semibold text-teal-400 hover:text-teal-300 border border-teal-500/30 hover:border-teal-500/50 rounded-lg transition-all">
        View Profile →
      </button>
    </div>
  );
};

export default LeaderboardCard;