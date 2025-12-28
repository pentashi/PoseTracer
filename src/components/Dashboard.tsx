import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, MessageCircle } from "lucide-react";
import heroFitness from "@/assets/hero-fitness.jpg";
import Navigation from "./Navigation";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserSettings } from "@/services/userService";
import { auth } from "@/firebaseConfig";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, isDemo } = useAuth();

  // Read Firestore userSettings if not demo
  const { data: userSettings, isLoading } = useQuery({
    queryKey: ["userSettings"],
    queryFn: getUserSettings,
    enabled: !!auth.currentUser && !isDemo,
  });

  // Demo profile from localStorage
  const demoProfile = isDemo ? JSON.parse(localStorage.getItem("demoProfile") || "{}") : {};

  const userName = isDemo ? demoProfile.name || "Demo User" : userSettings?.name ?? "User";

  const recentMessages = [
    {
      type: "ai",
      message: "Great form on those squats! Try to go 2 inches deeper on your next set.",
      time: "2 min ago",
    },
    { type: "user", message: "Should I increase weight on bench press?", time: "5 min ago" },
    {
      type: "ai",
      message: "Based on your last 3 sessions, you're ready for +10lbs. Your strength curve shows optimal progression.",
      time: "5 min ago",
    },
  ];

  if (isLoading) {
    return <p className="text-white text-center mt-12">Loading your profile...</p>;
  }

  return (
    <div className="bg-gradient-to-b from-cyber-darker to-background p-4">
      {/* Hero Section */}
      <div className="relative mb-8 rounded-xl overflow-hidden">
        <img src={heroFitness} alt="AI Fitness Dashboard" className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-dark/80 to-transparent flex items-center">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, <span className="text-neon-purple">{userName}</span>
            </h1>
            <p className="text-neon-blue">Your AI coach is ready to optimize your workout</p>
            {isDemo && demoProfile.goal && (
              <p className="text-neon-green mt-1 text-sm">
                Goal: <strong>{demoProfile.goal}</strong>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-right text-xs text-gray-400 mb-1">
        <span>Last updated: {new Date().toLocaleString()}</span>
      </div>

      {/* Daily Motivation */}
      <div className="text-sm text-neon-blue mb-6">
        “Small progress every day leads to big results.”
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button
          variant="neon"
          size="lg"
          className="h-16"
          onClick={() => navigate("/workout")}
        >
          <Play className="mr-2 h-5 w-5" />
          Start Workout
        </Button>
        <Button
          variant="ai"
          size="lg"
          className="h-16"
          onClick={() => navigate("/ai-coach")}
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          AI Coach
        </Button>
      </div>

      {/* AI Chat Preview */}
      <Card className="cyber-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neon-purple">AI Coach Messages</h2>
          <MessageCircle className="h-5 w-5 text-neon-blue ai-glow" />
        </div>

        <div className="space-y-3">
          {recentMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg ${
                msg.type === "ai"
                  ? "bg-neon-blue/10 border-l-4 border-neon-blue"
                  : "bg-neon-purple/10 border-l-4 border-neon-purple"
              }`}
            >
              <p className="text-sm text-white">{msg.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
            </div>
          ))}
        </div>

        <Button
          variant="cyber"
          className="w-full mt-4"
          onClick={() => navigate("/ai-coach")}
        >
          Open Full Chat
        </Button>
      </Card>

      {/* Navigation */}
      <Navigation currentView="dashboard" onViewChange={(view) => console.log("Navigate to", view)} />
    </div>
  );
};

export default Dashboard;
