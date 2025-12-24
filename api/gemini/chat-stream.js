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

    // SSE用のヘッダー設定
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

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

    const stream = await chat.sendMessageStream(content);

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
}
