export function buildWorkoutPrompt(profile) {
  const safe = (val) => {
    if (val === null || val === undefined) return "N/A";
    if (typeof val === "string" && val.trim() === "") return "N/A";
    if (Array.isArray(val) && val.length === 0) return "N/A";
    return val;
  };

  const {
    name, age, gender, height, weight,
    fitnessGoals, experienceLevel, workoutSplit,
    trainingDaysPerWeek, workoutDurationMinutes,
    preferredTrainingTime, trainingEnvironment,
    injuryHistory, mobilityRestrictions, exerciseRestrictions,
    physicalActivityLevel, bodyFatPercentage, muscleMass,
    waistCircumference, dietaryPreference, sleepQuality,
    stressLevel, motivationLevel, goalTimeline,
    additionalNotes, accountabilityPreferences, motivation,
  } = profile;

  const prioritizedGoals = Array.isArray(fitnessGoals) && fitnessGoals.length
    ? fitnessGoals.join(", ")
    : "general fitness";

  return `
You are a world-class AI fitness coach creating a **hyper-personalized, safe, effective, and detailed workout plan**.

Client Profile Summary:
Name: ${safe(name)}, Age: ${safe(age)}, Gender: ${safe(gender)}, Height: ${safe(height)} cm, Weight: ${safe(weight)} kg.
Goals: ${prioritizedGoals}.
Experience Level: ${safe(experienceLevel)}.
Preferred Training Split: ${safe(workoutSplit)}.
Training Days Per Week: ${safe(trainingDaysPerWeek)}.
Workout Duration per Session: ~${safe(workoutDurationMinutes)} minutes.
Training Environment: ${safe(trainingEnvironment)}.
Dietary Preference: ${safe(dietaryPreference)}.
Goal Timeline: ${safe(goalTimeline)}.
Injury History: ${safe(injuryHistory)}.
Mobility & Exercise Restrictions: ${safe(mobilityRestrictions)}, ${safe(exerciseRestrictions)}.
Motivation Level & Mindset: ${safe(motivationLevel)}, ${safe(motivation)}.
Additional Notes: ${safe(additionalNotes)}.

---

### Instructions:

1. Generate a weekly workout plan structured by day (e.g., day1, day2, ...), each with:
   - A clear **focus** (muscle groups or training emphasis) per day.
   - A list of **exercises** with:
     - Name
     - Sets, reps, rest periods (all strings quoted, e.g. "8-10", "60-90 seconds")
     - Equipment needed
     - If applicable, provide **alternative exercise options** for key lifts.

2. Include **explicit rest days or active recovery days** in the weekly schedule (e.g., "Rest Day", "Active Recovery: light cardio/stretching").

3. Provide **progression guidelines** in detail for at least 8 weeks, split into phases (e.g., weeks 1-4, weeks 5-8), with specifics on increasing load, reps, or intensity.

4. Include **warm-up and cool-down recommendations** for every training day.

5. Add **comprehensive notes** covering:
   - Proper form and technique
   - Safety tips to avoid injury
   - Recovery strategies
   - Motivation and mindset advice

6. Provide **diet tips** strictly aligned to the client's dietary preference and goal timeline, including:
   - Caloric guidance
   - Macronutrient breakdowns
   - Meal timing or nutrient timing tips if applicable

7. Exclude any exercises conflicting with injury, mobility, or exercise restrictions.

8. Use only equipment available in the client’s training environment.

9. Return ONLY a JSON object with the following keys:
   - summary
   - weeklySchedule (day1, day2, ... each with focus and exercises)
   - progression
   - restRecovery (including restDays, activeRecovery, warmUp, coolDown)
   - notes
   - dietTips

10. All strings MUST be double-quoted. No markdown, no comments, no extra explanations.

---

### Example output structure:

{
  "summary": "Brief overview...",
  "weeklySchedule": {
    "day1": {
      "focus": "Chest & Triceps - Push day",
      "exercises": [
        {
          "exercise": "Incline Dumbbell Press",
          "sets": 4,
          "reps": "8-10",
          "rest": "60-90 seconds",
          "equipment": "Dumbbells",
          "alternatives": ["Push-ups", "Dumbbell Chest Press"]
        }
        // more exercises...
      ]
    },
    "day6": {
      "focus": "Rest or Active Recovery",
      "exercises": []
    }
    // other days...
  },
  "progression": {
    "week1-4": "Increase weight by 2.5-5 lbs every two weeks, maintain reps",
    "week5-8": "Increase reps by 1-2 every two weeks, add drop sets on final sets"
  },
  "restRecovery": {
    "restDays": "1-2 rest days per week, spaced evenly",
    "activeRecovery": "20-30 minutes light cardio or yoga on off days",
    "warmUp": "5-10 minutes of light cardio and dynamic stretches before workouts",
    "coolDown": "5-10 minutes of stretching and foam rolling after workouts"
  },
  "notes": {
    "form": "Focus on controlled movement and full range of motion.",
    "safety": "Warm up properly and avoid overloading to prevent injury.",
    "recovery": "Prioritize sleep and hydration for muscle repair.",
    "motivation": "Track progress weekly and celebrate small wins."
  },
  "dietTips": {
    "caloricSurplus": "Eat 250-500 calories above maintenance.",
    "macroBalance": "30% protein, 40% carbs, 30% fat.",
    "timing": "Consume protein-rich meals post-workout for recovery."
  }
}

---

Return ONLY the JSON object as described above, no explanations or extra text.
`.trim();
}
