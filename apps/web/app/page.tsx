'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MetricsCards from '@/components/MetricsCards';
import ContinueLearning from '@/components/ContinueLearning';
import LiveSession from '@/components/LiveSession';
import LifecycleOverview from '@/components/LifecycleOverview';
import YourProgress from '@/components/YourProgress';
import RecentActivity from '@/components/RecentActivity';
import ContributeSection from '@/components/ContributeSection';

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Header />
        
        <div className="p-6 space-y-6 max-w-7xl mx-auto pb-10">
          {/* Metrics Cards */}
          <MetricsCards />

          {/* Continue Learning & Live Session */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ContinueLearning />
            <LiveSession />
          </div>

          {/* Lifecycle Overview */}
          <LifecycleOverview />

          {/* Progress & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <YourProgress />
            <RecentActivity />
          </div>

          {/* Contribute Section */}
          <ContributeSection />
        </div>
      </main>
    </div>
  );
}