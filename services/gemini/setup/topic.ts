import { Type, Schema } from '@google/genai';
import { ai } from '../client';
import { MODEL_NAME } from '../../../core/config/gemini.config';
import { DebateType, TokenUsage } from '../../../core/types';
import { cleanText } from '../utils/text-cleaner';
import { extractUsage } from '../utils/token-usage';
import { getRandomTopicPrompt, getTopicSuggestionsPrompt } from '../prompts/setup/topic';
import { parseApiError } from '../../../core/utils/error-parser';

export const generateRandomTopic = async (
  type?: DebateType
): Promise<{ topic: string; usage: TokenUsage }> => {
  const prompt = getRandomTopicPrompt(type);

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    return {
      topic: cleanText(response.text || ''),
      usage: extractUsage(response),
    };
  } catch (error) {
    console.error('Failed to generate topic:', error);
    return {
      topic: 'AIは人間の仕事を奪うか', // Fallback topic
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};

export const generateTopicSuggestions = async (
  type?: DebateType
): Promise<{ topics: string[]; usage: TokenUsage }> => {
  const prompt = getTopicSuggestionsPrompt(type);

  const schema: Schema = {
    type: Type.ARRAY,
    items: { type: Type.STRING },
    description: '5 distinct debate topics',
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const usage = extractUsage(response);

    if (response.text) {
      const cleaned = cleanText(response.text);
      const topics = JSON.parse(cleaned) as string[];
      return { topics, usage };
    }
    throw new Error('No response text');
  } catch (error) {
    console.error('Failed to generate suggested topics:', error);
    // Fallback to a static subset if API fails
    return {
      topics: [
        '選挙権の定年制を導入すべきか',
        '出生前診断を無条件で認めるべきか',
        'AIに著作権を認めるべきか',
        'ペット売買を禁止すべきか',
        'ギャンブルを完全に違法化すべきか',
        '週休3日制を法制化すべきか',
        '大学の学費を完全無償化すべきか',
        '救急車を有料化すべきか',
      ],
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};
