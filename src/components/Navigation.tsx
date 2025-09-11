import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, MessageCircle, Activity, BarChart3, Settings, Target } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'chat', icon: MessageCircle, label: 'AI Coach' },
    { id: 'planner', icon: Target, label: 'Planner' },
    { id: 'workout', icon: Activity, label: 'Workout' },
    { id: 'progress', icon: BarChart3, label: 'Progress' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cyber-dark border-t border-neon-purple/30 p-4">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "neon" : "ghost_cyber"}
              size="sm"
              className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                isActive ? 'ai-glow' : ''
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-cyber-dark' : 'text-neon-purple'}`} />
              <span className={`text-xs ${
                isActive ? 'text-cyber-dark font-semibold' : 'text-muted-foreground'
              }`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;