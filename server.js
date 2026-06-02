const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { CohereClient } = require('cohere-ai'); // ✅ NEW import

dotenv.config();

const app = express();
app.use(express.static(__dirname));
app.use(express.json());

// ✅ Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// ✅ Chatbot API endpoint using Cohere
app.post('/api/chat', async (req, res) => {
  const message = req.body?.message;
  console.log("🟡 Incoming message:", message);

  if (!message || typeof message !== 'string') {
    console.log("❌ Invalid input:", req.body);
    return res.status(400).json({ error: 'Invalid message format' });
  }

  try {
    const response = await cohere.generate({
      model: 'command',
      prompt: `You are a friendly fashion store assistant. Help the user:\n${message}`,
      maxTokens: 100,
      temperature: 0.8,
    });

    const reply = response.generations?.[0]?.text?.trim();
    console.log("🟢 Cohere reply:", reply);

    res.json({ reply: reply || "⚠️ No response from Cohere." });
  } catch (err) {
    console.error("🔥 Cohere error:", err.message || err);
    res.status(500).json({ error: 'Cohere API failed' });
  }
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/emotion', (req, res) => {
  res.sendFile(path.join(__dirname, 'emotion.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
