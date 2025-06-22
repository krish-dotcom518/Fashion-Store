require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',  // Or use 'gpt-4' if you have access
      messages: [
        { role: 'system', content: 'You are a helpful assistant for a fashion store website.' },
        { role: 'user', content: userMessage }
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ OpenAI Chatbot API running on http://localhost:${PORT}`);
});
