import { Type, Schema } from '@google/genai';
import { ai } from '../client';
import { MODEL_NAME } from '../../../core/config/gemini.config';
import { ArgumentAnalysis, TokenUsage } from '../../../core/types';
import { cleanText } from '../utils/text-cleaner';
import { extractUsage } from '../utils/token-usage';
import { getFactCheckPrompt } from '../prompts/analysis/fact-check';
import { parseApiError } from '../../../core/utils/error-parser';

export const analyzeFactOpinion = async (
  text: string
): Promise<{ analysis: ArgumentAnalysis; usage: TokenUsage }> => {
  const prompt = getFactCheckPrompt(text);

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      segments: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['fact', 'opinion', 'neutral'] },
          },
          required: ['text', 'type'],
        },
      },
      factRatio: { type: Type.NUMBER },
      opinionRatio: { type: Type.NUMBER },
    },
    required: ['segments', 'factRatio', 'opinionRatio'],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });
    const usage = extractUsage(response);
    if (response.text) {
      const cleaned = cleanText(response.text);
      return { analysis: JSON.parse(cleaned) as ArgumentAnalysis, usage };
    }
    throw new Error('No text response');
  } catch (error) {
    const apiError = parseApiError(error);
    console.error('Fact-check analysis failed:', apiError);
    return {
      analysis: { segments: [{ text, type: 'neutral' }], factRatio: 0, opinionRatio: 0 },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};
