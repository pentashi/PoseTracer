import React, { useState,useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, User, Target, AlertTriangle, Dumbbell, CheckCircle } from 'lucide-react';
import heroFitness from '@/assets/hero-fitness.jpg';
import { auth, db } from '@/firebaseConfig'; 
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react'; 
import { toast } from 'sonner';
import GeneratedWorkoutView from '../components/GeneratedWorkoutView';


const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    
    
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: '',
    fitnessLevel: '',
    goals: [] as string[],
    injuries: [] as string[],
    equipment: '',
    availability: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Add these state variables at the top
const [heightUnit, setHeightUnit] = useState<'ftin' | 'cm'>('ftin');
const [heightValue, setHeightValue] = useState({ ft: '', in: '', cm: '' });
const [generatedWorkout, setGeneratedWorkout] = useState<any>(null);
const [showDashboard, setShowDashboard] = useState(false);

// Function to normalize height to cm
const getHeightInCm = () => {
  if (heightUnit === 'cm') return Number(heightValue.cm);
  const ft = Number(heightValue.ft) || 0;
  const inch = Number(heightValue.in) || 0;
  return Math.round(ft * 30.48 + inch * 2.54);
};

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;
  const [animatedProgress, setAnimatedProgress] = useState(0);
 useEffect(() => {
  let interval: number; // number, not NodeJS.Timer

  if (loading) {
    interval = window.setInterval(() => {
      setAnimatedProgress(prev => (prev < 90 ? prev + 1 : prev));
    }, 50);
  } else {
    setAnimatedProgress(progress);
  }

  return () => clearInterval(interval);
}, [loading, progress]);

  const fitnessGoals = [
    'Build Muscle Mass',
    'Lose Weight',
    'Increase Strength',
    'Improve Endurance',
    'Better Health',
    'Athletic Performance'
  ];

  const commonInjuries = [
    'None',
    'Lower Back Issues',
    'Knee Problems',
    'Shoulder Impingement',
    'Wrist Pain',
    'Ankle Mobility',
    'Neck Tension'
  ];

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleInjuryToggle = (injury: string) => {
    setFormData(prev => ({
      ...prev,
      injuries: prev.injuries.includes(injury) 
        ? prev.injuries.filter(i => i !== injury)
        : [...prev.injuries, injury]
    }));
  };
