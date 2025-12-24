import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3000;

// CORS設定（開発環境ではlocalhost全て許可、本番では環境変数使用）
app.use(
  cors({
    origin: (origin, callback) => {
      // 開発環境ではlocalhost全て許可
      if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        callback(null, true);
      } else if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
        callback(null, true);
      } else if (process.env.NODE_ENV === 'production' && process.env.CLIENT_URL) {
        callback(null, origin === process.env.CLIENT_URL);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));

// APIキーの確認
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// ヘルスチェック
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Gemini APIプロキシエンドポイント（非ストリーミング）
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { model, contents, config } = req.body;

    if (!model || !contents) {
      return res.status(400).json({ error: 'model and contents are required' });
    }

    const result = await genAI.models.generateContent({
      model,
      contents,
      config,
    });

    res.json({
      text: result.text,
      usageMetadata: result.usageMetadata,
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: 'Failed to generate content',
      message: error.message,
    });
  }
});

// Gemini APIプロキシエンドポイント（ストリーミング）
app.post('/api/gemini/generate-stream', async (req, res) => {
  try {
    const { model, contents, config } = req.body;

    if (!model || !contents) {
      return res.status(400).json({ error: 'model and contents are required' });
    }

    // SSE用のヘッダー設定
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await genAI.models.generateContentStream({
      model,
      contents,
      config,
    });

    // ストリーミング応答
    for await (const chunk of stream) {
      const chunkText = chunk.text;
      const usage = chunk.usageMetadata;

      res.write(
        `data: ${JSON.stringify({ text: chunkText, usageMetadata: usage })}\n\n`
      );
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Gemini Streaming API Error:', error);
    res.write(
      `data: ${JSON.stringify({ error: 'Stream failed', message: error.message })}\n\n`
    );
    res.end();
  }
});

// Chatセッション用プロキシ（ストリーミング）
app.post('/api/gemini/chat-stream', async (req, res) => {
  try {
    const { model, history, message, config } = req.body;

    if (!model || !message) {
      return res.status(400).json({ error: 'model and message are required' });
    }

    // SSE用のヘッダー設定
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const generativeModel = genAI.getGenerativeModel(model);
    const chat = generativeModel.startChat({
      history: history || [],
      config,
    });

    const stream = await chat.sendMessageStream(message);

    // ストリーミング応答
    for await (const chunk of stream) {
      const chunkText = chunk.text;
      const usage = chunk.usageMetadata;

      res.write(
        `data: ${JSON.stringify({ text: chunkText, usageMetadata: usage })}\n\n`
      );
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Gemini Chat Streaming API Error:', error);
    res.write(
      `data: ${JSON.stringify({ error: 'Chat stream failed', message: error.message })}\n\n`
    );
    res.end();
  }
});

app.listen(port, () => {
  console.log(`🚀 Proxy server running on port ${port}`);
  console.log(`   Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});
