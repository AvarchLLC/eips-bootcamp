'use client';

import React from 'react';
import LeaderboardCard from './LeaderboardCard';

interface LeaderboardUser {
  rank: number;
  id: string;
  username: string;
  xp: number;
  level: number;
  avatar: string;
  badge?: string;
  courseProgress: number;
  coursesCompleted: number;
  lastActive?: string;
}

interface LeaderboardGridProps {
  users: LeaderboardUser[];
  currentUserId?: string;
  isLoading?: boolean;
}

const LeaderboardGrid: React.FC<LeaderboardGridProps> = ({
  users,
  currentUserId = '8',
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-2xl p-6 animate-pulse"
          >
            <div className="h-8 w-8 bg-slate-600 rounded-lg mb-4"></div>
            <div className="h-14 w-14 bg-slate-600 rounded-full mb-4"></div>
            <div className="h-4 w-24 bg-slate-600 rounded mb-2"></div>
            <div className="h-3 w-16 bg-slate-600 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-lg">No users found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <LeaderboardCard
          key={user.id}
          rank={user.rank}
          username={user.username}
          xp={user.xp}
          level={user.level}
          avatar={user.avatar}
          badge={user.badge}
          courseProgress={user.courseProgress}
          coursesCompleted={user.coursesCompleted}
          lastActive={user.lastActive}
          isCurrentUser={user.id === currentUserId}
        />
      ))}
    </div>
  );
};

export default LeaderboardGrid;