const nextStep = async () => {
  // Step-wise validation
  if (currentStep === 1) {
    if (!formData.name.trim()) return toast.error('Please enter your name.');
    if (!formData.age.trim() || Number(formData.age) <= 0) return toast.error('Please enter a valid age.');
    if (!formData.gender) return toast.error('Please select your gender.');
    if (
      (heightUnit === 'ftin' && (!heightValue.ft || !heightValue.in)) ||
      (heightUnit === 'cm' && !heightValue.cm)
    ) return toast.error('Please enter your height.');
    if (!formData.weight || Number(formData.weight) <= 0) return toast.error('Please enter a valid weight.');
  }

  if (currentStep === 2) {
    if (formData.goals.length === 0) return toast.error('Please select at least one fitness goal.');
  }

  if (currentStep === 4) {
    if (!formData.equipment) return toast.error('Please select your available equipment.');
    if (!formData.fitnessLevel) return toast.error('Please select your fitness level.');
    if (!formData.availability) return toast.error('Please select your weekly availability.');
  }

  // Move to next step or submit
  if (currentStep < totalSteps) {
    setCurrentStep(currentStep + 1);
    return;
  }

  // Submit onboarding
  setLoading(true);
  const toastId = toast.loading('Generating your personalized workout plan... 🚀');

  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not logged in');

    const sanitizedProfile = {
      name: formData.name.trim(),
      age: parseInt(formData.age, 10),
      height: getHeightInCm(),
      weight: Number(formData.weight) * 0.453592,
      experienceLevel: formData.fitnessLevel,
      fitnessGoals: formData.goals,
      injuries: formData.injuries.includes('None') ? ['None'] : formData.injuries,
      equipment: formData.equipment,
      trainingDaysPerWeek: formData.availability,
    };

    // Save to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      ...sanitizedProfile,
      onboardingComplete: true,
    }, { merge: true });

    // Call AI endpoint
   const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/generate-workout`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ profile: sanitizedProfile }),
});


    const data = await res.json();
    //log backend response for debugging
    console.log("Generated workout from backend:", data);
    console.log("Workout Plan:", data.workoutPlan);

    if (!res.ok) throw new Error(data.error || 'Workout generation failed');

    // Save workout plan
    await setDoc(doc(db, 'users', user.uid), { workoutPlan: data.workoutPlan }, { merge: true });
    await new Promise(res => setTimeout(res, 200));

    toast.success('Workout plan generated successfully! 💪', { id: toastId });
setGeneratedWorkout(data.workoutPlan); // show the generated workout view

  } catch (err: any) {
    console.error(err);
    toast.error(err.message || 'Something went wrong ❌', { id: toastId });
  } finally {
    setLoading(false);
  }
};

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
  <div className="text-center mb-8">
    <img 
      src={heroFitness} 
      alt="AI Fitness"
      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
    />
    <h2 className="text-2xl font-bold text-neon-purple mb-2">Welcome to FitAI</h2>
    <p className="text-muted-foreground">Your personal AI fitness coach</p>
  </div>

  <div className="space-y-4">
    <div>
      <Label htmlFor="name" className="text-white">Full Name</Label>
      <Input
        id="name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        className="bg-cyber-light border-neon-blue/30 text-white"
        placeholder="Enter your full name"
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="age" className="text-white">Age</Label>
        <Input
          id="age"
          type="number"
          value={formData.age}
          onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
          className="bg-cyber-light border-neon-blue/30 text-white"
          placeholder="25"
        />
      </div>

      <div>
        <Label htmlFor="gender" className="text-white">Gender</Label>
        <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
          <SelectTrigger className="bg-cyber-light border-neon-blue/30">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="bg-cyber-light border-neon-blue/30">
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    {/* Height & Weight */}
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label className="text-white">Height</Label>

        {/* Unit selector */}
<Select value={heightUnit} onValueChange={(value) => setHeightUnit(value as 'cm' | 'ftin')}>
          <SelectTrigger className="bg-cyber-light border-neon-blue/30">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent className="bg-cyber-light border-neon-blue/30">
            <SelectItem value="ftin">ft/in</SelectItem>
            <SelectItem value="cm">cm</SelectItem>
          </SelectContent>
        </Select>

        {/* Inputs */}
        {heightUnit === 'ftin' ? (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input
              type="number"
              placeholder="ft"
              value={heightValue.ft}
              onChange={(e) => setHeightValue(prev => ({ ...prev, ft: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="in"
              value={heightValue.in}
              onChange={(e) => setHeightValue(prev => ({ ...prev, in: e.target.value }))}
            />
          </div>
        ) : (
          <Input
            type="number"
            placeholder="cm"
            value={heightValue.cm}
            onChange={(e) => setHeightValue(prev => ({ ...prev, cm: e.target.value }))}
            className="mt-2"
          />
        )}
      </div>

      <div>
        <Label htmlFor="weight" className="text-white">Weight (lbs)</Label>
        <Input
          id="weight"
          value={formData.weight}
          onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
          className="bg-cyber-light border-neon-blue/30 text-white"
          placeholder="170 lbs"
        />
      </div>
    </div>
  </div>
</div>

        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="w-16 h-16 text-neon-purple mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neon-purple mb-2">Your Fitness Goals</h2>
              <p className="text-muted-foreground">Select all that apply to you</p>
            </div>

            <div className="space-y-3">
              {fitnessGoals.map((goal) => (
                <div key={goal} className="flex items-center space-x-3 p-3 bg-cyber-light rounded-lg">
                  <Checkbox
                    id={goal}
                    checked={formData.goals.includes(goal)}
                    onCheckedChange={() => handleGoalToggle(goal)}
                    className="border-neon-blue data-[state=checked]:bg-neon-blue"
                  />
                  <Label htmlFor={goal} className="text-white flex-grow cursor-pointer">
                    {goal}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <AlertTriangle className="w-16 h-16 text-neon-pink mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neon-purple mb-2">Health & Safety</h2>
              <p className="text-muted-foreground">Any injuries or limitations?</p>
            </div>

            <div className="space-y-3">
              {commonInjuries.map((injury) => (
                <div key={injury} className="flex items-center space-x-3 p-3 bg-cyber-light rounded-lg">
                  <Checkbox
                    id={injury}
                    checked={formData.injuries.includes(injury)}
                    onCheckedChange={() => handleInjuryToggle(injury)}
                    className="border-neon-pink data-[state=checked]:bg-neon-pink"
                  />
                  <Label htmlFor={injury} className="text-white flex-grow cursor-pointer">
                    {injury}
                  </Label>
                </div>
              ))}
            </div>

            <div className="p-4 bg-neon-pink/20 border border-neon-pink rounded-lg">
              <p className="text-sm text-neon-pink">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                Your AI coach will create safe, personalized workouts based on your limitations.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Dumbbell className="w-16 h-16 text-neon-green mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neon-purple mb-2">Equipment & Schedule</h2>
              <p className="text-muted-foreground">Let's customize your experience</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-white">Available Equipment</Label>
                <Select value={formData.equipment} onValueChange={(value) => setFormData(prev => ({ ...prev, equipment: value }))}>
                  <SelectTrigger className="bg-cyber-light border-neon-blue/30">
                    <SelectValue placeholder="Select your equipment" />
                  </SelectTrigger>
                  <SelectContent className="bg-cyber-light border-neon-blue/30">
                    <SelectItem value="bodyweight">Bodyweight Only</SelectItem>
                    <SelectItem value="dumbbells">Dumbbells</SelectItem>
                    <SelectItem value="home-gym">Home Gym Setup</SelectItem>
                    <SelectItem value="full-gym">Full Gym Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Fitness Level</Label>
                <Select value={formData.fitnessLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, fitnessLevel: value }))}>
                  <SelectTrigger className="bg-cyber-light border-neon-blue/30">
                    <SelectValue placeholder="Select your current level" />
                  </SelectTrigger>
                  <SelectContent className="bg-cyber-light border-neon-blue/30">
                    <SelectItem value="beginner">Beginner (0-6 months)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (6 months - 2 years)</SelectItem>
                    <SelectItem value="advanced">Advanced (2+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Weekly Availability</Label>
                <Select value={formData.availability} onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}>
                  <SelectTrigger className="bg-cyber-light border-neon-blue/30">
                    <SelectValue placeholder="How often can you workout?" />
                  </SelectTrigger>
                  <SelectContent className="bg-cyber-light border-neon-blue/30">
                    <SelectItem value="2-3">2-3 times per week</SelectItem>
                    <SelectItem value="3-4">3-4 times per week</SelectItem>
                    <SelectItem value="4-5">4-5 times per week</SelectItem>
                    <SelectItem value="6+">6+ times per week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-neon-green mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neon-purple mb-2">You're All Set!</h2>
              <p className="text-muted-foreground mb-6">Your AI coach is ready to transform your fitness journey</p>
            </div>

            <Card className="cyber-card p-6">
              <h3 className="text-lg font-bold text-neon-purple mb-4">Your Profile Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="text-white">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span className="text-white">{formData.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Goals:</span>
                  <span className="text-white">{formData.goals.length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Equipment:</span>
                  <span className="text-white">{formData.equipment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fitness Level:</span>
                  <span className="text-white">{formData.fitnessLevel}</span>
                </div>
              </div>
            </Card>

            <div className="p-4 bg-neon-green/20 border border-neon-green rounded-lg">
              <h4 className="font-semibold text-neon-green mb-2">What's Next?</h4>
              <ul className="text-sm text-white space-y-1">
                <li>• Your AI coach will create personalized workouts</li>
                <li>• Real-time form analysis and corrections</li>
                <li>• Progress tracking and adaptive planning</li>
                <li>• 24/7 fitness guidance and motivation</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-b from-cyber-darker to-background p-4">
    {!generatedWorkout && !showDashboard && (
      <>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-neon-green">{Math.round(progress)}%</span>
          </div>
          <Progress value={animatedProgress} className="progress-glow" />
        </div>

        {/* Step Content */}
        <Card className="cyber-card p-6 mb-8">
          {renderStep()}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="ghost_cyber"
            onClick={prevStep}
            disabled={currentStep === 1 || loading}
            className="flex-1 mr-2"
          >
            Previous
          </Button>
          <Button
            variant={currentStep === totalSteps ? "neon" : "cyber"}
            onClick={nextStep}
            disabled={loading}
            className="flex-1 ml-2 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Generating...
              </>
            ) : (
              <>
                {currentStep === totalSteps ? "Start Your Journey" : "Next"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </>
    )}

    {/* Show generated workout view */}
    {generatedWorkout && !showDashboard && (
      <GeneratedWorkoutView
        workout={generatedWorkout}
        onGoToDashboard={() => setShowDashboard(true)}
      />
    )}

    {/* Show dashboard after user clicks button */}
    {showDashboard && (
      <>
        {onComplete && onComplete()}
        {/* Or navigate programmatically: */}
        {/* <Navigate to="/dashboard" /> */}
      </>
    )}
  </div>
);

  
};

export default Onboarding;