import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

const YourProgress: React.FC = () => {
  const progressPercentage = 60;

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Your Progress</h3>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-300">68%</span>
          <span className="text-xs text-slate-400">You're doing great!</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
          <CheckCircle size={20} className="text-emerald-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-white">Learn Basics</p>
            <p className="text-xs text-slate-400">5/5 lessons completed</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
          <CheckCircle size={20} className="text-emerald-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-white">Advanced Topics</p>
            <p className="text-xs text-slate-400">8/12 lessons completed</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
          <Circle size={20} className="text-slate-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-white">Final Project</p>
            <p className="text-xs text-slate-400">Not started</p>
          </div>
        </div>
      </div>

      <button className="w-full mt-6 px-4 py-2.5 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/50 rounded-lg text-teal-400 font-medium text-sm transition-colors">
        Continue Learning Path →
      </button>
    </div>
  );
};

export default YourProgress;