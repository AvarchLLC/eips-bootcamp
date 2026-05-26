import React from 'react';
import { Play, ArrowRight } from 'lucide-react';

const ContinueLearning: React.FC = () => {
  return (
    <div className="lg:col-span-2 relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 group">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative p-8 flex items-center justify-between">
        {/* Content */}
        <div className="flex-1">
          <p className="text-slate-400 text-xs uppercase font-semibold tracking-wider mb-3">
            Continue Learning
          </p>
          <h2 className="text-2xl font-bold text-white mb-3">
            Module 4: Writing & Improving EIPs
          </h2>
          <p className="text-slate-300 text-sm mb-6 max-w-lg">
            Learn how to write clear EIP specifications and add comments to improve proposals for the Ethereum network.
          </p>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 rounded-lg font-medium text-white transition-all group/btn">
              <Play size={18} fill="currentColor" />
              Continue Module
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 text-teal-400 hover:text-teal-300 transition-colors">
              View Module <ArrowRight size={16} />
            </button>
          </div>

          {/* Progress */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-400 mb-2">755 Completed</p>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="hidden lg:block absolute right-0 bottom-0 w-64 h-64 opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full fill-teal-500">
            <path d="M100,20 L170,60 L150,140 L50,140 L30,60 Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ContinueLearning;