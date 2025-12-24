import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { model, history, message, config } = req.body;

    if (!model || !message) {
      return res.status(400).json({ error: 'model and message are required' });
    }

    // Google Gemini API v1.30.0 の正しいAPI使用
    const generativeModel = genAI.getGenerativeModel(model);
    const chat = generativeModel.startChat({
      history: history || [],
      config,
    });

    const result = await chat.sendMessage(message);

    res.status(200).json({
      text: result.text,
      usageMetadata: result.usageMetadata,
    });
  } catch (error) {
    console.error('Gemini Chat API Error:', error);
    res.status(500).json({
      error: 'Chat request failed',
      message: error.message,
    });
  }
}
