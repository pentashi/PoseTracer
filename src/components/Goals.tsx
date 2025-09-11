import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Target, Trophy, Zap, Calendar, Plus, CheckCircle, Clock } from 'lucide-react';

const Goals = () => {
  const primaryGoals = [
    {
      id: 1,
      title: "Build Muscle Mass",
      description: "Gain 15lbs of lean muscle",
      progress: 68,
      target: "175 lbs",
      current: "168 lbs",
      deadline: "March 2024",
      status: "on-track",
      milestones: [
        { title: "Reach 165 lbs", completed: true, date: "Dec 2023" },
        { title: "Bench 200 lbs", completed: true, date: "Jan 2024" },
        { title: "Squat 275 lbs", completed: false, date: "Feb 2024" },
        { title: "Deadlift 315 lbs", completed: false, date: "Mar 2024" }
      ]
    },
    {
      id: 2,
      title: "Reduce Body Fat",
      description: "Cut to 10% body fat",
      progress: 76,
      target: "10%",
      current: "12.3%",
      deadline: "April 2024",
      status: "ahead",
      milestones: [
        { title: "15% body fat", completed: true, date: "Nov 2023" },
        { title: "12% body fat", completed: true, date: "Jan 2024" },
        { title: "10% body fat", completed: false, date: "Apr 2024" }
      ]
    }
  ];

  const miniChallenges = [
    {
      title: "7-Day Consistency",
      description: "Complete 7 workouts in a row",
      progress: 85,
      reward: "50 XP + Badge",
      deadline: "2 days left",
      type: "consistency"
    },
    {
      title: "Push-up Power",
      description: "Do 100 push-ups in one session",
      progress: 40,
      reward: "Strength Badge",
      deadline: "5 days left",
      type: "strength"
    },
    {
      title: "Cardio Crusher",
      description: "20 minutes cardio for 5 days",
      progress: 60,
      reward: "Endurance Badge",
      deadline: "3 days left",
      type: "endurance"
    }
  ];

  const achievements = [
    { title: "First Month", description: "Completed 30 days", icon: Calendar, earned: true },
    { title: "Strength Seeker", description: "Lifted 10,000 lbs total", icon: Trophy, earned: true },
    { title: "Consistency King", description: "14-day streak", icon: Zap, earned: true },
    { title: "Form Master", description: "Perfect form 10 sessions", icon: Target, earned: false }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-neon-blue';
      case 'ahead': return 'text-neon-green';
      case 'behind': return 'text-neon-pink';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-neon-blue text-cyber-dark';
      case 'ahead': return 'bg-neon-green text-cyber-dark';
      case 'behind': return 'bg-neon-pink text-cyber-dark';
      default: return 'bg-cyber-light text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-darker to-background p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neon-purple">Goals & Roadmap</h1>
          <p className="text-sm text-neon-blue">Track your fitness journey</p>
        </div>
        <Button variant="neon">
          <Plus className="mr-2 h-4 w-4" />
          New Goal
        </Button>
      </div>

      {/* Primary Goals */}
      <div className="space-y-6 mb-8">
        {primaryGoals.map((goal) => (
          <Card key={goal.id} className="cyber-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Target className="h-6 w-6 text-neon-purple" />
                <div>
                  <h3 className="text-lg font-bold text-white">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
              </div>
              <Badge className={getStatusBadge(goal.status)}>
                {goal.status.replace('-', ' ')}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">Progress</span>
                <div className="text-right">
                  <span className={`text-lg font-bold ${getStatusColor(goal.status)}`}>
                    {goal.current}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">/ {goal.target}</span>
                </div>
              </div>

              <Progress value={goal.progress} className="progress-glow" />

              <div className="flex items-center justify-between text-sm">
                <span className={getStatusColor(goal.status)}>{goal.progress}% complete</span>
                <span className="text-muted-foreground">Due: {goal.deadline}</span>
              </div>

              {/* Milestones */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-white">Milestones</p>
                {goal.milestones.map((milestone, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-2 rounded-lg ${
                    milestone.completed 
                      ? 'bg-neon-green/20 border border-neon-green' 
                      : 'bg-cyber-light border border-cyber-light'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {milestone.completed ? (
                        <CheckCircle className="h-4 w-4 text-neon-green" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={`text-sm ${
                        milestone.completed ? 'text-neon-green' : 'text-white'
                      }`}>
                        {milestone.title}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{milestone.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Mini Challenges */}
      <Card className="cyber-card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-neon-purple">Mini Challenges</h3>
          <Badge className="bg-neon-purple text-cyber-dark">3 Active</Badge>
        </div>

        <div className="space-y-4">
          {miniChallenges.map((challenge, idx) => (
            <div key={idx} className="p-4 bg-cyber-light rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">{challenge.title}</h4>
                <div className="flex items-center space-x-2">
                  <Zap className={`h-4 w-4 ${
                    challenge.type === 'strength' ? 'text-neon-green' :
                    challenge.type === 'endurance' ? 'text-neon-blue' :
                    'text-neon-purple'
                  }`} />
                  <span className="text-xs text-muted-foreground">{challenge.deadline}</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
              
              <div className="space-y-2">
                <Progress value={challenge.progress} className="progress-glow" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neon-green">{challenge.progress}% complete</span>
                  <span className="text-neon-blue">{challenge.reward}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements */}
      <Card className="cyber-card p-6">
        <h3 className="text-lg font-bold text-neon-purple mb-4">Achievements</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((achievement, idx) => (
            <div key={idx} className={`p-4 rounded-lg border-2 ${
              achievement.earned 
                ? 'bg-neon-green/20 border-neon-green' 
                : 'bg-cyber-light border-cyber-light border-dashed'
            }`}>
              <div className="text-center">
                <achievement.icon className={`h-8 w-8 mx-auto mb-2 ${
                  achievement.earned ? 'text-neon-green' : 'text-muted-foreground'
                }`} />
                <h4 className={`font-medium mb-1 ${
                  achievement.earned ? 'text-neon-green' : 'text-muted-foreground'
                }`}>
                  {achievement.title}
                </h4>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                {achievement.earned && (
                  <Badge className="bg-neon-green text-cyber-dark mt-2">Earned</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Goals;