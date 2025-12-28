// dummyWorkout.ts
export const dummyWorkoutPlan = {
  summary: "Demo full body routine",
  weeklySchedule: {
    day1: {
      focus: "Full Body Strength",
      exercises: [
        { exercise: "Push-ups", sets: "3", reps: 12, rest: "60s" },
        { exercise: "Bodyweight Squats", sets: "3", reps: 15, rest: "60s" },
      ],
    },
    day2: { focus: "Rest", exercises: [] },
    day3: {
      focus: "Upper Body",
      exercises: [
        { exercise: "Dumbbell Rows", sets: "3", reps: 10, rest: "60s" },
        { exercise: "Shoulder Press", sets: "3", reps: 12, rest: "60s" },
      ],
    },
    // Fill other days similarly or leave empty
    day4: { focus: "Rest", exercises: [] },
    day5: { focus: "Lower Body", exercises: [{ exercise: "Lunges", sets: "3", reps: 12, rest: "60s" }] },
    day6: { focus: "Rest", exercises: [] },
    day7: { focus: "Full Body", exercises: [{ exercise: "Burpees", sets: "3", reps: 10, rest: "60s" }] },
  },
};
