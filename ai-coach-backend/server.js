// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildWorkoutPrompt } from './utils/promptBuilder.js';

// --------------------
// 🌍 Environment Setup
// --------------------
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------
// 🔥 Firebase Setup
// --------------------
let serviceAccount;

try {
  const keyPath = path.join(__dirname, 'serviceAccountKey.json');
  if (!fs.existsSync(keyPath)) throw new Error('serviceAccountKey.json not found.');

  const rawData = fs.readFileSync(keyPath, 'utf8');
  serviceAccount = JSON.parse(rawData);
} catch (err) {
  console.error('❌ Could not load Firebase service account:', err.message);
  process.exit(1);
}

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
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

app.use((req, _, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// --------------------
// 🧠 Groq Setup
// --------------------
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

if (!GROQ_API_KEY) {
  console.error('❌ Missing GROQ_API_KEY in .env');
  process.exit(1);
}

// --------------------
// 🔹 Helper Functions
// --------------------
async function getChatHistory(userId) {
  const chatRef = db.collection('users').doc(userId).collection('chatHistory');
  const snapshot = await chatRef.orderBy('timestamp', 'asc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function getUserProfile(userId) {
  const userRef = db.collection('users').doc(userId);
  const userSnap = await userRef.get();
  return userSnap.exists ? userSnap.data() : {};
}

// --------------------
// 💬 Chat Endpoint
// --------------------
// 💬 Chat Endpoint (fixed today alignment)
app.post('/chat', async (req, res) => {
  const { message, userId } = req.body;
  if (!message || !userId) return res.status(400).json({ error: 'Missing message or userId' });

  try {
    const history = await getChatHistory(userId);
    const profile = await getUserProfile(userId);

    // Compute todayKey based on user's workoutPlan
    const weeklySchedule = profile.workoutPlan?.weeklySchedule || {};
    const dayKeys = Object.keys(weeklySchedule).sort(
      (a, b) => parseInt(a.replace(/\D/g, ''), 10) - parseInt(b.replace(/\D/g, ''), 10)
    );
    const todayIndex = (new Date().getDay() + 6) % 7; // JS Sunday=0 → Monday=0
    const todayKey = dayKeys[todayIndex];

    // System message includes today info
    const systemMessage = {
      role: 'system',
      content: `You're ACHAPI — an elite hybrid strength & aesthetics coach.
Use this user profile for context:
${JSON.stringify(profile, null, 2)}

Today is ${todayKey} (according to user's schedule). 
Always answer using the correct day and exercises for today. Be confident and specific.`
    };

    // Build messages for AI
    const messages = [
      systemMessage,
      ...history.map(h => ({
        role: h.type === 'ai' ? 'assistant' : 'user',
        content: h.message,
      })),
      { role: 'user', content: message },
    ];

    // Call Groq AI
    const payload = { model: 'llama-3.3-70b-versatile', messages, temperature: 0.9, max_tokens: 1000 };
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response from AI.';

    // Save AI reply to Firestore
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
  if (!profile) return res.status(400).json({ error: 'Profile is required.' });

  try {
    const prompt = buildWorkoutPrompt(profile);
    const payload = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: "You're ACHAPI, an elite hybrid coach. Create a deeply personalized workout and nutrition plan." },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    };

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    let workoutPlan;
    try { workoutPlan = JSON.parse(data.choices?.[0]?.message?.content || '{}'); } 
    catch { workoutPlan = { text: data.choices?.[0]?.message?.content || '' }; }

    res.json({ workoutPlan });
  } catch (err) {
    console.error('🔥 /generate-workout error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// --------------------
// 📜 Chat History Endpoint
// --------------------
app.get('/chat-history', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const chatRef = db.collection('users').doc(userId).collection('chatHistory');
    const snapshot = await chatRef.orderBy('timestamp', 'asc').get();
    const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ history });
  } catch (err) {
    console.error('🔥 /chat-history Firestore error:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// --------------------
// 🧹 Clear Chat Endpoint
// --------------------
app.post('/clear-chat', async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const chatRef = db.collection('users').doc(userId).collection('chatHistory');
    const snapshot = await chatRef.get();

    const batch = db.batch();
    snapshot.docs.forEach(docSnap => batch.delete(docSnap.ref));
    await batch.commit();

    res.json({ success: true });
  } catch (err) {
    console.error('🔥 /clear-chat error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// --------------------
// 🚀 Start Server
// --------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AI Coach backend running at http://0.0.0.0:${PORT}`);
});
