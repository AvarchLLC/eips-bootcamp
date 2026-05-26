'use client';

import React, { useState, useMemo } from 'react';
import {
  Trophy,
  TrendingUp,
  Medal,
  Star,
  Filter,
  Search,
  Crown,
  Flame,
  Award,
} from 'lucide-react';
import Link from 'next/link';

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
}

type SortOption = 'xp' | 'level' | 'coursesCompleted';
type FilterOption = 'all' | 'week' | 'month';

const LeaderboardPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<SortOption>('xp');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock leaderboard data
  const mockData: LeaderboardUser[] = [
    {
      rank: 1,
      id: '1',
      username: 'Ethereum Master',
      xp: 15750,
      level: 25,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EthereumMaster',
      badge: '👑 Legendary',
      courseProgress: 100,
      coursesCompleted: 12,
    },
    {
      rank: 2,
      id: '2',
      username: 'Smart Contract Wizard',
      xp: 14200,
      level: 23,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SmartContractWizard',
      badge: '⭐ Master',
      courseProgress: 95,
      coursesCompleted: 11,
    },
    {
      rank: 3,
      id: '3',
      username: 'BlockChain Dev',
      xp: 13500,
      level: 22,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BlockChainDev',
      badge: '🔥 Expert',
      courseProgress: 90,
      coursesCompleted: 10,
    },
    {
      rank: 4,
      id: '4',
      username: 'Solidity Expert',
      xp: 12800,
      level: 21,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SolidityExpert',
      courseProgress: 85,
      coursesCompleted: 9,
    },
    {
      rank: 5,
      id: '5',
      username: 'Web3 Pioneer',
      xp: 11900,
      level: 20,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Web3Pioneer',
      courseProgress: 80,
      coursesCompleted: 8,
    },
    {
      rank: 6,
      id: '6',
      username: 'DeFi Enthusiast',
      xp: 10500,
      level: 18,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DeFiEnthusiast',
      courseProgress: 75,
      coursesCompleted: 7,
    },
    {
      rank: 7,
      id: '7',
      username: 'Protocol Analyzer',
      xp: 9800,
      level: 17,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProtocolAnalyzer',
      courseProgress: 70,
      coursesCompleted: 6,
    },
    {
      rank: 8,
      id: '8',
      username: 'Subhrajeet Kumar',
      xp: 8750,
      level: 16,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Subhrajeet',
      badge: '🎯 Rising Star',
      courseProgress: 66,
      coursesCompleted: 5,
    },
    {
      rank: 9,
      id: '9',
      username: 'EIP Contributor',
      xp: 7600,
      level: 14,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EIPContributor',
      courseProgress: 60,
      coursesCompleted: 4,
    },
    {
      rank: 10,
      id: '10',
      username: 'Learning Developer',
      xp: 6450,
      level: 12,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LearningDeveloper',
      courseProgress: 55,
      coursesCompleted: 3,
    },
  ];

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = [...mockData];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'xp') return b.xp - a.xp;
      if (sortBy === 'level') return b.level - a.level;
      if (sortBy === 'coursesCompleted') return b.coursesCompleted - a.coursesCompleted;
      return 0;
    });

    return filtered;
  }, [sortBy, searchQuery]);

  const currentUser = filteredData.find((user) => user.id === '8');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-2">
              <Trophy size={40} className="text-yellow-400" />
              Leaderboard
            </h1>
            <p className="text-slate-400">Compete with other learners and climb the ranks</p>
          </div>

          <Link
            href="/dashboard"
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            ← Back
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Your Rank */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Medal size={20} className="text-yellow-400" />
              <p className="text-slate-400 text-sm font-medium">Your Rank</p>
            </div>
            <p className="text-3xl font-bold text-white">#{currentUser?.rank || '-'}</p>
            <p className="text-slate-400 text-xs mt-2">of {filteredData.length} users</p>
          </div>

          {/* Your XP */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={20} className="text-teal-400" />
              <p className="text-slate-400 text-sm font-medium">Your XP</p>
            </div>
            <p className="text-3xl font-bold text-white">{currentUser?.xp || '-'}</p>
            <p className="text-slate-400 text-xs mt-2">Experience Points</p>
          </div>

          {/* Your Level */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Star size={20} className="text-purple-400" />
              <p className="text-slate-400 text-sm font-medium">Your Level</p>
            </div>
            <p className="text-3xl font-bold text-white">{currentUser?.level || '-'}</p>
            <p className="text-slate-400 text-xs mt-2">Progression Level</p>
          </div>

          {/* Courses Completed */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Award size={20} className="text-emerald-400" />
              <p className="text-slate-400 text-sm font-medium">Courses</p>
            </div>
            <p className="text-3xl font-bold text-white">{currentUser?.coursesCompleted || '-'}</p>
            <p className="text-slate-400 text-xs mt-2">Completed</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-700/30 border border-slate-600 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full bg-slate-700/30 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all appearance-none"
              >
                <option value="xp">Sort by XP</option>
                <option value="level">Sort by Level</option>
                <option value="coursesCompleted">Sort by Courses</option>
              </select>
              <TrendingUp className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>

            {/* Filter */}
            <div className="relative">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                className="w-full bg-slate-700/30 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all appearance-none"
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-700 bg-slate-800/50">
            <div className="col-span-1 text-left">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rank</p>
            </div>
            <div className="col-span-4 text-left">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">User</p>
            </div>
            <div className="col-span-2 text-left">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Level</p>
            </div>
            <div className="col-span-2 text-left">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">XP</p>
            </div>
            <div className="col-span-2 text-left">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Courses</p>
            </div>
            <div className="col-span-1 text-right">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Badge</p>
            </div>
          </div>

          {/* Users */}
          <div className="divide-y divide-slate-700">
            {filteredData.map((user, index) => (
              <div
                key={user.id}
                className={`px-6 py-4 transition-all hover:bg-slate-700/30 ${
                  user.id === '8'
                    ? 'bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border-l-4 border-teal-500'
                    : ''
                }`}
              >
                {/* Mobile */}
                <div className="md:hidden space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Rank Medal */}
                      <div className="text-center">
                        {user.rank === 1 ? (
                          <Crown size={24} className="text-yellow-400" />
                        ) : user.rank === 2 ? (
                          <Medal size={24} className="text-slate-300" />
                        ) : user.rank === 3 ? (
                          <Medal size={24} className="text-orange-400" />
                        ) : (
                          <div className="w-6 h-6 flex items-center justify-center text-slate-400 font-bold text-sm">
                            #{user.rank}
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-white">{user.username}</p>
                            <p className="text-xs text-slate-400">Level {user.level}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* XP Badge */}
                    <div className="text-right">
                      <p className="font-bold text-teal-400">{user.xp.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">XP</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <p className="text-slate-400">
                      {user.coursesCompleted} course{user.coursesCompleted !== 1 ? 's' : ''}
                    </p>
                    {user.badge && <span className="text-xs">{user.badge}</span>}
                  </div>
                </div>

                {/* Desktop */}
                <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                  {/* Rank */}
                  <div className="col-span-1">
                    <div className="text-center">
                      {user.rank === 1 ? (
                        <Crown size={24} className="text-yellow-400" />
                      ) : user.rank === 2 ? (
                        <Medal size={24} className="text-slate-300" />
                      ) : user.rank === 3 ? (
                        <Medal size={24} className="text-orange-400" />
                      ) : (
                        <span className="text-lg font-bold text-slate-400">#{user.rank}</span>
                      )}
                    </div>
                  </div>

                  {/* User */}
                  <div className="col-span-4 flex items-center gap-4">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-white">{user.username}</p>
                      <p className="text-xs text-slate-400">
                        {user.id === '8' ? 'You' : `${user.courseProgress}% complete`}
                      </p>
                    </div>
                  </div>

                  {/* Level */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-purple-400" />
                      <p className="font-semibold text-white">Lvl {user.level}</p>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="col-span-2">
                    <p className="font-bold text-teal-400 text-lg">{user.xp.toLocaleString()}</p>
                  </div>

                  {/* Courses */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-emerald-400" />
                      <p className="text-white font-medium">{user.coursesCompleted}</p>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="col-span-1 text-right">
                    {user.badge ? (
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/30 rounded-full text-xs font-semibold text-teal-300">
                        {user.badge}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs">-</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No users found matching "{searchQuery}"</p>
          </div>
        )}

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Flame size={20} className="text-orange-400" />
              <p className="text-slate-400 text-sm font-medium">Hottest User</p>
            </div>
            <p className="text-xl font-bold text-white">{filteredData[0]?.username}</p>
            <p className="text-slate-400 text-xs mt-2">Leading the leaderboard</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp size={20} className="text-teal-400" />
              <p className="text-slate-400 text-sm font-medium">Average XP</p>
            </div>
            <p className="text-xl font-bold text-white">
              {Math.round(filteredData.reduce((acc, u) => acc + u.xp, 0) / filteredData.length).toLocaleString()}
            </p>
            <p className="text-slate-400 text-xs mt-2">Across all users</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Trophy size={20} className="text-yellow-400" />
              <p className="text-slate-400 text-sm font-medium">Total Users</p>
            </div>
            <p className="text-xl font-bold text-white">{filteredData.length}</p>
            <p className="text-slate-400 text-xs mt-2">Active learners</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;