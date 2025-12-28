import React, { useState,useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Camera,
  Mic,
  Timer,
  Zap,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUserSettings } from "@/services/userService";
import { auth } from "@/firebaseConfig";
import { toast } from "sonner";
import { exerciseCounterMap } from "@/utils/exerciseCounterMap";
import {Pose} from "@mediapipe/pose";
import type { Results as PoseResults } from "@mediapipe/pose";


// --- DEMO WORKOUT ---
const dummyWorkout = {
  weeklySchedule: {
    day1: {
      focus: "Full Body Strength",
      exercises: [
        { exercise: "Push Ups", reps: 12, sets: 3, rest: "60s" },
        { exercise: "Squats", reps: 15, sets: 3, rest: "60s" },
        { exercise: "Plank", reps: 1, sets: 3, rest: "45s" },
      ],
    },
    day2: {
      focus: "Cardio & Core",
      exercises: [
        { exercise: "Jumping Jacks", reps: 30, sets: 3, rest: "30s" },
        { exercise: "Mountain Climbers", reps: 20, sets: 3, rest: "30s" },
      ],
    },
    // You can add day3–day7 similarly if needed
  },
};


// Helper function to parse sets like "3-4" into a number for rendering
const getSetsCount = (sets: string | number | undefined): number => {
  if (!sets) return 3; // fallback
  if (typeof sets === "number") return sets;
  if (typeof sets === "string") {
    const match = sets.match(/\d+/); // extract first number
    if (match) return parseInt(match[0], 10);
  }
  return 3; // fallback
};

