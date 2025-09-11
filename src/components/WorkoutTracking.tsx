import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipForward, RotateCcw, Camera, Mic, Timer, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

const WorkoutTracking = () => {
  const [isActive, setIsActive] = useState(true);
  const [currentExercise, setCurrentExercise] = useState(2);
  const [timer, setTimer] = useState(185); // 3:05 elapsed
  const [restTimer, setRestTimer] = useState(0);

  const workoutSession = {
    name: "Upper Body Power",
    totalExercises: 8,
    estimatedTime: "45 min",
    difficulty: "Advanced"
  };

  const exercises = [
    { name: "Barbell Bench Press", sets: [{ reps: 8, weight: 185, completed: true }, { reps: 8, weight: 185, completed: true }, { reps: 6, weight: 195, completed: true }] },
    { name: "Incline Dumbbell Press", sets: [{ reps: 10, weight: 70, completed: true }, { reps: 9, weight: 70, completed: true }, { reps: 8, weight: 75, completed: false }] },
    { name: "Pull-ups", sets: [{ reps: 12, weight: 0, completed: false }, { reps: 10, weight: 0, completed: false }, { reps: 8, weight: 25, completed: false }], current: true },
    { name: "Barbell Rows", sets: [{ reps: 8, weight: 155, completed: false }, { reps: 8, weight: 155, completed: false }, { reps: 8, weight: 165, completed: false }] },
    { name: "Overhead Press", sets: [{ reps: 6, weight: 115, completed: false }, { reps: 6, weight: 115, completed: false }, { reps: 5, weight: 125, completed: false }] }
  ];

  const aiAnalysis = {
    formScore: 87,
    improvements: [
      { type: "warning", message: "Keep your core tighter during the lift", timestamp: "2 min ago" },
      { type: "success", message: "Perfect bar path on that rep!", timestamp: "30 sec ago" },
      { type: "info", message: "Consider increasing weight by 5lbs next set", timestamp: "1 min ago" }
    ],
    nextRecommendation: "Focus on controlled eccentric movement for maximum muscle activation"
  };

  const currentExerciseData = exercises[currentExercise];
  const completedSets = currentExerciseData.sets.filter(set => set.completed).length;
  const progress = ((currentExercise * 3 + completedSets) / (exercises.length * 3)) * 100;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-darker to-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neon-purple">{workoutSession.name}</h1>
          <p className="text-sm text-neon-blue">Exercise {currentExercise + 1} of {workoutSession.totalExercises}</p>
        </div>
        <Badge className="bg-neon-green text-cyber-dark font-semibold">
          {formatTime(timer)} elapsed
        </Badge>
      </div>

      {/* Overall Progress */}
      <Card className="cyber-card p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Workout Progress</span>
          <span className="text-sm text-neon-green">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="progress-glow" />
      </Card>

      {/* Current Exercise */}
      <Card className="cyber-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">{currentExerciseData.name}</h2>
          <div className="flex space-x-2">
            <Button variant="cyber" size="icon">
              <Camera className="h-4 w-4" />
            </Button>
            <Button variant="ai" size="icon">
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sets Display */}
        <div className="space-y-3 mb-6">
          {currentExerciseData.sets.map((set, idx) => (
            <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${
              set.completed ? 'bg-neon-green/20 border border-neon-green' : 
              idx === completedSets ? 'bg-neon-blue/20 border border-neon-blue neon-border' : 
              'bg-cyber-light border border-cyber-light'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  set.completed ? 'bg-neon-green text-cyber-dark' : 
                  idx === completedSets ? 'bg-neon-blue text-cyber-dark' : 
                  'bg-cyber-light text-muted-foreground'
                }`}>
                  {set.completed ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                </div>
                <div>
                  <p className="font-medium text-white">Set {idx + 1}</p>
                  <p className="text-sm text-muted-foreground">
                    {set.reps} reps {set.weight > 0 && `@ ${set.weight}lbs`}
                  </p>
                </div>
              </div>
              
              {idx === completedSets && !set.completed && (
                <Button variant="workout" size="sm">
                  Complete Set
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Rest Timer */}
        {restTimer > 0 && (
          <Card className="bg-neon-blue/20 border-neon-blue p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Timer className="h-5 w-5 text-neon-blue" />
                <span className="font-medium text-white">Rest Period</span>
              </div>
              <span className="text-2xl font-bold text-neon-blue">{formatTime(restTimer)}</span>
            </div>
          </Card>
        )}

        {/* Exercise Controls */}
        <div className="flex justify-center space-x-4">
          <Button variant="ghost_cyber">
            <RotateCcw className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button variant={isActive ? "cyber" : "neon"} onClick={() => setIsActive(!isActive)}>
            {isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isActive ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="ghost_cyber">
            Next
            <SkipForward className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>

      {/* AI Form Analysis */}
      <Card className="cyber-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-neon-purple">AI Form Analysis</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-neon-green rounded-full ai-glow"></div>
            <span className="text-sm text-neon-green">Live Tracking</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-white">Form Score</span>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-neon-green">{aiAnalysis.formScore}%</span>
            <Zap className="h-5 w-5 text-neon-green" />
          </div>
        </div>

        <Progress value={aiAnalysis.formScore} className="progress-glow mb-4" />

        <div className="space-y-3">
          {aiAnalysis.improvements.map((improvement, idx) => (
            <div key={idx} className={`flex items-start space-x-3 p-3 rounded-lg ${
              improvement.type === 'success' ? 'bg-neon-green/20 border-l-4 border-neon-green' :
              improvement.type === 'warning' ? 'bg-neon-pink/20 border-l-4 border-neon-pink' :
              'bg-neon-blue/20 border-l-4 border-neon-blue'
            }`}>
              {improvement.type === 'success' && <CheckCircle className="h-4 w-4 text-neon-green mt-0.5" />}
              {improvement.type === 'warning' && <AlertTriangle className="h-4 w-4 text-neon-pink mt-0.5" />}
              {improvement.type === 'info' && <Zap className="h-4 w-4 text-neon-blue mt-0.5" />}
              
              <div className="flex-1">
                <p className="text-sm text-white">{improvement.message}</p>
                <p className="text-xs text-muted-foreground">{improvement.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-neon-purple/20 rounded-lg">
          <p className="text-sm font-medium text-neon-purple">Next Recommendation:</p>
          <p className="text-sm text-white">{aiAnalysis.nextRecommendation}</p>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="cyber" className="h-12">
          <Camera className="mr-2 h-4 w-4" />
          Record Form
        </Button>
        <Button variant="ghost_cyber" className="h-12">
          <Mic className="mr-2 h-4 w-4" />
          Voice Notes
        </Button>
      </div>
    </div>
  );
};

export default WorkoutTracking;