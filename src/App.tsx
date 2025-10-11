import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components / Pages
import Dashboard from "./components/Dashboard";
import AIChat from "./components/AIChat";
import WorkoutPlanner from "./components/WorkoutPlanner";
import GeneratedWorkoutView from "./components/GeneratedWorkoutView";
import Goals from "./components/Goals";
import ProgressAnalytics from "./components/ProgressAnalytics";
import WorkoutTracking from "./components/WorkoutTracking";
import Settings from "./components/Settings";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";

// Layouts
import ProtectedLayout from "./components/ProtectedLayout";

// Auth
import { AuthProvider } from "@/context/AuthContext";
import RequireAuth from "@/components/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Onboarding (protected but without nav) */}
            <Route
              path="/onboarding"
              element={
                <RequireAuth>
                  <Onboarding onComplete={() => window.location.replace("/dashboard")} />
                </RequireAuth>
              }
            />

            {/* All other Protected Routes with Navigation */}
            <Route
              element={
                <RequireAuth>
                  <ProtectedLayout />
                </RequireAuth>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ai-coach" element={<AIChat />} />
              <Route path="/planner" element={<WorkoutPlanner />} />
              <Route
                path="/generated-workout"
                element={
                  <GeneratedWorkoutView
                    workout={{}}
                    onGoToDashboard={() => window.location.replace("/dashboard")}
                  />
                }
              />
              <Route path="/goals" element={<Goals />} />
              <Route path="/progress" element={<ProgressAnalytics />} />
              <Route path="/workout" element={<WorkoutTracking />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
