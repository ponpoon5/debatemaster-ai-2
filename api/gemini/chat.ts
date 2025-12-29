import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY || '' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORSヘッダー設定
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://debatemaster-ai-2.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
  ];

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // OPTIONSリクエスト（プリフライト）への対応
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { model, history, message, config } = req.body;

    if (!model || !message) {
      return res.status(400).json({ error: 'model and message are required' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    // chats APIを使用してチャットセッションを作成
    const chat = genAI.chats.create({
      model,
      history: history || [],
      config,
    });

    // sendMessage expects { message: string } object format
    const result = await chat.sendMessage({ message });

    return res.status(200).json({
      text: result.text,
      usageMetadata: result.usageMetadata,
    });
  } catch (error: unknown) {
    console.error('Gemini Chat API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Failed to send chat message',
      message: errorMessage,
    });
  }
}
