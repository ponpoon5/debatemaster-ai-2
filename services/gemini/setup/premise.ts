import { Type, Schema } from '@google/genai';
import { ai } from '../client';
import { MODEL_NAME } from '../../../core/config/gemini.config';
import { PremiseData, TokenUsage } from '../../../core/types';
import { cleanText } from '../utils/text-cleaner';
import { extractUsage } from '../utils/token-usage';
import { getPremisePrompt } from '../prompts/setup/premise';
import { parseApiError } from '../../../core/utils/error-parser';

export const generatePremiseProposal = async (
  topic: string
): Promise<{ data: PremiseData; usage: TokenUsage }> => {
  const prompt = getPremisePrompt(topic);

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      definitions: { type: Type.STRING },
      goal: { type: Type.STRING },
    },
    required: ['definitions', 'goal'],
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
      return { data: JSON.parse(cleaned) as PremiseData, usage };
    }
    throw new Error('No text response');
  } catch (error) {
    const apiError = parseApiError(error);
    console.error('premise failed:', apiError);
    return {
      data: { definitions: '用語の定義を明確にする', goal: '多角的な視点から検討する' },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};
