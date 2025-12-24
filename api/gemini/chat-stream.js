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

    // generateContentStream APIを使用
    const stream = await genAI.models.generateContentStream({
      model,
      contents,
      config,
    });

    // ストリーミング応答
    for await (const chunk of stream) {
      console.log('📦 Stream chunk:', JSON.stringify(chunk));
      const chunkText = chunk.text || '';
      const usage = chunk.usageMetadata;

      if (chunkText) {
        res.write(
          `data: ${JSON.stringify({ text: chunkText, usageMetadata: usage })}\n\n`
        );
      }
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
