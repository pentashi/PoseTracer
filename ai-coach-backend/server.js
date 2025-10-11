// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import admin from 'firebase-admin';
import { buildWorkoutPrompt } from './utils/promptBuilder.js';

dotenv.config();

// --------------------
// 🔥 Initialize Firebase Admin (ENV-based, no JSON file)
// --------------------
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN || 'googleapis.com',
};

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

// Log requests
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url} from ${req.ip}`);
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
  return snapshot.docs.map((doc) => doc.data());
}

async function getUserProfile(userId) {
  const userRef = db.collection('users').doc(userId);
  const userSnap = await userRef.get();
  return userSnap.exists ? userSnap.data() : {};
}

app.post('/chat', async (req, res) => {
  console.log('🛰️ Received /chat request:', new Date().toISOString());
  const { message, userId } = req.body;

  if (!message || typeof message !== 'string')
    return res.status(400).json({ error: 'Invalid message.' });
  if (!userId || typeof userId !== 'string')
    return res.status(400).json({ error: 'userId is required.' });

  try {
    const history = await getChatHistory(userId);
    const profile = await getUserProfile(userId);

    const messages = [
      {
        role: 'system',
        content: `You're ACHAPI, an elite hybrid strength & aesthetics fitness coach.
Use this user profile to personalize your advice:
${JSON.stringify(profile, null, 2)}
Always remember the chat history and speak naturally, confidently, and motivationally.`,
      },
      ...history.map((h) => ({
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

    if (!response.ok) {
      console.error('❌ Groq API error:', data);
      return res.status(500).json({ error: 'Groq API error', details: data });
    }

    const reply = data.choices?.[0]?.message?.content || 'No response from AI';
    console.log('✅ Groq reply:', reply);

    // Save to Firestore if not duplicate
    const chatRef = db.collection('users').doc(userId).collection('chatHistory');
    const lastMessages = await chatRef.orderBy('timestamp', 'desc').limit(1).get();
    const lastMsg = lastMessages.docs[0]?.data();

    if (!lastMsg || lastMsg.message !== reply) {
      await chatRef.add({
        type: 'ai',
        message: reply,
        timestamp: Date.now(),
      });
    }

    res.json({ reply });
  } catch (err) {
    console.error('🔥 Server error in /chat:', err);
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
          content:
            "You're ACHAPI, an elite hybrid strength & aesthetics fitness coach. Provide powerful, actionable, detailed workout and nutrition advice tailored to the user.",
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

    if (!response.ok) {
      console.error('❌ Groq API error (workout):', data);
      return res.status(500).json({ error: 'Groq API error', details: data });
    }

    const reply = data.choices?.[0]?.message?.content || '';
    let workoutPlan;
    try {
      workoutPlan = JSON.parse(reply);
    } catch {
      workoutPlan = { text: reply }; // fallback if AI doesn’t return JSON
    }

    res.json({ workoutPlan });
  } catch (err) {
    console.error('🔥 Server error (workout):', err);
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
