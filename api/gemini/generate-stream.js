import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
      // chunk.candidates[0].content.parts[0].text から取得
      const chunkText = chunk.candidates?.[0]?.content?.parts?.[0]?.text || '';
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
    console.error('Gemini Streaming API Error:', error);
    res.write(
      `data: ${JSON.stringify({ error: 'Stream failed', message: error.message })}\n\n`
    );
    res.end();
  }
}
