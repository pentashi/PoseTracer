// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import admin from 'firebase-admin';
import { buildWorkoutPrompt } from './utils/promptBuilder.js';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

dotenv.config();

// --------------------
// 🔥 Initialize Firebase Admin
// --------------------
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// --------------------
// ⚙️ Express Setup
// --------------------
const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  next();
});

// --------------------
// 🧠 Groq Setup
// --------------------
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

if (!GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY missing from environment.');
  process.exit(1);
}

// --------------------
// 💬 Chat Endpoint
// --------------------
async function getChatHistory(userId) {
  const chatRef = db.collection('users').doc(userId).collection('chatHistory');
  const snapshot = await chatRef.orderBy('timestamp', 'asc').get();
  return snapshot.docs.map(doc => doc.data());
}

async function getUserProfile(userId) {
  const userRef = db.collection('users').doc(userId);
  const userSnap = await userRef.get();
  return userSnap.exists ? userSnap.data() : {};
}

app.post('/chat', async (req, res) => {
  console.log('🛰️ /chat hit:', new Date().toISOString());
  const { message, userId } = req.body;

  if (!message || !userId)
    return res.status(400).json({ error: 'Missing message or userId' });

  try {
    const history = await getChatHistory(userId);
    const profile = await getUserProfile(userId);

    const messages = [
      {
        role: 'system',
        content: `You're ACHAPI, an elite hybrid strength & aesthetics fitness coach.
Use this user profile to personalize your advice:
${JSON.stringify(profile, null, 2)}
Always remember chat history and speak confidently.`,
      },
      ...history.map(h => ({
        role: h.type === 'ai' ? 'assistant' : 'user',
        content: h.message,
      })),
      { role: 'user', content: message },
    ];

    const payload = {
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.9,
      max_tokens: 1000,
    };

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response from AI';

    await db.collection('users').doc(userId).collection('chatHistory').add({
      type: 'ai',
      message: reply,
      timestamp: Date.now(),
    });

    res.json({ reply });
  } catch (err) {
    console.error('🔥 /chat error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// --------------------
// 🏋️ Workout Endpoint
// --------------------
app.post('/generate-workout', async (req, res) => {
  const { profile } = req.body;
  if (!profile) return res.status(400).json({ error: 'Profile is required' });

  try {
    const prompt = buildWorkoutPrompt(profile);
    const payload = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: "You're ACHAPI, an elite hybrid strength & aesthetics fitness coach. Give personalized workout + nutrition plans.",
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    };

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '';
    let workoutPlan;

    try {
      workoutPlan = JSON.parse(reply);
    } catch {
      workoutPlan = { text: reply };
    }

    res.json({ workoutPlan });
  } catch (err) {
    console.error('🔥 /generate-workout error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// --------------------
// 🚀 Start Server
// --------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Groq AI Coach running at http://0.0.0.0:${PORT}`);
});
