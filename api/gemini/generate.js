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

    const result = await genAI.models.generateContent({
      model,
      contents,
      config,
    });

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

    res.status(200).json({
      text: text,
      usageMetadata: result.usageMetadata,
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: 'Failed to generate content',
      message: error.message,
    });
  }
}
