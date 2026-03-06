import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure we find the .env file in the root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = 3001;

// Load the key and clean it
const GROQ_KEY = (process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || "").trim();

console.log("--- Groq AI Proxy Boot ---");
if (GROQ_KEY) {
  console.log(`✅ Groq Key Loaded (starts with: ${GROQ_KEY.substring(0, 10)}...)`);
} else {
  console.error("❌ ERROR: GROQ_API_KEY is missing from .env. Check your root folder.");
}

// Improved CORS for local development
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());

app.post('/api/interrogate', async (req, res) => {
  if (!GROQ_KEY) {
    return res.status(500).json({ error: "Groq API Key missing on server" });
  }

  const { messages, systemPrompt } = req.body;

  // FIX 1: Don't map to a string! Send the structured array.
  // Groq (and OpenAI) need the actual array of objects to understand context.
  const structuredMessages = [
    { role: 'system', content: systemPrompt || "You are a helpful detective assistant." },
    ...messages
  ];

  try {
    // FIX 2: Correct URL (api.groq.com/openai/v1/chat/completions)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        // FIX 3: Use a real model (llama-3.3-70b-versatile or llama-3.1-8b-instant)
        model: 'llama-3.3-70b-versatile', 
        messages: structuredMessages,
        temperature: 0.7,
        max_tokens: 500, // Note: standard param is 'max_tokens', not 'max_output_tokens'
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API Error:", data.error?.message || data);
      return res.status(response.status).json(data);
    }

    // FIX 4: Correct path for OpenAI-compatible response
    const text = data.choices?.[0]?.message?.content || '';
    return res.json({ text });

  } catch (err) {
    console.error("Critical Proxy Failure:", err.message);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Detective Proxy active at http://localhost:${PORT}`);
});