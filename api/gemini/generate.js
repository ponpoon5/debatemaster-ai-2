import { GoogleGenAI } from '@google/genai';
import { rateLimit, getClientIp } from '../_middleware/rate-limit.js';
import { setCorsHeaders } from '../_middleware/cors.js';
import { validateGenerateRequest } from '../_middleware/validate.js';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
  // CORS
  if (setCorsHeaders(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const clientIp = getClientIp(req);
  if (!rateLimit(clientIp, 100, 60000)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  try {
    const { model, contents, config } = req.body;

    // Input validation
    const validation = validateGenerateRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
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
