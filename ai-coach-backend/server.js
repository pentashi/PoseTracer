import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { buildWorkoutPrompt } from './utils/promptBuilder.js';
dotenv.config();
const app = express();

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url} from ${req.ip}`);
  next();
});

// Explicit CORS config: allow all origins and relevant headers/methods
app.use(cors({
  origin: '*', // For testing only — open to all origins
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

if (!GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY is not set. Check your .env file.');
  process.exit(1);
}

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    console.warn('⚠️ Invalid message received:', message);
    return res.status(400).json({ error: 'Invalid input message.' });
  }

  try {
    const payload = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            "You're ACHAPI, an elite hybrid strength & aesthetics fitness coach. Motivate the user, break down concepts, and give real workout/nutrition advice. Be real, bold, and specific.",
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.9,
      max_tokens: 1000,
    };

    console.log('➡️ Sending to Groq API:', JSON.stringify(payload, null, 2));

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
      console.error('❌ Groq API error response:', response.status, data);
      return res.status(500).json({
        error: 'Groq API error',
        status: response.status,
        details: data,
      });
    }

    const reply = data.choices?.[0]?.message?.content || 'No response from AI';
    console.log('✅ Groq reply:', reply);

    res.json({ reply });
  } catch (err) {
    console.error('🔥 Unexpected server error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
app.post('/generate-workout', async (req, res) => {
  const profile = req.body.profile;
  if (!profile) return res.status(400).json({ error: 'Profile is required' });

  try {
    const prompt = buildWorkoutPrompt(profile);

    const payload = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: "You're ACHAPI, an elite hybrid strength & aesthetics fitness coach. Motivate the user, break down concepts, and give real workout/nutrition advice. Be real, bold, and specific." },
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
      console.error('Groq API error:', response.status, data);
      return res.status(500).json({ error: 'Groq API error', details: data });
    }

    const reply = data.choices?.[0]?.message?.content || '';

    let workoutPlan;
    try {
      workoutPlan = JSON.parse(reply);
    } catch (err) {
      console.error('JSON parse error:', err);
      return res.status(500).json({ error: 'Invalid JSON from AI', details: reply });
    }

    res.json({ workoutPlan });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;

// Listen on all network interfaces, so your mobile can reach it
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Groq AI Coach running at http://0.0.0.0:${PORT}`);
});
