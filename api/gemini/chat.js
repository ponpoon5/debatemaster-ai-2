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

    // Google Gemini API v1.34.0 の正しいAPI使用
    const chat = genAI.chats.create({
      model,
      history: history || [],
      config,
    });

    // message を ContentUnion 形式に変換
    const content = typeof message === 'string'
      ? { role: 'user', parts: [{ text: message }] }
      : message;

    const result = await chat.sendMessage(content);

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
