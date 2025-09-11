import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Target, Award, Calendar, Camera, BarChart3, Zap, Activity } from 'lucide-react';

const ProgressAnalytics = () => {
  const strengthData = {
    benchPress: { current: 185, target: 225, progress: 82 },
    squat: { current: 245, target: 315, progress: 78 },
    deadlift: { current: 275, target: 350, progress: 79 },
    overheadPress: { current: 115, target: 145, progress: 79 }
  };

  const physiqueAnalysis = {
    muscleMass: { current: 168, baseline: 155, target: 175, unit: 'lbs' },
    bodyFat: { current: 12.3, baseline: 18.5, target: 10, unit: '%' },
    symmetryScore: 87,
    improvements: [
      { area: 'Chest Development', progress: 23, status: 'excellent' },
      { area: 'Shoulder Width', progress: 18, status: 'good' },
      { area: 'Leg Mass', progress: 15, status: 'improving' },
      { area: 'Core Definition', progress: 31, status: 'excellent' }
    ]
  };

  const workoutStats = {
    totalSessions: 127,
    weeklyAverage: 4.2,
    longestStreak: 23,
    currentStreak: 12,
    avgDuration: 42,
    totalVolume: 125750 // lbs
  };

  const predictions = {
    threeMonth: {
      benchPress: 215,
      squat: 295,
      deadlift: 325,
      bodyWeight: 172,
      bodyFat: 10.8
    },
    confidence: 89
  };

  const recentWorkouts = [
    { date: 'Today', type: 'Upper Body', duration: 45, volume: 8750, rating: 5 },
    { date: 'Yesterday', type: 'Lower Body', duration: 52, volume: 12400, rating: 4 },
    { date: '2 days ago', type: 'Push', duration: 38, volume: 7200, rating: 5 },
    { date: '3 days ago', type: 'Pull', duration: 41, volume: 8900, rating: 4 },
    { date: '4 days ago', type: 'Legs', duration: 48, volume: 11200, rating: 5 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-darker to-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neon-purple">Progress Analytics</h1>
          <p className="text-sm text-neon-blue">AI-powered performance insights</p>
        </div>
        <Button variant="ai">
          <Camera className="mr-2 h-4 w-4" />
          Upload Photo
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="cyber-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Muscle Mass</p>
              <p className="text-2xl font-bold text-neon-green">{physiqueAnalysis.muscleMass.current}</p>
              <p className="text-xs text-neon-green">+{physiqueAnalysis.muscleMass.current - physiqueAnalysis.muscleMass.baseline}lbs gained</p>
            </div>
            <TrendingUp className="h-8 w-8 text-neon-green" />
          </div>
        </Card>

        <Card className="cyber-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Body Fat</p>
              <p className="text-2xl font-bold text-neon-blue">{physiqueAnalysis.bodyFat.current}%</p>
              <p className="text-xs text-neon-blue">-{(physiqueAnalysis.bodyFat.baseline - physiqueAnalysis.bodyFat.current).toFixed(1)}% lost</p>
            </div>
            <Target className="h-8 w-8 text-neon-blue" />
          </div>
        </Card>

        <Card className="cyber-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Symmetry Score</p>
              <p className="text-2xl font-bold text-neon-purple">{physiqueAnalysis.symmetryScore}</p>
              <p className="text-xs text-neon-purple">AI Analysis</p>
            </div>
            <Award className="h-8 w-8 text-neon-purple" />
          </div>
        </Card>

        <Card className="cyber-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-2xl font-bold text-neon-pink">{workoutStats.currentStreak}</p>
              <p className="text-xs text-neon-pink">days active</p>
            </div>
            <Calendar className="h-8 w-8 text-neon-pink" />
          </div>
        </Card>
      </div>

      {/* Tabs for Different Views */}
      <Tabs defaultValue="strength" className="mb-6">
        <TabsList className="grid w-full grid-cols-3 bg-cyber-light border border-neon-purple/30">
          <TabsTrigger value="strength" className="data-[state=active]:bg-neon-purple data-[state=active]:text-cyber-dark">
            Strength
          </TabsTrigger>
          <TabsTrigger value="physique" className="data-[state=active]:bg-neon-purple data-[state=active]:text-cyber-dark">
            Physique
          </TabsTrigger>
          <TabsTrigger value="predictions" className="data-[state=active]:bg-neon-purple data-[state=active]:text-cyber-dark">
            AI Predictions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="strength" className="space-y-4">
          <Card className="cyber-card p-6">
            <h3 className="text-lg font-bold text-neon-purple mb-4">Strength Progression</h3>
            
            {Object.entries(strengthData).map(([exercise, data]) => (
              <div key={exercise} className="mb-6 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white capitalize">
                    {exercise.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-neon-green">{data.current}lbs</span>
                    <span className="text-sm text-muted-foreground ml-2">/ {data.target}lbs</span>
                  </div>
                </div>
                <Progress value={data.progress} className="progress-glow" />
                <p className="text-xs text-muted-foreground mt-1">{data.progress}% to goal</p>
              </div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="physique" className="space-y-4">
          <Card className="cyber-card p-6">
            <h3 className="text-lg font-bold text-neon-purple mb-4">Physique Development</h3>
            
            <div className="space-y-4">
              {physiqueAnalysis.improvements.map((improvement, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-cyber-light rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-white">{improvement.area}</p>
                    <p className="text-sm text-muted-foreground">+{improvement.progress}% improvement</p>
                  </div>
                  <Badge className={`${
                    improvement.status === 'excellent' ? 'bg-neon-green text-cyber-dark' :
                    improvement.status === 'good' ? 'bg-neon-blue text-cyber-dark' :
                    'bg-neon-purple text-cyber-dark'
                  }`}>
                    {improvement.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="cyber-card p-6">
            <h3 className="text-lg font-bold text-neon-purple mb-4">Photo Progress</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="aspect-square bg-cyber-light rounded-lg flex items-center justify-center border-2 border-dashed border-neon-blue/30">
                <div className="text-center">
                  <Camera className="h-6 w-6 text-neon-blue mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Baseline</p>
                  <p className="text-xs text-neon-blue">3 months ago</p>
                </div>
              </div>
              <div className="aspect-square bg-cyber-light rounded-lg flex items-center justify-center border-2 border-dashed border-neon-green/30">
                <div className="text-center">
                  <Camera className="h-6 w-6 text-neon-green mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <p className="text-xs text-neon-green">1 month ago</p>
                </div>
              </div>
              <div className="aspect-square bg-cyber-light rounded-lg flex items-center justify-center border-2 border-dashed border-neon-purple/30">
                <div className="text-center">
                  <Camera className="h-6 w-6 text-neon-purple mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Current</p>
                  <p className="text-xs text-neon-purple">Upload new</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card className="cyber-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neon-purple">3-Month Predictions</h3>
              <Badge className="bg-neon-green text-cyber-dark">
                {predictions.confidence}% confidence
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-cyber-light rounded-lg">
                  <p className="text-sm text-muted-foreground">Bench Press</p>
                  <p className="text-xl font-bold text-neon-green">{predictions.threeMonth.benchPress}lbs</p>
                  <p className="text-xs text-neon-green">+{predictions.threeMonth.benchPress - strengthData.benchPress.current}lbs</p>
                </div>
                <div className="p-3 bg-cyber-light rounded-lg">
                  <p className="text-sm text-muted-foreground">Squat</p>
                  <p className="text-xl font-bold text-neon-blue">{predictions.threeMonth.squat}lbs</p>
                  <p className="text-xs text-neon-blue">+{predictions.threeMonth.squat - strengthData.squat.current}lbs</p>
                </div>
                <div className="p-3 bg-cyber-light rounded-lg">
                  <p className="text-sm text-muted-foreground">Deadlift</p>
                  <p className="text-xl font-bold text-neon-purple">{predictions.threeMonth.deadlift}lbs</p>
                  <p className="text-xs text-neon-purple">+{predictions.threeMonth.deadlift - strengthData.deadlift.current}lbs</p>
                </div>
                <div className="p-3 bg-cyber-light rounded-lg">
                  <p className="text-sm text-muted-foreground">Body Fat</p>
                  <p className="text-xl font-bold text-neon-pink">{predictions.threeMonth.bodyFat}%</p>
                  <p className="text-xs text-neon-pink">-{(physiqueAnalysis.bodyFat.current - predictions.threeMonth.bodyFat).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Workouts */}
      <Card className="cyber-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-neon-purple">Recent Workouts</h3>
          <Button variant="ghost_cyber" size="sm">
            <BarChart3 className="mr-2 h-4 w-4" />
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentWorkouts.map((workout, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-cyber-light rounded-lg">
              <div className="flex items-center space-x-3">
                <Activity className="h-5 w-5 text-neon-blue" />
                <div>
                  <p className="font-medium text-white">{workout.type}</p>
                  <p className="text-sm text-muted-foreground">{workout.date}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">{workout.duration}m</p>
                    <p className="text-xs text-muted-foreground">Duration</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-neon-green">{workout.volume.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Volume (lbs)</p>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Zap 
                        key={i} 
                        className={`h-3 w-3 ${
                          i < workout.rating ? 'text-neon-green' : 'text-cyber-light'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProgressAnalytics;