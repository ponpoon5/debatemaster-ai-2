import { Type, Schema } from '@google/genai';
import { ai } from '../client';
import { MODEL_NAME } from '../../../core/config/gemini.config';
import { Message, TokenUsage } from '../../../core/types';
import { cleanText } from '../utils/text-cleaner';
import { extractUsage } from '../utils/token-usage';
import { getAdvicePrompt } from '../prompts/analysis/advice';
import { parseApiError } from '../../../core/utils/error-parser';
import { streamJsonContent } from '../utils/streaming-helpers';

export const getDebateAdvice = async (
  topic: string,
  history: Message[],
  draft: string
): Promise<{
  advice: string;
  detectedFallacy: string | null;
  fallacyQuote: string | null;
  fallacyExplanation: string | null;
  sentimentScore: number | null;
  detectedBias: string | null;
  biasQuote: string | null;
  biasExplanation: string | null;
  usage: TokenUsage;
}> => {
  const transcript = history
    .slice(-4)
    .map(msg => `${msg.role === 'user' ? 'User' : 'Opponent'}: ${msg.text}`)
    .join('\n');

  const prompt = getAdvicePrompt(topic, transcript, draft);

  const adviceSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      advice: { type: Type.STRING },
      detectedFallacy: { type: Type.STRING, nullable: true },
      fallacyQuote: { type: Type.STRING, nullable: true },
      fallacyExplanation: { type: Type.STRING, nullable: true },
      sentimentScore: { type: Type.NUMBER, nullable: true },
      detectedBias: { type: Type.STRING, nullable: true },
      biasQuote: { type: Type.STRING, nullable: true },
      biasExplanation: { type: Type.STRING, nullable: true },
    },
    required: ['advice'],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: adviceSchema,
      },
    });

    const usage = extractUsage(response);

    if (response.text) {
      const cleaned = cleanText(response.text);
      const json = JSON.parse(cleaned);
      return {
        advice: json.advice,
        detectedFallacy: json.detectedFallacy || null,
        fallacyQuote: json.fallacyQuote || null,
        fallacyExplanation: json.fallacyExplanation || null,
        sentimentScore: typeof json.sentimentScore === 'number' ? json.sentimentScore : null,
        detectedBias: json.detectedBias || null,
        biasQuote: json.biasQuote || null,
        biasExplanation: json.biasExplanation || null,
        usage,
      };
    }
    throw new Error('No response text');
  } catch (error) {
    const apiError = parseApiError(error);
    console.error('Advice generation failed:', apiError);
    return {
      advice: '通信エラーが発生しました。',
      detectedFallacy: null,
      fallacyQuote: null,
      fallacyExplanation: null,
      sentimentScore: null,
      detectedBias: null,
      biasQuote: null,
      biasExplanation: null,
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};

/**
 * ストリーミングでアドバイスを生成
 */
export const getDebateAdviceStreaming = async (
  topic: string,
  history: Message[],
  draft: string,
  onProgress?: (partialText: string) => void
): Promise<{
  advice: string;
  detectedFallacy: string | null;
  fallacyQuote: string | null;
  fallacyExplanation: string | null;
  sentimentScore: number | null;
  detectedBias: string | null;
  biasQuote: string | null;
  biasExplanation: string | null;
  usage: TokenUsage;
}> => {
  const transcript = history
    .slice(-4)
    .map(msg => `${msg.role === 'user' ? 'User' : 'Opponent'}: ${msg.text}`)
    .join('\n');

  const prompt = getAdvicePrompt(topic, transcript, draft);

  const adviceSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      advice: { type: Type.STRING },
      detectedFallacy: { type: Type.STRING, nullable: true },
      fallacyQuote: { type: Type.STRING, nullable: true },
      fallacyExplanation: { type: Type.STRING, nullable: true },
      sentimentScore: { type: Type.NUMBER, nullable: true },
      detectedBias: { type: Type.STRING, nullable: true },
      biasQuote: { type: Type.STRING, nullable: true },
      biasExplanation: { type: Type.STRING, nullable: true },
    },
    required: ['advice'],
  };

  try {
    const { data, usage } = await streamJsonContent<any>(
      {
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: adviceSchema,
        },
      },
      onProgress
    );

    return {
      advice: data.advice,
      detectedFallacy: data.detectedFallacy || null,
      fallacyQuote: data.fallacyQuote || null,
      fallacyExplanation: data.fallacyExplanation || null,
      sentimentScore: typeof data.sentimentScore === 'number' ? data.sentimentScore : null,
      detectedBias: data.detectedBias || null,
      biasQuote: data.biasQuote || null,
      biasExplanation: data.biasExplanation || null,
      usage,
    };
  } catch (error) {
    const apiError = parseApiError(error);
    console.error('Advice streaming failed:', apiError);
    return {
      advice: '通信エラーが発生しました。',
      detectedFallacy: null,
      fallacyQuote: null,
      fallacyExplanation: null,
      sentimentScore: null,
      detectedBias: null,
      biasQuote: null,
      biasExplanation: null,
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};
