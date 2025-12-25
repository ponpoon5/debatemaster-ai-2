import { Type, Schema } from '@google/genai';
import { ai } from '../client';
import { MODEL_NAME } from '../../../core/config/gemini.config';
import { Message, TokenUsage, StrategyAnalysis, DebatePhase } from '../../../core/types';
import { cleanText } from '../utils/text-cleaner';
import { extractUsage } from '../utils/token-usage';
import { getStrategyPrompt } from '../prompts/analysis/strategy';
import { parseApiError } from '../../../core/utils/error-parser';
import { streamJsonContent } from '../utils/streaming-helpers';

export const generateLiveStrategy = async (
  topic: string,
  history: Message[]
): Promise<{ strategy: StrategyAnalysis; usage: TokenUsage }> => {
  const transcript = history
    .slice(-4)
    .map(msg => `${msg.role === 'user' ? 'User' : 'Opponent'}: ${msg.text}`)
    .join('\n');

  const prompt = getStrategyPrompt(topic, transcript);

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      analysis: {
        type: Type.OBJECT,
        properties: {
          claim_summary: { type: Type.STRING },
          evidence_summary: { type: Type.STRING },
          weak_point: { type: Type.STRING },
          rhetoric_device: { type: Type.STRING },
          detected_fallacy: { type: Type.STRING, nullable: true },
        },
        required: ['claim_summary', 'evidence_summary', 'weak_point', 'rhetoric_device'],
      },
      currentPhase: {
        type: Type.STRING,
        enum: [
          DebatePhase.CLAIM,
          DebatePhase.EVIDENCE,
          DebatePhase.REBUTTAL,
          DebatePhase.DEFENSE,
          DebatePhase.FALLACY,
          DebatePhase.FRAMING,
          DebatePhase.CONCESSION,
          DebatePhase.SYNTHESIS,
        ],
      },
      moves: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ['logical_attack', 'reframing', 'concession'] },
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            expected_effect: { type: Type.STRING },
            reason: { type: Type.STRING, description: 'Why this is effective now' },
            template: { type: Type.STRING },
          },
          required: ['type', 'title', 'summary', 'expected_effect', 'reason', 'template'],
        },
      },
      rebuttalTemplate: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          fields: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                placeholder: { type: Type.STRING },
                hint: { type: Type.STRING, description: 'AI suggestion for this field' },
              },
              required: ['id', 'label', 'placeholder', 'hint'],
            },
          },
        },
        required: ['title', 'fields'],
      },
    },
    required: ['analysis', 'currentPhase', 'moves', 'rebuttalTemplate'],
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
      const strategy = JSON.parse(cleaned) as StrategyAnalysis;
      return { strategy, usage };
    }
    throw new Error('No text response');
  } catch (error) {
    const apiError = parseApiError(error);
    console.error('Strategy generation failed:', apiError);
    // Fallback
    return {
      strategy: {
        analysis: {
          claim_summary: '分析失敗',
          evidence_summary: '不明',
          weak_point: '不明',
          rhetoric_device: '不明',
          detected_fallacy: null,
        },
        currentPhase: DebatePhase.REBUTTAL,
        moves: [],
      },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};

/**
 * ストリーミングで戦略を生成
 */
export const generateLiveStrategyStreaming = async (
  topic: string,
  history: Message[],
  onProgress?: (partialText: string) => void
): Promise<{ strategy: StrategyAnalysis; usage: TokenUsage }> => {
  const transcript = history
    .slice(-4)
    .map(msg => `${msg.role === 'user' ? 'User' : 'Opponent'}: ${msg.text}`)
    .join('\n');

  const prompt = getStrategyPrompt(topic, transcript);

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      analysis: {
        type: Type.OBJECT,
        properties: {
          claim_summary: { type: Type.STRING },
          evidence_summary: { type: Type.STRING },
          weak_point: { type: Type.STRING },
          rhetoric_device: { type: Type.STRING },
          detected_fallacy: { type: Type.STRING, nullable: true },
        },
        required: ['claim_summary', 'evidence_summary', 'weak_point', 'rhetoric_device'],
      },
      currentPhase: {
        type: Type.STRING,
        enum: [
          DebatePhase.CLAIM,
          DebatePhase.EVIDENCE,
          DebatePhase.REBUTTAL,
          DebatePhase.DEFENSE,
          DebatePhase.FALLACY,
          DebatePhase.FRAMING,
          DebatePhase.CONCESSION,
          DebatePhase.SYNTHESIS,
        ],
      },
      moves: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ['logical_attack', 'reframing', 'concession'] },
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            expected_effect: { type: Type.STRING },
            reason: { type: Type.STRING, description: 'Why this is effective now' },
            template: { type: Type.STRING },
          },
          required: ['type', 'title', 'summary', 'expected_effect', 'reason', 'template'],
        },
      },
      rebuttalTemplate: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          fields: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                placeholder: { type: Type.STRING },
                hint: { type: Type.STRING, description: 'AI suggestion for this field' },
              },
              required: ['id', 'label', 'placeholder', 'hint'],
            },
          },
        },
        required: ['title', 'fields'],
      },
    },
    required: ['analysis', 'currentPhase', 'moves', 'rebuttalTemplate'],
  };

  try {
    const { data, usage } = await streamJsonContent<StrategyAnalysis>(
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

    return { strategy: data, usage };
  } catch (error) {
    const apiError = parseApiError(error);
    console.error('Strategy streaming failed:', apiError);
    return {
      strategy: {
        analysis: {
          claim_summary: '分析失敗',
          evidence_summary: '不明',
          weak_point: '不明',
          rhetoric_device: '不明',
          detected_fallacy: null,
        },
        currentPhase: DebatePhase.REBUTTAL,
        moves: [],
      },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};
