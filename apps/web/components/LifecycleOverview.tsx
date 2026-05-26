import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight } from 'lucide-react';

const LifecycleOverview: React.FC = () => {
  const data = [
    { name: 'Draft', value: 156, fill: '#06b6d4' },
    { name: 'Review', value: 98, fill: '#10b981' },
    { name: 'Last Call', value: 72, fill: '#8b5cf6' },
    { name: 'Final', value: 45, fill: '#f59e0b' },
    { name: 'Stagnant', value: 34, fill: '#ef4444' },
    { name: 'Withdrawn', value: 27, fill: '#6b7280' },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">EIP Lifecycle Overview</h2>
          <p className="text-sm text-slate-400">Distribution of EIPs across different lifecycle stages</p>
        </div>
        <button className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors text-sm font-medium">
          View full analytics <ArrowRight size={16} />
        </button>
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: '256px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#fff',
              }}
              cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
            />
            <Bar dataKey="value" fill="#06b6d4" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-8 pt-6 border-t border-slate-700">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.fill }}
            ></div>
            <span className="text-xs text-slate-300">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LifecycleOverview;