import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import AIChat from '@/components/AIChat';
import WorkoutTracking from '@/components/WorkoutTracking';
import ProgressAnalytics from '@/components/ProgressAnalytics';
import Goals from '@/components/Goals';
import Settings from '@/components/Settings';
import WorkoutPlanner from '@/components/WorkoutPlanner';
import Navigation from '@/components/Navigation';

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'chat':
        return <AIChat />;
      case 'workout':
        return <WorkoutTracking />;
      case 'progress':
        return <ProgressAnalytics />;
      case 'goals':
        return <Goals />;
      case 'settings':
        return <Settings />;
      case 'planner':
        return <WorkoutPlanner />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {renderCurrentView()}
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
};

export default Index;
