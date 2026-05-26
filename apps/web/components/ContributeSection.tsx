import React from 'react';
import { ArrowRight, Lightbulb, Code } from 'lucide-react';

interface ProjectCard {
  id: number;
  icon: React.ComponentType<{ size: number }>;
  title: string;
  description: string;
  color: string;
  difficulty: string;
  time: string;
}

const ContributeSection: React.FC = () => {
  const projects: ProjectCard[] = [
    {
      id: 1,
      icon: Lightbulb,
      title: 'Start Capstone Project',
      description: 'Build something amazing. Write your own EIP proposal.',
      color: 'from-emerald-500 to-teal-500',
      difficulty: 'Advanced',
      time: '40-50 hours',
    },
    {
      id: 2,
      icon: Code,
      title: 'Review EIPs to Contribute',
      description: 'Help review and improve community-submitted proposals.',
      color: 'from-blue-500 to-cyan-500',
      difficulty: 'Intermediate',
      time: '10-15 hours',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Ready to contribute?</h2>
        <p className="text-slate-400">Apply your knowledge. Write proposals. Participate in governance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCardItem key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

interface ProjectCardItemProps {
  project: ProjectCard;
}

const ProjectCardItem: React.FC<ProjectCardItemProps> = ({ project }) => {
  const Icon = project.icon;

  return (
    <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all overflow-hidden">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-teal-500 to-emerald-500 transition-opacity pointer-events-none"></div>

      <div className="relative">
        {/* Icon */}
        <div className={`bg-gradient-to-br ${project.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <Icon size={24} className="text-white" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
        <p className="text-sm text-slate-300 mb-4">{project.description}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="inline-block px-2.5 py-1 bg-slate-700 rounded text-xs font-medium text-slate-200">
              {project.difficulty}
            </span>
          </div>
          <div className="text-xs text-slate-400">
            {project.time}
          </div>
        </div>

        {/* CTA */}
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 rounded-lg font-medium text-white transition-all group-hover:shadow-lg group-hover:shadow-teal-500/20">
          Get Started
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ContributeSection;