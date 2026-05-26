import React from 'react';
import { Clock, Users, Video } from 'lucide-react';

const LiveSession: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-xl p-6 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-slate-400 text-xs uppercase font-semibold tracking-wider mb-2">
            Upcoming Live Session (for Zoom)
          </p>
          <h3 className="text-2xl font-bold text-white">
            24
          </h3>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
          <Video size={20} className="text-white" />
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Clock size={16} className="text-teal-400" />
          <span>May 24, 2024</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Clock size={16} className="text-teal-400" />
          <span>7:00 PM UTC</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Users size={16} className="text-teal-400" />
          <span>120 attending</span>
        </div>
      </div>

      <div className="flex gap-2 mt-auto pt-4 border-t border-slate-700">
        <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2">
          <Video size={16} />
          Go Zoom
        </button>
        <button className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium text-white transition-colors">
          Details
        </button>
      </div>

      <button className="w-full mt-3 flex items-center justify-center gap-2 text-teal-400 hover:text-teal-300 transition-colors py-2 text-sm font-medium">
        View Zoom Link in Schedule →
      </button>

      {/* Info box */}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-xs text-blue-300">
          ✓ All sessions are hosted on Zoom. Links are provided in the schedule.
        </p>
      </div>
    </div>
  );
};

export default LiveSession;