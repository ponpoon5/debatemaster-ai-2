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

    // チャット履歴を含むcontentsを構築
    const contents = [...(history || [])];

    // 最新のメッセージを追加
    if (typeof message === 'string') {
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });
    } else {
      contents.push(message);
    }

    // generateContent APIを使用
    const result = await genAI.models.generateContent({
      model,
      contents,
      config,
    });

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
