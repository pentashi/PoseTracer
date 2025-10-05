import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, MessageCircle, Target, Trophy, Zap, Activity, Heart, Dumbbell } from 'lucide-react';
import heroFitness from '@/assets/hero-fitness.jpg';
import Navigation from './Navigation'; // make sure the path is correct

const Dashboard = () => {
  const workoutData = {
    todaysWorkout: {
      name: "Upper Body Power",
      exercises: 8,
      completed: 5,
      timeElapsed: "32 min",
      estimatedTime: "45 min"
    },
    goals: {
      primaryGoal: "Build Muscle Mass",
      progress: 68,
      milestone: "Bench Press 225lbs",
      nextMilestone: "Deadlift 315lbs"
    },
    stats: {
      workoutsThisWeek: 4,
      totalWorkouts: 127,
      avgDuration: "42 min",
      streak: 12
    }
  };

  const recentMessages = [
    { type: 'ai', message: "Great form on those squats! Try to go 2 inches deeper on your next set.", time: "2 min ago" },
    { type: 'user', message: "Should I increase weight on bench press?", time: "5 min ago" },
    { type: 'ai', message: "Based on your last 3 sessions, you're ready for +10lbs. Your strength curve shows optimal progression.", time: "5 min ago" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-darker to-background p-4">
      {/* Hero Section */}
      <div className="relative mb-8 rounded-xl overflow-hidden">
        <img 
          src={heroFitness} 
          alt="AI Fitness Dashboard"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-dark/80 to-transparent flex items-center">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, <span className="text-neon-purple">Alex</span>
            </h1>
            <p className="text-neon-blue">Your AI coach is ready to optimize your workout</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button variant="neon" size="lg" className="h-16">
          <Play className="mr-2 h-5 w-5" />
          Start Workout
        </Button>
        <Button variant="ai" size="lg" className="h-16">
          <MessageCircle className="mr-2 h-5 w-5" />
          AI Coach
        </Button>
      </div>

      {/* Today's Workout Card */}
      <Card className="cyber-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neon-purple">Today's Workout</h2>
          <Badge className="bg-neon-green text-cyber-dark">Active</Badge>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{workoutData.todaysWorkout.name}</h3>
            <p className="text-muted-foreground">
              {workoutData.todaysWorkout.completed}/{workoutData.todaysWorkout.exercises} exercises completed
            </p>
          </div>
          
          <Progress 
            value={(workoutData.todaysWorkout.completed / workoutData.todaysWorkout.exercises) * 100} 
            className="progress-glow"
          />
          
          <div className="flex justify-between text-sm">
            <span className="text-neon-blue">{workoutData.todaysWorkout.timeElapsed} elapsed</span>
            <span className="text-muted-foreground">{workoutData.todaysWorkout.estimatedTime} estimated</span>
          </div>
        </div>
      </Card>

      {/* Goals & Progress */}
      <Card className="cyber-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neon-purple">Goals & Progress</h2>
          <Target className="h-5 w-5 text-neon-green" />
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white">{workoutData.goals.primaryGoal}</span>
              <span className="text-neon-green font-bold">{workoutData.goals.progress}%</span>
            </div>
            <Progress value={workoutData.goals.progress} className="progress-glow" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-cyber-light rounded-lg neon-border">
              <Trophy className="h-6 w-6 text-neon-green mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Current</p>
              <p className="text-sm font-semibold text-white">{workoutData.goals.milestone}</p>
            </div>
            <div className="text-center p-3 bg-cyber-light rounded-lg border border-cyber-light">
              <Zap className="h-6 w-6 text-neon-purple mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Next Target</p>
              <p className="text-sm font-semibold text-white">{workoutData.goals.nextMilestone}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Chat Preview */}
      <Card className="cyber-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neon-purple">AI Coach Messages</h2>
          <MessageCircle className="h-5 w-5 text-neon-blue ai-glow" />
        </div>
        
        <div className="space-y-3">
          {recentMessages.map((msg, idx) => (
            <div key={idx} className={`p-3 rounded-lg ${
              msg.type === 'ai' 
                ? 'bg-neon-blue/10 border-l-4 border-neon-blue' 
                : 'bg-neon-purple/10 border-l-4 border-neon-purple'
            }`}>
              <p className="text-sm text-white">{msg.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
            </div>
          ))}
        </div>
        
        <Button variant="cyber" className="w-full mt-4">
          Open Full Chat
        </Button>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="cyber-card p-4">
          <div className="flex items-center space-x-3">
            <Target className="h-8 w-8 text-neon-green" />
            <div>
              <p className="text-2xl font-bold text-white">{workoutData.stats.workoutsThisWeek}</p>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
          </div>
        </Card>
        
        <Card className="cyber-card p-4">
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-neon-pink" />
            <div>
              <p className="text-2xl font-bold text-white">{workoutData.stats.streak}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </div>
        </Card>
        
        <Card className="cyber-card p-4">
          <div className="flex items-center space-x-3">
            <Dumbbell className="h-8 w-8 text-neon-blue" />
            <div>
              <p className="text-2xl font-bold text-white">{workoutData.stats.totalWorkouts}</p>
              <p className="text-xs text-muted-foreground">Total Workouts</p>
            </div>
          </div>
        </Card>
        
        <Card className="cyber-card p-4">
          <div className="flex items-center space-x-3">
            <Zap className="h-8 w-8 text-neon-purple" />
            <div>
              <p className="text-2xl font-bold text-white">{workoutData.stats.avgDuration}</p>
              <p className="text-xs text-muted-foreground">Avg Duration</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Goals Quick Access */}
      <div className="mt-6">
        <Button 
          variant="cyber" 
          className="w-full h-14"
          onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'goals' }))}
        >
          <Target className="mr-2 h-5 w-5" />
          View All Goals & Achievements
        </Button>
        
      </div>
<div className="min-h-screen bg-gradient-to-b from-cyber-darker to-background p-4 pb-24">
 <Navigation 
    currentView="dashboard" 
    onViewChange={(view) => console.log('Navigate to', view)} 
  />
</div>

      
    </div>
  );
};

export default Dashboard;