const WorkoutTracking = () => {
  const [isActive, setIsActive] = useState(true);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timer, setTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [completedSets, setCompletedSets] = useState(0);
  const [repsCounted, setRepsCounted] = useState(0);
  const isDemo = !auth.currentUser;



  // Fetch user settings (includes workoutPlan)
const { data, isLoading, isError } = useQuery({
  queryKey: ["userSettings"],
  queryFn: getUserSettings,
  enabled: !!auth.currentUser,
 meta: {
  onError: (err: Error) => {
    console.error("Failed to fetch workout plan:", err);
    toast.error("Failed to load workout plan");
  }
}
});

  useEffect(() => {
    if (restTimer > 0) {
      const restInterval = setInterval(() => setRestTimer((t) => t - 1), 1000);
      return () => clearInterval(restInterval);
    }
  }, [restTimer]);

const workout = isDemo
  ? dummyWorkout
  : data?.workoutPlan;

  // 🧠 Determine current day (maps Firestore day1–day7)
  const currentDayKey = useMemo(() => {
    const jsDay = new Date().getDay(); // 0=Sunday → 6=Saturday
    const mapping = {
      0: "day7", // Sunday → day7
      1: "day1", // Monday → day1
      2: "day2",
      3: "day3",
      4: "day4",
      5: "day5",
      6: "day6", // Saturday → day6
    };
    return mapping[jsDay];
  }, []);


  const todayWorkout = workout?.weeklySchedule?.[currentDayKey];
  const exercises = todayWorkout?.exercises || [];
  const currentExerciseData = exercises[currentExercise];

  // Timer (optional continuous)
  
  // 🧍‍♂️ Mediapipe Pose detection
const videoRef = useRef<HTMLVideoElement>(null);
const canvasRef = useRef<HTMLCanvasElement>(null);
const poseRef = useRef<Pose | null>(null);
const rafRef = useRef<number | null>(null);
useEffect(() => {
  let isMounted = true;

  const setup = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    // Start camera
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    await videoRef.current.play();

    // Init Pose
   poseRef.current = new Pose({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
});


    poseRef.current.setOptions({
      modelComplexity: 0,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    poseRef.current.onResults((results: PoseResults) => {
      if (!isMounted) return;

      canvasRef.current!.width = videoRef.current!.videoWidth;
      canvasRef.current!.height = videoRef.current!.videoHeight;
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

      ctx.drawImage(
        results.image,
        0,
        0,
        canvasRef.current!.width,
        canvasRef.current!.height
      );

      if (!results.poseLandmarks) return;

      ctx.fillStyle = "#00ffcc";
      for (const lm of results.poseLandmarks) {
        const x = (1 - lm.x) * canvasRef.current!.width;
        const y = lm.y * canvasRef.current!.height;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Continuous render loop
    const loop = () => {
      if (isActive && videoRef.current!.readyState >= 2) {
        poseRef.current!.send({ image: videoRef.current!, flipHorizontal: true });
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  setup();

  return () => {
    isMounted = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    poseRef.current?.close();
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((t) => t.stop());
    }
  };
}, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const finishSet = () => {
  const totalSets = getSetsCount(currentExerciseData.sets);

  if (completedSets < totalSets - 1) {
    // Start rest timer if defined
    if (currentExerciseData.rest) {
      let restSeconds = 0;

      if (typeof currentExerciseData.rest === "number") {
        restSeconds = currentExerciseData.rest;
      } else if (typeof currentExerciseData.rest === "string") {
        // Match formats like "1:00"
        const minSecMatch = currentExerciseData.rest.match(/(\d+):(\d+)/);
        if (minSecMatch) {
          restSeconds =
            parseInt(minSecMatch[1], 10) * 60 + parseInt(minSecMatch[2], 10);
        } else {
          // Match simple numbers like "60s" or "1 min"
          const numMatch = currentExerciseData.rest.match(/\d+/);
          if (numMatch) {
            restSeconds = parseInt(numMatch[0], 10);

            // Optional: multiply by 60 if you know the value is in minutes
            if (currentExerciseData.rest.includes("min")) {
              restSeconds *= 60;
            }
          }
        }
      }

      if (restSeconds > 0) setRestTimer(restSeconds);
    }

    // Increment completed sets
    setCompletedSets((c) => c + 1);
  } else {
    // Move to next exercise
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise((e) => e + 1);
      setCompletedSets(0);
    } else {
      toast.success("Workout Complete! 🎉🔥");
    }
  }
};

  if (isLoading)
    return <p className="text-white text-center mt-12">Loading workout plan...</p>;
  if (!isDemo && (isError || !workout))
  return <p className="text-red-400 text-center mt-12">No workout plan found</p>;

  if (!todayWorkout || todayWorkout.exercises?.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-cyber-darker to-background">
        <h1 className="text-5xl font-bold text-neon-green mb-4 animate-pulse">
          💤 REST DAY 💤
        </h1>
        <p className="text-lg text-neon-blue">
          Recover strong and get ready for your next session 💪
        </p>
      </div>
    );
  }


// Total sets across all exercises (handles strings like "3-4")
const totalSets = exercises.reduce((sum, ex) => sum + getSetsCount(ex.sets), 0);

// Completed sets so far
const completedSetCount = exercises
  .slice(0, currentExercise)
  .reduce((sum, ex) => sum + getSetsCount(ex.sets), 0) + completedSets;

// Progress percentage
const progress = totalSets > 0 ? (completedSetCount / totalSets) * 100 : 0;


  const aiAnalysis = {
    formScore: 87,
    improvements: [
      {
        type: "warning",
        message: "Keep your core tighter during the lift",
        timestamp: "2 min ago",
      },
      {
        type: "success",
        message: "Perfect bar path on that rep!",
        timestamp: "30 sec ago",
      },
      {
        type: "info",
        message: "Consider increasing weight by 5lbs next set",
        timestamp: "1 min ago",
      },
    ],
    nextRecommendation:
      "Focus on controlled eccentric movement for maximum muscle activation",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-darker to-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neon-purple">
            {todayWorkout.focus || "Workout"}
          </h1>
          <p className="text-sm text-neon-blue">
            Exercise {currentExercise + 1} of {exercises.length}
          </p>
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
      {currentExerciseData && (
        <Card className="cyber-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              {currentExerciseData.exercise}
            </h2>

              <span className="text-neon-green font-bold text-lg">
      Reps: {repsCounted} / {currentExerciseData.reps}
    </span>
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
            {[...Array(getSetsCount(currentExerciseData.sets))].map((_, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-cyber-light border border-cyber-light">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-cyber-light text-muted-foreground">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-white">Set {idx + 1}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentExerciseData.reps} reps{" "}
                      {currentExerciseData.rest && `· Rest ${currentExerciseData.rest}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* ✅ Finish Set Button */}
            <Button
              variant="neon"
              className="w-full mt-3"
              onClick={finishSet}
              disabled={restTimer > 0} // disables during rest
            >
              {restTimer > 0 ? `Rest: ${restTimer}s` : "✅ Finish Set"}
            </Button>

          </div>


          {/* Exercise Controls */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="ghost_cyber"
              disabled={currentExercise === 0}
              onClick={() => setCurrentExercise((prev) => prev - 1)}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              variant={isActive ? "cyber" : "neon"}
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? (
                <Pause className="h-4 w-4 mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isActive ? "Pause" : "Resume"}
            </Button>
            <Button
              variant="ghost_cyber"
              disabled={currentExercise >= exercises.length - 1}
              onClick={() => setCurrentExercise((prev) => prev + 1)}
            >
              Next
              <SkipForward className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* AI Form Analysis */}
      <Card className="cyber-card p-6 mb-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-neon-purple">AI Form Analysis</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? "bg-neon-green ai-glow" : "bg-gray-500"}`}></div>
            <span className={`text-sm ${isActive ? "text-neon-green" : "text-gray-400"}`}>
              {isActive ? "Live Tracking" : "Paused"}
            </span>
          </div>
        </div>

        {/* Camera Section */}
   <div className="relative w-full rounded-xl overflow-hidden border border-neon-blue/40 mb-4">
  <video
    ref={videoRef}
    className="w-full h-[480px] object-cover bg-black/40"
    autoPlay
    muted
    playsInline
  />
  <canvas
    ref={canvasRef}
    className="absolute top-0 left-0 w-full h-full"
  ></canvas>
</div>




        {/* Form metrics */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-white">Form Score</span>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-neon-green">
              {aiAnalysis.formScore}%
            </span>
            <Zap className="h-5 w-5 text-neon-green" />
          </div>
        </div>

        <Progress value={aiAnalysis.formScore} className="progress-glow mb-4" />

        {/* Messages */}
        <div className="space-y-3">
          {aiAnalysis.improvements.map((improvement, idx) => (
            <div key={idx}
              className={`flex items-start space-x-3 p-3 rounded-lg ${improvement.type === "success"
                  ? "bg-neon-green/20 border-l-4 border-neon-green"
                  : improvement.type === "warning"
                    ? "bg-neon-pink/20 border-l-4 border-neon-pink"
                    : "bg-neon-blue/20 border-l-4 border-neon-blue"
                }`}
            >
              {improvement.type === "success" && (
                <CheckCircle className="h-4 w-4 text-neon-green mt-0.5" />
              )}
              {improvement.type === "warning" && (
                <AlertTriangle className="h-4 w-4 text-neon-pink mt-0.5" />
              )}
              {improvement.type === "info" && (
                <Zap className="h-4 w-4 text-neon-blue mt-0.5" />
              )}
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

    </div>
  );
};

export default WorkoutTracking;
