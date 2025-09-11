import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Mic, Camera, BarChart3, Zap, Heart, Target } from 'lucide-react';
import aiCoachAvatar from '@/assets/ai-coach-avatar.png';

const AIChat = () => {
  const [inputMessage, setInputMessage] = useState('');
  
  const chatHistory = [
    {
      type: 'ai',
      message: "Hello Alex! I've analyzed your last workout. Your squat form improved by 15% compared to last week. Ready for today's session?",
      timestamp: '9:45 AM',
      insights: ['Form Analysis', 'Progress Tracking']
    },
    {
      type: 'user',
      message: "Yes! But I'm feeling a bit tired today. Should I adjust the intensity?",
      timestamp: '9:46 AM'
    },
    {
      type: 'ai',
      message: "Based on your HRV data from last night, I recommend reducing intensity by 20%. Your body is still recovering from Tuesday's deadlift session. Let's focus on mobility and lighter weights today.",
      timestamp: '9:47 AM',
      insights: ['HRV Analysis', 'Recovery Optimization']
    },
    {
      type: 'user',
      message: "That makes sense. What about my nutrition today?",
      timestamp: '9:48 AM'
    },
    {
      type: 'ai',
      message: "Perfect timing! You're 15g short on protein for muscle recovery. I suggest adding a post-workout shake with 25g whey protein. Also, your hydration is optimal - great job!",
      timestamp: '9:49 AM',
      insights: ['Nutrition Tracking', 'Hydration Status']
    },
    {
      type: 'user',
      message: "Can you show me the pose correction for my bench press?",
      timestamp: '9:50 AM'
    },
    {
      type: 'ai',
      message: "Absolutely! I've noticed you're lowering the bar 2 inches too high on your chest. Here's the correction: Lower to nipple line, pause for 1 second, then press. This will engage your pecs 30% more effectively.",
      timestamp: '9:51 AM',
      insights: ['Pose Analysis', 'Muscle Activation']
    }
  ];

  const quickPrompts = [
    { text: "Analyze my form", icon: Camera },
    { text: "Progress check", icon: BarChart3 },
    { text: "Modify workout", icon: Zap },
    { text: "Nutrition advice", icon: Heart },
    { text: "Set new goal", icon: Target }
  ];

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      // In a real app, this would send to the AI
      setInputMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-darker to-background p-4">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <img 
            src={aiCoachAvatar} 
            alt="AI Coach"
            className="w-12 h-12 rounded-full ai-glow"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-green rounded-full border-2 border-cyber-dark"></div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neon-purple">AI Fitness Coach</h1>
          <p className="text-sm text-neon-blue">Online • Analyzing your performance</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {chatHistory.map((msg, idx) => (
          <Card key={idx} className={`p-4 ${
            msg.type === 'ai' 
              ? 'cyber-card ml-0 mr-12' 
              : 'bg-neon-purple/20 border-neon-purple ml-12 mr-0'
          }`}>
            <div className="flex items-start space-x-3">
              {msg.type === 'ai' && (
                <img 
                  src={aiCoachAvatar} 
                  alt="AI"
                  className="w-8 h-8 rounded-full"
                />
              )}
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">
                    {msg.type === 'ai' ? 'AI Coach' : 'You'}
                  </span>
                  <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                </div>
                
                <p className="text-sm text-white mb-2">{msg.message}</p>
                
                {msg.insights && (
                  <div className="flex flex-wrap gap-2">
                    {msg.insights.map((insight, i) => (
                      <Badge 
                        key={i}
                        className="bg-neon-blue/20 text-neon-blue border-neon-blue/30"
                      >
                        {insight}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3">Quick actions:</p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <Button 
              key={idx}
              variant="ghost_cyber" 
              size="sm"
              className="text-xs"
            >
              <prompt.icon className="w-3 h-3 mr-1" />
              {prompt.text}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <Card className="cyber-card p-4">
        <div className="flex space-x-2">
          <Button variant="cyber" size="icon">
            <Mic className="h-4 w-4" />
          </Button>
          
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask your AI coach anything..."
            className="flex-1 bg-cyber-light border-neon-blue/30 text-white placeholder:text-muted-foreground"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          
          <Button variant="ai" onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>Voice input available</span>
          <span className="text-neon-green">AI is learning your patterns</span>
        </div>
      </Card>

      {/* AI Status */}
      <Card className="cyber-card p-4 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">AI Analysis Status</h3>
            <p className="text-sm text-muted-foreground">Real-time performance monitoring</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 bg-neon-green rounded-full ai-glow"></div>
              <span className="text-sm text-neon-green">Active</span>
            </div>
            <p className="text-xs text-muted-foreground">127 workouts analyzed</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIChat;