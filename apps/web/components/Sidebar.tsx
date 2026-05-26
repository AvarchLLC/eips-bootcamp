import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Target,
  Zap,
  FileText,
  Users,
  Trophy,
  Bell,
  Clock,
  LogOut
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: BookOpen, label: 'My Learning' },
    { icon: CheckSquare, label: 'Bootcamp Modules' },
    { icon: Target, label: 'Milestones' },
    { icon: Zap, label: 'Quizzes' },
    { icon: FileText, label: 'Capstone Project' },
  ];

  const communityItems = [
    { icon: Users, label: 'Discussions' },
    { icon: Clock, label: 'Office Hours (Zoom)' },
    { icon: Users, label: 'Community' },
  ];

  const adminItems = [
    { icon: Trophy, label: 'Certifications' },
    { icon: Bell, label: 'Announcements' },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-700 flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center font-bold text-base text-white shadow-lg shadow-teal-500/30">
            E
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-white">EIPInsight</span>
            <span className="text-xs text-slate-400 font-medium">Bootcamp</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6">
        {/* Main Menu */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3">
            Main
          </p>
          {menuItems.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </div>

        {/* Community */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3">
            Community
          </p>
          {communityItems.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </div>

        {/* Admin */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-3 mb-3">
            Admin/Cert
          </p>
          {adminItems.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </div>
      </nav>

      {/* Join Office Hours */}
      <div className="p-4 border-t border-slate-700/50 space-y-3">
        <div className="bg-gradient-to-b from-teal-900/40 to-emerald-900/40 border border-teal-700/50 rounded-xl p-5 text-center shadow-lg shadow-teal-500/10">
          <p className="text-xs text-slate-300 mb-2 font-semibold">Join Office Hours on</p>
          <p className="text-lg font-bold text-teal-400 mb-2">Zoom</p>
          <p className="text-xs text-slate-300 mb-4">Live Q&A with mentors and experts</p>
          <button className="w-full px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 rounded-lg text-xs font-semibold transition-all shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50">
            View Schedule →
          </button>
        </div>
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-slate-400 hover:text-slate-200 transition-colors">
          <LogOut size={16} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ComponentType<{ size: number }>;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active = false }) => {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
        active
          ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/20 font-semibold'
          : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
      }`}
    >
      <Icon size={20} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default Sidebar;