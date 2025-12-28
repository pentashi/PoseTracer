import React from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const SettingsDemo: React.FC = () => {
  const { isDemo } = useAuth();

  if (isDemo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 bg-cyber-dark border border-neon-purple text-center">
          <h2 className="text-xl font-bold text-neon-purple mb-2">Settings Unavailable</h2>
          <p className="text-white">
            Settings are not available in demo mode. Use a real account to access this section.
          </p>
        </Card>
      </div>
    );
  }

  // Here you can still load your normal Settings component for real users
  return null; // or <RealSettings /> if you have it imported
};

export default SettingsDemo;
