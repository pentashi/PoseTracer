import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { User, Bot, Watch, Shield, Download, Mic, Camera, Bell, Zap } from 'lucide-react';

const Settings = () => {
  const profileData = {
    name: "Alex Chen",
    age: 28,
    height: "5'10\"",
    weight: "168 lbs",
    fitnessLevel: "Intermediate",
    goals: ["Build Muscle", "Lose Fat"],
    injuries: ["Lower Back (Minor)"]
  };

  const aiSettings = {
    voiceStyle: "motivational",
    analysisDepth: "detailed",
    formCorrections: true,
    nutritionAdvice: true,
    recoveryTracking: true
  };

  const privacySettings = {
    dataSharing: false,
    analytics: true,
    photoStorage: true,
    voiceRecording: true
  };

  const deviceIntegrations = [
    { name: "Apple Watch", connected: true, battery: 85, status: "syncing" },
    { name: "MyFitnessPal", connected: true, status: "active" },
    { name: "Strava", connected: false, status: "disconnected" },
    { name: "Fitbit", connected: false, status: "available" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-darker to-background p-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neon-purple">Settings</h1>
          <p className="text-sm text-neon-blue">Customize your AI fitness experience</p>
        </div>
        <Button variant="cyber">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Profile Settings */}
      <Card className="cyber-card p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <User className="h-6 w-6 text-neon-purple" />
          <h3 className="text-lg font-bold text-white">Profile Settings</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium text-white">{profileData.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="font-medium text-white">{profileData.age} years</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Height</p>
              <p className="font-medium text-white">{profileData.height}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Weight</p>
              <p className="font-medium text-white">{profileData.weight}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Fitness Goals</p>
            <div className="flex flex-wrap gap-2">
              {profileData.goals.map((goal, idx) => (
                <Badge key={idx} className="bg-neon-green text-cyber-dark">
                  {goal}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Injuries/Limitations</p>
            <div className="flex flex-wrap gap-2">
              {profileData.injuries.map((injury, idx) => (
                <Badge key={idx} className="bg-neon-pink text-cyber-dark">
                  {injury}
                </Badge>
              ))}
            </div>
          </div>

          <Button variant="ghost_cyber" className="w-full">
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* AI Coach Settings */}
      <Card className="cyber-card p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Bot className="h-6 w-6 text-neon-blue ai-glow" />
          <h3 className="text-lg font-bold text-white">AI Coach Settings</h3>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-white">Voice Style</p>
              <Select defaultValue={aiSettings.voiceStyle}>
                <SelectTrigger className="w-32 bg-cyber-light border-neon-blue/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-cyber-light border-neon-blue/30">
                  <SelectItem value="calm">Calm</SelectItem>
                  <SelectItem value="motivational">Motivational</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">Choose how your AI coach communicates</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-white">Analysis Depth</p>
              <Select defaultValue={aiSettings.analysisDepth}>
                <SelectTrigger className="w-32 bg-cyber-light border-neon-blue/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-cyber-light border-neon-blue/30">
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">Level of workout analysis and feedback</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Real-time Form Corrections</p>
                <p className="text-xs text-muted-foreground">Get instant feedback during workouts</p>
              </div>
              <Switch defaultChecked={aiSettings.formCorrections} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Nutrition Advice</p>
                <p className="text-xs text-muted-foreground">Receive meal and supplement suggestions</p>
              </div>
              <Switch defaultChecked={aiSettings.nutritionAdvice} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Recovery Tracking</p>
                <p className="text-xs text-muted-foreground">Monitor sleep and stress for optimization</p>
              </div>
              <Switch defaultChecked={aiSettings.recoveryTracking} />
            </div>
          </div>
        </div>
      </Card>

      {/* Device Integrations */}
      <Card className="cyber-card p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Watch className="h-6 w-6 text-neon-green" />
          <h3 className="text-lg font-bold text-white">Device Integrations</h3>
        </div>

        <div className="space-y-3">
          {deviceIntegrations.map((device, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-cyber-light rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  device.connected 
                    ? device.status === 'syncing' ? 'bg-neon-blue ai-glow' : 'bg-neon-green'
                    : 'bg-cyber-light border border-muted-foreground'
                }`}></div>
                <div>
                  <p className="font-medium text-white">{device.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {device.connected ? `Status: ${device.status}` : 'Not connected'}
                    {device.battery && ` • ${device.battery}% battery`}
                  </p>
                </div>
              </div>
              
              <Button 
                variant={device.connected ? "cyber" : "neon"} 
                size="sm"
              >
                {device.connected ? 'Configure' : 'Connect'}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Privacy & Data */}
      <Card className="cyber-card p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-6 w-6 text-neon-pink" />
          <h3 className="text-lg font-bold text-white">Privacy & Data</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Data Sharing</p>
              <p className="text-xs text-muted-foreground">Share anonymized data for research</p>
            </div>
            <Switch defaultChecked={privacySettings.dataSharing} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Usage Analytics</p>
              <p className="text-xs text-muted-foreground">Help improve the app experience</p>
            </div>
            <Switch defaultChecked={privacySettings.analytics} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Photo Storage</p>
              <p className="text-xs text-muted-foreground">Store progress photos securely</p>
            </div>
            <Switch defaultChecked={privacySettings.photoStorage} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Voice Recording</p>
              <p className="text-xs text-muted-foreground">Record voice for AI interaction</p>
            </div>
            <Switch defaultChecked={privacySettings.voiceRecording} />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-cyber-light">
          <div className="flex space-x-3">
            <Button variant="ghost_cyber" className="flex-1">
              <Shield className="mr-2 h-4 w-4" />
              Privacy Policy
            </Button>
            <Button variant="ghost_cyber" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="cyber-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Bell className="h-6 w-6 text-neon-purple" />
          <h3 className="text-lg font-bold text-white">Notifications</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Workout Reminders</p>
              <p className="text-xs text-muted-foreground">Daily workout notifications</p>
            </div>
            <Switch defaultChecked={true} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Progress Updates</p>
              <p className="text-xs text-muted-foreground">Weekly progress summaries</p>
            </div>
            <Switch defaultChecked={true} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">AI Insights</p>
              <p className="text-xs text-muted-foreground">Performance insights and tips</p>
            </div>
            <Switch defaultChecked={true} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Recovery Alerts</p>
              <p className="text-xs text-muted-foreground">Rest day recommendations</p>
            </div>
            <Switch defaultChecked={false} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;