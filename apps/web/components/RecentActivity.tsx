import React from 'react';
import { BookOpen, CheckCircle, MessageSquare, Trophy } from 'lucide-react';

interface Activity {
  id: number;
  type: 'lesson' | 'quiz' | 'comment' | 'badge';
  title: string;
  time: string;
  icon: React.ComponentType<{ size: number }>;
  color: string;
}

const RecentActivity: React.FC = () => {
  const activities: Activity[] = [
    {
      id: 1,
      type: 'lesson',
      title: 'Completed Lesson: Smart Contracts 101',
      time: '2h ago',
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      id: 2,
      type: 'quiz',
      title: 'Your assignment was reviewed',
      time: '1h ago',
      icon: CheckCircle,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 3,
      type: 'comment',
      title: 'New comment on your draft',
      time: '1d ago',
      icon: MessageSquare,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 4,
      type: 'badge',
      title: 'You earned 150 XP',
      time: '1d ago',
      icon: Trophy,
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="lg:col-span-1 bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>

      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <ActivityItem key={activity.id} activity={activity} Icon={Icon} />
          );
        })}
      </div>

      <button className="w-full mt-6 px-4 py-2.5 text-center text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors">
        View all →
      </button>
    </div>
  );
};

interface ActivityItemProps {
  activity: Activity;
  Icon: React.ComponentType<{ size: number }>;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, Icon }) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/20 hover:bg-slate-700/40 transition-colors group">
      <div className={`bg-gradient-to-br ${activity.color} p-2 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
        <Icon size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{activity.title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
      </div>
    </div>
  );
};

export default RecentActivity;