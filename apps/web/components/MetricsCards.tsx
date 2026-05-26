import React from 'react';
import { BookOpen, CheckCircle, Zap, Award } from 'lucide-react';

interface MetricCard {
  title: string;
  value: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  color: string;
  progress: number;
  subtext: string;
}

const MetricsCards: React.FC = () => {
  const metrics: MetricCard[] = [
    {
      title: 'Modules Completed',
      value: '12 / 18',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-500',
      progress: 66,
      subtext: '66%',
    },
    {
      title: 'Assignments Done',
      value: '8 / 12',
      icon: CheckCircle,
      color: 'from-blue-500 to-cyan-500',
      progress: 66,
      subtext: '66%',
    },
    {
      title: 'XP Earned',
      value: '2,450',
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      progress: 0,
      subtext: '2450 points',
    },
    {
      title: 'Certificates Earned',
      value: '3',
      icon: Award,
      color: 'from-purple-500 to-pink-500',
      progress: 0,
      subtext: '3 awards',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <MetricCardItem key={metric.title} metric={metric} />
      ))}
    </div>
  );
};

interface MetricCardItemProps {
  metric: MetricCard;
}

const MetricCardItem: React.FC<MetricCardItemProps> = ({ metric }) => {
  const { title, value, icon: Icon, color, progress, subtext } = metric;

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`bg-gradient-to-br ${color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>

      {progress > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`bg-gradient-to-r ${color} h-2 rounded-full`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-300 ml-2 min-w-fit">
              {progress}%
            </span>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 mt-3">{subtext}</p>
    </div>
  );
};

export default MetricsCards;