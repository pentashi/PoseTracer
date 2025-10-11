// src/components/Settings.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { User, Bot, Watch, Shield, Download } from "lucide-react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserSettings, updateUserSettings } from "@/services/userService";
import { auth } from "@/firebaseConfig";
import { toast } from "sonner";


const Settings: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
// Redirect to login if no user is logged in
  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
  }, [navigate]);
const handleLogout = async () => {
  try {
    await auth.signOut();
    queryClient.clear(); // clear all cached queries
    navigate("/login");
    toast.success("Logged out successfully");
  } catch (err) {
    console.error("Logout failed:", err);
    toast.error("Logout failed, try again");
  }
};



  const [profile, setProfile] = useState<any>(null);
  const [aiSettings, setAiSettings] = useState<any>({});
  const [privacySettings, setPrivacySettings] = useState<any>({});
  const [deviceIntegrations, setDeviceIntegrations] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any>({});
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);

  const [editingProfile, setEditingProfile] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userSettings"],
    queryFn: getUserSettings,
    enabled: !!auth.currentUser,
    onError: (err: any) => {
      console.error("Error loading settings:", err);
      toast.error("Failed to load settings");
    },
  });

  const mutation = useMutation({
    mutationFn: (updates: any) => updateUserSettings(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
      toast.success("Saved");
    },
    onError: (err: any) => {
      console.error("Failed to save settings:", err);
      toast.error("Save failed");
    },
  });

  useEffect(() => {
    if (!data) return;

    setProfile({
      name: data.name ?? data.profile?.name ?? "",
      age: data.age ?? data.profile?.age ?? "",
      height: data.height ?? data.profile?.height ?? "",
      weight: data.weight ?? data.profile?.weight ?? "",
      equipment: data.equipment ?? data.profile?.equipment ?? "",
      experienceLevel: data.experienceLevel ?? data.profile?.experienceLevel ?? "",
      trainingDaysPerWeek: data.trainingDaysPerWeek ?? data.profile?.trainingDaysPerWeek ?? "",
      fitnessGoals: Array.isArray(data.fitnessGoals)
        ? data.fitnessGoals
        : data.fitnessGoals
        ? [data.fitnessGoals]
        : data.profile?.fitnessGoals ?? [],
      injuries: Array.isArray(data.injuries)
        ? data.injuries
        : data.injuries
        ? [data.injuries]
        : data.profile?.injuries ?? [],
      email: data.email ?? "",
    });

    setAiSettings(data.aiSettings ?? {});
    setPrivacySettings(data.privacySettings ?? data.privacy ?? {});
    setDeviceIntegrations(data.deviceIntegrations ?? data.devices ?? []);
    setNotifications(data.notifications ?? {});
    setWorkoutPlan(data.workoutPlan ?? null);
  }, [data]);

  const handleSaveProfile = async () => {
    if (!profile) return;

    const updates: any = {
      name: profile.name,
      age: profile.age ? Number(profile.age) : null,
      height: profile.height ? Number(profile.height) : null,
      weight: profile.weight ? Number(profile.weight) : null,
      equipment: profile.equipment ?? null,
      experienceLevel: profile.experienceLevel ?? null,
      trainingDaysPerWeek: profile.trainingDaysPerWeek ?? null,
      fitnessGoals: Array.isArray(profile.fitnessGoals)
        ? profile.fitnessGoals
        : (profile.fitnessGoals || "").split(",").map((s: string) => s.trim()).filter(Boolean),
      injuries: Array.isArray(profile.injuries)
        ? profile.injuries
        : (profile.injuries || "").split(",").map((s: string) => s.trim()).filter(Boolean),
    };

    try {
      await mutation.mutateAsync(updates);
      setEditingProfile(false);
    } catch {}
  };

  const saveNotifications = async (newNotifications: any) => {
    setNotifications(newNotifications);
    await mutation.mutateAsync({ notifications: newNotifications });
  };

  const handleExport = () => {
    const payload = data ?? {};
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user-${auth.currentUser?.uid ?? "settings"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export started");
  };

  const viewWorkoutPlan = () => {
    navigate("/generated-workout", { state: { workoutPlan } });
  };

  if (isLoading) return <p className="text-white text-center mt-12">Loading settings...</p>;
  if (isError) return <p className="text-red-400 text-center mt-12">Error loading settings</p>;
  if (!profile) return <p className="text-white text-center mt-12">No profile data</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-darker to-background p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-2xl font-bold text-neon-purple">Settings</h1>
    <p className="text-sm text-neon-blue">Customize your AI fitness experience</p>
  </div>
  <div className="flex gap-2">
    <Button variant="ghost_cyber" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Export Data
    </Button>
    <Button variant="destructive" onClick={handleLogout}>
      Logout
    </Button>
  </div>
</div>


      {/* Profile Card */}
      <Card className="cyber-card p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <User className="h-6 w-6 text-neon-purple" />
          <h3 className="text-lg font-bold text-white">Profile</h3>
        </div>

        {!editingProfile ? (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium text-white">{profile.name || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium text-white">{profile.age || "—"} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Height (cm)</p>
                <p className="font-medium text-white">{profile.height ?? "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weight (kg)</p>
                <p className="font-medium text-white">{profile.weight ?? "—"}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Goals</p>
              <div className="flex flex-wrap gap-2">
                {(profile.fitnessGoals || []).map((g: string, i: number) => (
                  <Badge key={i} className="bg-neon-green text-cyber-dark">{g}</Badge>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Injuries</p>
              <div className="flex flex-wrap gap-2">
                {(profile.injuries || []).map((i: string, idx: number) => (
                  <Badge key={idx} className="bg-neon-pink text-cyber-dark">{i}</Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost_cyber" onClick={() => setEditingProfile(true)}>Edit Profile</Button>
              <Button variant="neon" onClick={viewWorkoutPlan}>View Workout Plan</Button>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <Input type="number" value={profile.age} onChange={(e) => setProfile({ ...profile, age: e.target.value })} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Height (cm)</p>
                <Input type="number" value={profile.height} onChange={(e) => setProfile({ ...profile, height: e.target.value })} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Weight (kg)</p>
                <Input type="number" value={profile.weight} onChange={(e) => setProfile({ ...profile, weight: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Equipment</p>
                <Input value={profile.equipment} onChange={(e) => setProfile({ ...profile, equipment: e.target.value })} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Experience Level</p>
                <Select value={profile.experienceLevel || ""} onValueChange={(val) => setProfile({ ...profile, experienceLevel: val })}>
                  <SelectTrigger className="w-full bg-cyber-light border-neon-blue/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cyber-light border-neon-blue/30">
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Goals (comma separated)</p>
              <Input
                value={Array.isArray(profile.fitnessGoals) ? profile.fitnessGoals.join(", ") : profile.fitnessGoals || ""}
                onChange={(e) => setProfile({ ...profile, fitnessGoals: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Injuries (comma separated)</p>
              <Input
                value={Array.isArray(profile.injuries) ? profile.injuries.join(", ") : profile.injuries || ""}
                onChange={(e) => setProfile({ ...profile, injuries: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="ghost_cyber" onClick={() => setEditingProfile(false)}>Cancel</Button>
              <Button variant="neon" onClick={handleSaveProfile}>Save Profile</Button>
            </div>
          </>
        )}
      </Card>

      {/* Workout Plan */}
      <Card className="cyber-card p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Bot className="h-6 w-6 text-neon-blue ai-glow" />
            <h3 className="text-lg font-bold text-white">Generated Workout Plan</h3>
          </div>
          <Button variant="cyber" onClick={viewWorkoutPlan}>Open</Button>
        </div>
        <p className="text-sm text-muted-foreground mb-2">Summary</p>
        <p className="text-white text-sm">{workoutPlan?.summary ?? "No generated plan yet."}</p>
      </Card>

      {/* Device Integrations */}
      <Card className="cyber-card p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Watch className="h-6 w-6 text-neon-green" />
          <h3 className="text-lg font-bold text-white">Device Integrations</h3>
        </div>
        <div className="space-y-3">
          {(deviceIntegrations || []).map((d, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-cyber-light rounded-lg">
              <div>
                <p className="font-medium text-white">{d.name}</p>
                <p className="text-xs text-muted-foreground">
                  {d.connected ? `Status: ${d.status ?? "connected"}` : "Not connected"}
                  {d.battery ? ` • ${d.battery}% battery` : ""}
                </p>
              </div>
              <Button variant={d.connected ? "cyber" : "neon"} size="sm">{d.connected ? "Configure" : "Connect"}</Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Privacy & Notifications */}
      <Card className="cyber-card p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-6 w-6 text-neon-pink" />
          <h3 className="text-lg font-bold text-white">Privacy & Notifications</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Workout Reminders</p>
              <p className="text-xs text-muted-foreground">Daily workout notifications</p>
            </div>
            <Switch checked={!!notifications?.workoutReminders} onCheckedChange={(v) => saveNotifications({ ...(notifications || {}), workoutReminders: !!v })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Progress Updates</p>
              <p className="text-xs text-muted-foreground">Weekly summaries</p>
            </div>
            <Switch checked={!!notifications?.progressUpdates} onCheckedChange={(v) => saveNotifications({ ...(notifications || {}), progressUpdates: !!v })} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
