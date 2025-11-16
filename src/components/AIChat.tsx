import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, addDoc, query, orderBy, onSnapshot, getDocs, writeBatch, doc 
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Mic, Camera, BarChart3, Zap, Heart, Target, Trash2, ChevronDown } from 'lucide-react';
import aiCoachAvatar from '@/assets/ai-coach-avatar.png';

const quickPrompts = [
  { text: "Analyze my form", icon: Camera },
  { text: "Progress check", icon: BarChart3 },
  { text: "Modify workout", icon: Zap },
  { text: "Nutrition advice", icon: Heart },
  { text: "Set new goal", icon: Target }
];

// Welcome messages marked as AI messages
const initialWelcomeMessages = [
  {
    type: 'ai',
    message: '👋 Hi there! I’m ACHAPI your AI Fitness Coach. Start by asking me anything or try a quick action below!',
    timestamp: Date.now(),
    insights: [],
  },
  {
    type: 'ai',
    message: '💡 Tip: Use "Analyze my form" after your next exercise for instant feedback.',
    timestamp: Date.now() + 1,
    insights: [],
  }
];

const AIChat: React.FC = () => {
  const { user, loading } = useAuth();
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [aiTyping, setAiTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatRefDiv = useRef<HTMLDivElement>(null);

  // -------------------
  // Initialize chat & listen for updates
  // -------------------
  useEffect(() => {
    if (!user) return;
    const chatRef = collection(db, 'users', user.uid, 'chatHistory');

    // initialize welcome messages once
    const initMessages = async () => {
      const snapshot = await getDocs(chatRef);
      if (snapshot.empty) {
        const batch = writeBatch(db);
        initialWelcomeMessages.forEach(msg => batch.set(doc(chatRef), msg));
        await batch.commit();
      }
    };
    initMessages();

    // Listen to chat updates
    const q = query(chatRef, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // deduplicate by ID
      const uniqueMessages = messages.filter((v,i,a) => a.findIndex(x => x.id === v.id) === i);
      setChatHistory(uniqueMessages);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // -------------------
  // Scroll handling
  // -------------------
  useEffect(() => {
    const chatDiv = chatRefDiv.current;
    if (!chatDiv) return;

    const handleScroll = () => {
      const nearBottom = chatDiv.scrollHeight - chatDiv.scrollTop - chatDiv.clientHeight < 100;
      setShowScrollButton(!nearBottom);
    };

    chatDiv.addEventListener('scroll', handleScroll);
    return () => chatDiv.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    chatRefDiv.current?.scrollTo({ top: chatRefDiv.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, aiTyping]);

  // -------------------
  // Send user message
  // -------------------
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user || aiTyping) return; 
  setAiTyping(true);

  const chatRef = collection(db, 'users', user.uid, 'chatHistory');
  const messageToSend = inputMessage;
  setInputMessage('');

  try {
    // Save user message
    await addDoc(chatRef, { type: 'user', message: messageToSend, timestamp: Date.now(), insights: [] });

    // Fetch AI reply
    const res = await fetch('http://localhost:4000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: messageToSend, userId: user.uid })
    });

    if (!res.ok) { console.error(await res.text()); setAiTyping(false); return; }

    const data = await res.json();
    const aiReply = data.reply || 'No response from AI';

    // Fetch latest message to check for duplication
    const latestSnapshot = await query(collection(db, 'users', user.uid, 'chatHistory'), orderBy('timestamp', 'desc'));
    const latestDocs = await getDocs(latestSnapshot);
    const latestMsg = latestDocs.docs[0]?.data();

    if (latestMsg?.type !== 'ai' || latestMsg?.message !== aiReply) {
      await addDoc(chatRef, { type: 'ai', message: aiReply, timestamp: Date.now(), insights: [] });
    }

  } catch (err) {
    console.error(err);
  } finally {
    setAiTyping(false);
  }
};


  // -------------------
  // Clear chat
  // -------------------
  const handleClearChat = async () => {
    if (!user) return;
    if (!confirm('Are you sure you want to clear the chat?')) return;

    const chatRef = collection(db, 'users', user.uid, 'chatHistory');
    const snapshot = await getDocs(chatRef);
    const batch = writeBatch(db);
    snapshot.docs.forEach(docSnap => batch.delete(docSnap.ref));
    await batch.commit();

    // Reset with welcome messages
    const batch2 = writeBatch(db);
    initialWelcomeMessages.forEach(msg => batch2.set(doc(chatRef), msg));
    await batch2.commit();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-darker to-background p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img src={aiCoachAvatar} alt="AI Coach" className="w-12 h-12 rounded-full ai-glow" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-green rounded-full border-2 border-cyber-dark"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neon-purple">AI Fitness Coach</h1>
            <p className="text-sm text-neon-blue">Online • Analyzing your performance</p>
          </div>
        </div>
        <Button variant="destructive" size="icon" onClick={handleClearChat}><Trash2 className="w-4 h-4" /></Button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 mb-6 overflow-y-auto max-h-[60vh] relative" ref={chatRefDiv}>
        {chatHistory.map((msg) => (
          <Card key={msg.id} className={`p-4 animate-fadeIn mb-4 ${msg.type==='ai'?'cyber-card ml-0 mr-12':'bg-neon-purple/20 border-neon-purple ml-12 mr-0'}`}>
            <div className="flex items-start space-x-3">
              {msg.type==='ai' && <img src={aiCoachAvatar} alt="AI" className="w-8 h-8 rounded-full"/>}
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-white">{msg.type==='ai'?'AI Coach':'You'}</span>
                  <span className="text-xs text-muted-foreground">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-sm text-white mb-2">{msg.message}</p>
                {msg.insights?.length > 0 &&
                  <div className="flex flex-wrap gap-2">
                    {msg.insights.map((ins,i) => <Badge key={i} className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">{ins}</Badge>)}
                  </div>
                }
              </div>
            </div>
          </Card>
        ))}
        {aiTyping && <div className="text-neon-blue italic text-sm flex items-center animate-pulse">AI Coach is typing...</div>}
      </div>

      {/* Scroll-to-bottom button */}
      {showScrollButton && (
        <Button onClick={scrollToBottom} variant="outline" size="sm" className="fixed bottom-24 right-6 rounded-full shadow-lg p-2 z-50">
          <ChevronDown className="w-5 h-5 animate-bounce"/>
        </Button>
      )}

      {/* Quick Prompts */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Quick actions:</p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <Button key={idx} variant="ghost_cyber" size="sm" className="text-xs hover:scale-105 transition-transform" onClick={()=>setInputMessage(prompt.text)}>
              <prompt.icon className="w-3 h-3 mr-1"/>
              {prompt.text}
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <Card className="cyber-card p-4 flex-shrink-0">
        <div className="flex space-x-2">
          <Button variant="cyber" size="icon"><Mic className="h-4 w-4"/></Button>
          <Input
            value={inputMessage}
            onChange={(e)=>setInputMessage(e.target.value)}
            placeholder="Ask your AI coach anything..."
            className="flex-1 bg-cyber-light border-neon-blue/30 text-white placeholder:text-muted-foreground"
            onKeyPress={(e)=>e.key==='Enter' && handleSendMessage()}
          />
          <Button variant="ai" onClick={handleSendMessage}><Send className="h-4 w-4"/></Button>
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>Voice input available</span>
          <span className="text-neon-green">AI is learning your patterns</span>
        </div>
      </Card>
    </div>
  );
};

export default AIChat;
