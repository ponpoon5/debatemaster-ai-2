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
    const { model, contents, config } = req.body;

    if (!model || !contents) {
      return res.status(400).json({ error: 'model and contents are required' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const result = await genAI.models.generateContent({
      model,
      contents,
      config,
    });

    return res.status(200).json({
      text: result.text,
      usageMetadata: result.usageMetadata,
    });
  } catch (error: unknown) {
    console.error('Gemini API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Failed to generate content',
      message: errorMessage,
    });
  }
}
