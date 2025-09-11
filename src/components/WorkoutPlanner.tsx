import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Clock, Target, Shuffle, Save, Play, ChevronRight, Dumbbell, Activity } from 'lucide-react';

const WorkoutPlanner = () => {
  const [selectedGoal, setSelectedGoal] = useState('muscle-building');
  const [workoutTime, setWorkoutTime] = useState([45]);
  const [equipment, setEquipment] = useState('full-gym');
  const [difficulty, setDifficulty] = useState('intermediate');

  const workoutTemplates = [
    {
      id: 1,
      name: "Upper Body Power",
      duration: "45 min",
      exercises: 8,
      focus: "Strength",
      difficulty: "Advanced",
      equipment: "Full Gym",
      tags: ["Push", "Pull", "Compound"]
    },
    {
      id: 2,
      name: "Lower Body Blast",
      duration: "50 min",
      exercises: 7,
      focus: "Hypertrophy",
      difficulty: "Intermediate",
      equipment: "Full Gym",
      tags: ["Legs", "Glutes", "Power"]
    },
    {
      id: 3,
      name: "HIIT Cardio Burn",
      duration: "30 min",
      exercises: 6,
      focus: "Fat Loss",
      difficulty: "Beginner",
      equipment: "Bodyweight",
      tags: ["Cardio", "HIIT", "Fast"]
    }
  ];

  const aiGeneratedPlan = {
    name: "Custom Upper Body",
    estimatedTime: "42 min",
    calories: 320,
    difficulty: "Intermediate",
    exercises: [
      {
        name: "Barbell Bench Press",
        sets: 4,
        reps: "8-10",
        weight: "185 lbs",
        restTime: "2-3 min",
        muscleGroups: ["Chest", "Triceps", "Shoulders"],
        tips: "Focus on controlled eccentric movement",
        videoAvailable: true
      },
      {
        name: "Pull-ups",
        sets: 3,
        reps: "8-12",
        weight: "Bodyweight",
        restTime: "90 sec",
        muscleGroups: ["Back", "Biceps"],
        tips: "Full range of motion, squeeze at top",
        videoAvailable: true
      },
      {
        name: "Incline Dumbbell Press",
        sets: 3,
        reps: "10-12",
        weight: "70 lbs",
        restTime: "90 sec",
        muscleGroups: ["Upper Chest", "Shoulders"],
        tips: "45-degree angle, control the weight",
        videoAvailable: true
      },
      {
        name: "Barbell Rows",
        sets: 4,
        reps: "8-10",
        weight: "155 lbs",
        restTime: "2 min",
        muscleGroups: ["Back", "Rear Delts"],
        tips: "Drive elbows back, squeeze shoulder blades",
        videoAvailable: true
      },
      {
        name: "Overhead Press",
        sets: 3,
        reps: "6-8",
        weight: "115 lbs",
        restTime: "2-3 min",
        muscleGroups: ["Shoulders", "Triceps", "Core"],
        tips: "Tight core, straight bar path",
        videoAvailable: true
      }
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-neon-green text-cyber-dark';
      case 'intermediate': return 'bg-neon-blue text-cyber-dark';
      case 'advanced': return 'bg-neon-purple text-cyber-dark';
      default: return 'bg-cyber-light text-muted-foreground';
    }
  };

  const getFocusColor = (focus: string) => {
    switch (focus.toLowerCase()) {
      case 'strength': return 'text-neon-purple';
      case 'hypertrophy': return 'text-neon-blue';
      case 'fat loss': return 'text-neon-pink';
      default: return 'text-neon-green';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-darker to-background p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neon-purple">Workout Planner</h1>
          <p className="text-sm text-neon-blue">AI-powered workout generation</p>
        </div>
        <Button variant="ai">
          <Zap className="mr-2 h-4 w-4" />
          AI Generate
        </Button>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-cyber-light border border-neon-purple/30">
          <TabsTrigger value="generator" className="data-[state=active]:bg-neon-purple data-[state=active]:text-cyber-dark">
            AI Generator
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-neon-purple data-[state=active]:text-cyber-dark">
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          {/* Workout Parameters */}
          <Card className="cyber-card p-6">
            <h3 className="text-lg font-bold text-neon-purple mb-4">Workout Parameters</h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-white block mb-2">Primary Goal</label>
                <Select value={selectedGoal} onValueChange={setSelectedGoal}>
                  <SelectTrigger className="bg-cyber-light border-neon-blue/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cyber-light border-neon-blue/30">
                    <SelectItem value="muscle-building">Build Muscle</SelectItem>
                    <SelectItem value="strength">Increase Strength</SelectItem>
                    <SelectItem value="fat-loss">Lose Fat</SelectItem>
                    <SelectItem value="endurance">Build Endurance</SelectItem>
                    <SelectItem value="general">General Fitness</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-white block mb-2">
                  Workout Duration: {workoutTime[0]} minutes
                </label>
                <Slider
                  value={workoutTime}
                  onValueChange={setWorkoutTime}
                  max={90}
                  min={15}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>15 min</span>
                  <span>90 min</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-white block mb-2">Available Equipment</label>
                <Select value={equipment} onValueChange={setEquipment}>
                  <SelectTrigger className="bg-cyber-light border-neon-blue/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cyber-light border-neon-blue/30">
                    <SelectItem value="bodyweight">Bodyweight Only</SelectItem>
                    <SelectItem value="dumbbells">Dumbbells</SelectItem>
                    <SelectItem value="home-gym">Home Gym</SelectItem>
                    <SelectItem value="full-gym">Full Gym</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-white block mb-2">Difficulty Level</label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="bg-cyber-light border-neon-blue/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cyber-light border-neon-blue/30">
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="neon" className="w-full" size="lg">
                <Zap className="mr-2 h-5 w-5" />
                Generate AI Workout
              </Button>
            </div>
          </Card>

          {/* Generated Workout Preview */}
          <Card className="cyber-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-neon-purple">Generated Workout</h3>
              <div className="flex space-x-2">
                <Badge className="bg-neon-blue text-cyber-dark">{aiGeneratedPlan.difficulty}</Badge>
                <Badge className="bg-neon-green text-cyber-dark">{aiGeneratedPlan.estimatedTime}</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-cyber-light rounded-lg">
                <div>
                  <h4 className="font-semibold text-white">{aiGeneratedPlan.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {aiGeneratedPlan.exercises.length} exercises • {aiGeneratedPlan.calories} calories
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="cyber" size="sm">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button variant="workout" size="sm">
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </Button>
                </div>
              </div>

              {/* Exercise List */}
              <div className="space-y-3">
                {aiGeneratedPlan.exercises.map((exercise, idx) => (
                  <div key={idx} className="p-4 bg-cyber-light rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-white">{exercise.name}</h5>
                      <div className="flex items-center space-x-2">
                        {exercise.videoAvailable && (
                          <Badge className="bg-neon-purple text-cyber-dark text-xs">Video</Badge>
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Sets</p>
                        <p className="font-semibold text-neon-blue">{exercise.sets}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Reps</p>
                        <p className="font-semibold text-neon-green">{exercise.reps}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Rest</p>
                        <p className="font-semibold text-neon-purple">{exercise.restTime}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {exercise.muscleGroups.map((muscle, i) => (
                        <Badge key={i} className="bg-neon-pink/20 text-neon-pink text-xs">
                          {muscle}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-xs text-neon-blue">{exercise.tips}</p>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3">
                <Button variant="ghost_cyber" className="flex-1">
                  <Shuffle className="mr-2 h-4 w-4" />
                  Modify
                </Button>
                <Button variant="cyber" className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Save Plan
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          {workoutTemplates.map((template) => (
            <Card key={template.id} className="cyber-card p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-white">{template.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {template.exercises} exercises • {template.duration}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Badge className={getDifficultyColor(template.difficulty)}>
                    {template.difficulty}
                  </Badge>
                  <Button variant="neon" size="sm">
                    <Play className="mr-2 h-4 w-4" />
                    Use
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4 text-neon-purple" />
                    <span className={`text-sm font-medium ${getFocusColor(template.focus)}`}>
                      {template.focus}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Dumbbell className="h-4 w-4 text-neon-blue" />
                    <span className="text-sm text-muted-foreground">{template.equipment}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag, idx) => (
                  <Badge key={idx} className="bg-cyber-light text-neon-green border border-neon-green/30">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkoutPlanner;