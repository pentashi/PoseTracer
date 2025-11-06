import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, MessageCircle, Activity, BarChart3, Settings, Target } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard' },
    { id: 'chat', icon: MessageCircle, label: 'AI Coach', path: '/ai-coach' },
    { id: 'planner', icon: Target, label: 'Planner', path: '/planner' },
    { id: 'workout', icon: Activity, label: 'Workout', path: '/workout' },
    { id: 'progress', icon: BarChart3, label: 'Progress', path: '/progress' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cyber-dark border-t border-neon-purple/30 p-4">
<div className="flex items-center justify-around w-full">
  {navItems.map((item) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;

    return (
      <Button
        key={item.id}
        variant={isActive ? "neon" : "ghost_cyber"}
        size="sm"
        className={`flex flex-col items-center space-y-1 h-auto py-2 px-2 ${
          isActive ? 'ai-glow' : ''
        }`}
        onClick={() => navigate(item.path)}
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
