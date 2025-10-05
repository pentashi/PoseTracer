import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Check, ChevronRight } from 'lucide-react';

interface GeneratedWorkoutViewProps {
  workout: any; // replace 'any' with your workout type
  onGoToDashboard: () => void;
}

const GeneratedWorkoutView: React.FC<GeneratedWorkoutViewProps> = ({ workout, onGoToDashboard }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-darker to-background p-4 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-8">
        <Dumbbell className="h-16 w-16 text-neon-green mx-auto mb-2" />
        <h2 className="text-3xl font-bold text-neon-purple mb-2">Your Personalized Workout</h2>
        <p className="text-white/80 text-base">Review your AI-generated plan before starting your fitness journey</p>
      </div>

      {/* Scrollable Content */}
      <div className="w-full max-w-4xl flex flex-col space-y-6 overflow-y-auto pb-6">

        {/* Summary */}
        {workout.summary && (
          <Card className="cyber-card p-5">
            <h3 className="text-xl font-bold text-neon-blue mb-2">Summary</h3>
            <p className="text-white text-sm leading-relaxed">{workout.summary}</p>
          </Card>
        )}

        {/* Weekly Schedule */}
        {workout.weeklySchedule && (
          <div className="space-y-4">
            {Object.entries(workout.weeklySchedule).map(([dayKey, dayData]: any, idx) => (
              <Card key={idx} className="cyber-card p-5">
                <h3 className="text-xl font-bold text-neon-blue mb-3">
                  {dayKey.toUpperCase()}: {dayData.focus}
                </h3>

                {dayData.exercises.length > 0 ? (
                  <ul className="space-y-3 text-white text-sm leading-relaxed">
                    {dayData.exercises.map((ex: any, i: number) => (
                      <li key={i} className="border-b border-cyber-light/20 pb-3">
                        <p className="font-semibold text-neon-green text-base mb-1">{ex.exercise}</p>
                        <p className="text-white/90 text-sm mb-1">Sets x Reps: {ex.sets} x {ex.reps}</p>
                        {ex.rest && <p className="text-white/90 text-sm mb-1">Rest: {ex.rest}</p>}
                        {ex.equipment && <p className="text-white/90 text-sm mb-1">Equipment: {ex.equipment}</p>}
                        {ex.alternatives && ex.alternatives.length > 0 && (
                          <p className="text-white/90 text-sm">Alternatives: {ex.alternatives.join(', ')}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-white/70 italic">No exercises. Rest or recovery day.</p>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Notes & Tips */}
        {workout.notes && (
          <Card className="cyber-card p-5">
            <h3 className="text-xl font-bold text-neon-blue mb-3">Notes & Tips</h3>
            {Object.entries(workout.notes).map(([key, value], idx) => (
              <p key={idx} className="text-white/90 text-sm mb-1">
                <span className="font-semibold capitalize">{key}:</span> {value}
              </p>
            ))}
          </Card>
        )}

        {/* Diet Tips */}
        {workout.dietTips && (
          <Card className="cyber-card p-5">
            <h3 className="text-xl font-bold text-neon-blue mb-3">Diet Tips</h3>
            {Object.entries(workout.dietTips).map(([key, value], idx) => (
              <p key={idx} className="text-white/90 text-sm mb-1">
                <span className="font-semibold capitalize">{key}:</span> {value}
              </p>
            ))}
          </Card>
        )}

        {/* Progression */}
        {workout.progression && (
          <Card className="cyber-card p-5">
            <h3 className="text-xl font-bold text-neon-blue mb-3">Progression</h3>
            {Object.entries(workout.progression).map(([phase, desc], idx) => (
              <p key={idx} className="text-white/90 text-sm mb-1">
                <span className="font-semibold capitalize">{phase}:</span> {desc}
              </p>
            ))}
          </Card>
        )}

        {/* Rest & Recovery */}
        {workout.restRecovery && (
          <Card className="cyber-card p-5">
            <h3 className="text-xl font-bold text-neon-blue mb-3">Rest & Recovery</h3>
            {Object.entries(workout.restRecovery).map(([key, desc], idx) => (
              <p key={idx} className="text-white/90 text-sm mb-1">
                <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {desc}
              </p>
            ))}
          </Card>
        )}

        {/* Go to Dashboard */}
        <div className="mt-6 w-full">
          <Button
            variant="neon"
            className="w-full flex items-center justify-center"
            onClick={onGoToDashboard}
          >
            Go to Dashboard <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneratedWorkoutView;
