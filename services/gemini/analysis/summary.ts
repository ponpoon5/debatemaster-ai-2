import { Type, Schema } from '@google/genai';
import { ai } from '../client';
import { MODEL_NAME } from '../../../core/config/gemini.config';
import { Message, TokenUsage } from '../../../core/types';
import { cleanText } from '../utils/text-cleaner';
import { extractUsage } from '../utils/token-usage';
import { getSummaryPrompt } from '../prompts/analysis/summary';
import { parseApiError } from '../../../core/utils/error-parser';
import { streamJsonContent } from '../utils/streaming-helpers';

export const getDebateSummary = async (
  topic: string,
  history: Message[]
): Promise<{ points: string[]; usage: TokenUsage }> => {
  const transcript = history
    .map(msg => `${msg.role === 'user' ? 'User' : 'Opponent'}: ${msg.text}`)
    .join('\n');

  const prompt = getSummaryPrompt(topic, transcript);

  const schema: Schema = {
    type: Type.ARRAY,
    items: { type: Type.STRING },
    description: 'List of current debate points',
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
      const points = JSON.parse(cleaned) as string[];
      return { points, usage };
    }
    throw new Error('No response text');
  } catch (error) {
    console.error('Summary generation failed:', error);
    return {
      points: ['論点の抽出に失敗しました'],
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};

/**
 * ストリーミングでサマリーを生成
 */
export const getDebateSummaryStreaming = async (
  topic: string,
  history: Message[],
  onProgress?: (partialText: string) => void
): Promise<{ points: string[]; usage: TokenUsage }> => {
  const transcript = history
    .map(msg => `${msg.role === 'user' ? 'User' : 'Opponent'}: ${msg.text}`)
    .join('\n');

  const prompt = getSummaryPrompt(topic, transcript);

  const schema: Schema = {
    type: Type.ARRAY,
    items: { type: Type.STRING },
    description: 'List of current debate points',
  };

  try {
    const { data, usage } = await streamJsonContent<string[]>(
      {
        model: MODEL_NAME,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      },
      onProgress
    );

    return { points: data, usage };
  } catch (error) {
    console.error('Summary streaming failed:', error);
    return {
      points: ['論点の抽出に失敗しました'],
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};
