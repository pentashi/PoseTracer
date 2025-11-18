import React, { useState, useEffect, useMemo } from "react";
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
import {exerciseCounterMap} from "@/utils/exerciseCounterMap";

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

  // Fetch user settings (includes workoutPlan)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userSettings"],
    queryFn: getUserSettings,
    enabled: !!auth.currentUser,
    onError: (err: any) => {
      console.error("Failed to fetch workout plan:", err);
      toast.error("Failed to load workout plan");
    },
  });
  useEffect(() => {
    if (restTimer > 0) {
      const restInterval = setInterval(() => setRestTimer((t) => t - 1), 1000);
      return () => clearInterval(restInterval);
    }
  }, [restTimer]);

  const workout = data?.workoutPlan;

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
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => setTimer((t) => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isActive,currentExerciseData]);
  // 🎥 Live camera feed for AI tracking
  useEffect(() => {
    const video = document.getElementById("cameraFeed") as HTMLVideoElement;
    if (!video) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        video.srcObject = stream;
      } catch (err) {
        console.error("Camera access denied:", err);
        toast.error("Camera access is required for AI tracking.");
      }
    };

    if (isActive) startCamera();
    else {
      // stop camera if paused
      const stream = video.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        video.srcObject = null;
      }
    }

    return () => {
      const stream = video?.srcObject as MediaStream;
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [isActive]);

  // 🧍‍♂️ Mediapipe Pose detection
  useEffect(() => {
    const video = document.getElementById("cameraFeed") as HTMLVideoElement;
    const canvas = document.getElementById("poseCanvas") as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d");

    if (!video || !canvas || !ctx) return;

    let camera: any = null;
    let pose: any = null;

    const loadPose = async () => {
      const { Pose } = await import("@mediapipe/pose");
      const { Camera } = await import("@mediapipe/camera_utils");

      pose = new Pose({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });

      pose.onResults((results: any) => {
        if (!ctx || !canvas) return;

        // Clear old frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw mirrored camera image
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(results.image, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        // --- Rep Counter Logic ---
if (results.poseLandmarks && currentExerciseData) {
  const counterFn = exerciseCounterMap[currentExerciseData.exercise];

  if (counterFn) {
    const detectedRep = counterFn(results.poseLandmarks);

    if (detectedRep) {
      setCompletedSets((prev) => prev + 1);
         setRepsCounted((prev) => prev + 1); 

      toast.success("Rep counted!", { duration: 500 });
    }
  }
}

        // Draw pose landmarks (skeleton)
        if (results.poseLandmarks) {
          ctx.fillStyle = "#00ffcc";
          ctx.strokeStyle = "#00ffff";
          ctx.lineWidth = 2;

          // Draw points
          for (const landmark of results.poseLandmarks) {
            const x = landmark.x * canvas.width;
            const y = landmark.y * canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
          }

          // Optional: draw connecting lines (basic)
          const connect = (a: number, b: number) => {
            const pa = results.poseLandmarks[a];
            const pb = results.poseLandmarks[b];
            if (!pa || !pb) return;
            ctx.beginPath();
            ctx.moveTo(pa.x * canvas.width, pa.y * canvas.height);
            ctx.lineTo(pb.x * canvas.width, pb.y * canvas.height);
            ctx.stroke();
          };

          // Basic skeleton connections
          connect(11, 13); // Left shoulder → elbow
          connect(13, 15); // Left elbow → wrist
          connect(12, 14); // Right shoulder → elbow
          connect(14, 16); // Right elbow → wrist
          connect(11, 12); // Shoulders
          connect(23, 24); // Hips
          connect(11, 23); // Left body
          connect(12, 24); // Right body
        }
      });

      camera = new Camera(video, {
        onFrame: async () => {
          await pose.send({ image: video });
        },
        width: 640,
        height: 480,
      });

      camera.start();
    };

    if (isActive) loadPose();

    return () => {
      if (camera) camera.stop();
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
  if (isError || !workout)
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
    id="cameraFeed"
    className="w-full h-[480px] object-cover bg-black/40"
    autoPlay
    muted
    playsInline
  />
  <canvas
    id="poseCanvas"
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
