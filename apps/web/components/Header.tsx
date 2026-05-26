import React from 'react';
import { Search, Bell, Heart, Settings } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="border-b border-slate-700 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="p-6 flex items-center justify-between">
        {/* Left side - Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, Subhrajeet! 👋</h1>
          <p className="text-sm text-slate-400 mt-1">
            Continue your journey to understand, communicate, and build the future of Ethereum
          </p>
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800 rounded-lg px-4 py-2">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search EPs, modules, topics, resources..."
              className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-48"
            />
          </div>

          {/* Icons */}
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors relative">
            <Search size={20} className="text-slate-400" />
          </button>
          
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors relative">
            <Bell size={20} className="text-slate-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full"></span>
          </button>

          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors relative">
            <Heart size={20} className="text-slate-400" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              12
            </span>
          </button>

          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <Settings size={20} className="text-slate-400" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
            <div className="text-right">
              <p className="text-sm font-medium text-white">Subhrajeet</p>
              <p className="text-xs text-slate-400">Author Track</p>
            </div>
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Subhrajeet"
              alt="User avatar"
              className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;