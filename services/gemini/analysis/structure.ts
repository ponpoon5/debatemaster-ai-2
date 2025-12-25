import { Type, Schema } from '@google/genai';
import { ai } from '../client';
import { MODEL_NAME } from '../../../core/config/gemini.config';
import {
  Message,
  TokenUsage,
  UtteranceStructureScore,
  ToulminComponent,
} from '../../../core/types';
import { cleanText } from '../utils/text-cleaner';
import { extractUsage } from '../utils/token-usage';
import { getStructureAnalysisPrompt } from '../prompts/analysis/structure';
import { parseApiError } from '../../../core/utils/error-parser';
import { streamJsonContent } from '../utils/streaming-helpers';

export const analyzeUtteranceStructure = async (
  message: Message
): Promise<{ result: UtteranceStructureScore; usage: TokenUsage }> => {
  const prompt = getStructureAnalysisPrompt(message.text);

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      scores: {
        type: Type.OBJECT,
        properties: {
          CLAIM: { type: Type.NUMBER },
          REASON: { type: Type.NUMBER },
          EVIDENCE: { type: Type.NUMBER },
          WARRANT: { type: Type.NUMBER },
          BACKING: { type: Type.NUMBER },
          REBUTTAL: { type: Type.NUMBER },
          QUALIFICATION: { type: Type.NUMBER },
        },
        required: [
          'CLAIM',
          'REASON',
          'EVIDENCE',
          'WARRANT',
          'BACKING',
          'REBUTTAL',
          'QUALIFICATION',
        ],
      },
      snippets: {
        type: Type.OBJECT,
        properties: {
          CLAIM: { type: Type.STRING },
          REASON: { type: Type.STRING },
          EVIDENCE: { type: Type.STRING },
          WARRANT: { type: Type.STRING },
          BACKING: { type: Type.STRING },
          REBUTTAL: { type: Type.STRING },
          QUALIFICATION: { type: Type.STRING },
        },
      },
      scheme: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          label: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ['id', 'label', 'description'],
      },
      criticalQuestions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            isAddressed: { type: Type.BOOLEAN },
            aiComment: { type: Type.STRING },
          },
          required: ['question', 'isAddressed', 'aiComment'],
        },
      },
      summary: { type: Type.STRING },
    },
    required: ['scores', 'summary', 'scheme', 'criticalQuestions'],
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
      const data = JSON.parse(cleaned);

      const result: UtteranceStructureScore = {
        messageId: message.id,
        speaker: message.role === 'user' ? 'USER' : 'AI',
        scores: data.scores,
        snippets: data.snippets,
        scheme: data.scheme,
        criticalQuestions: data.criticalQuestions,
        summary: data.summary,
      };

      return { result, usage };
    }
    throw new Error('No response text');
  } catch (error) {
    const apiError = parseApiError(error);
    console.error('Structure analysis failed:', apiError);
    return {
      result: {
        messageId: message.id,
        speaker: message.role === 'user' ? 'USER' : 'AI',
        scores: {
          CLAIM: 0,
          REASON: 0,
          EVIDENCE: 0,
          WARRANT: 0,
          BACKING: 0,
          REBUTTAL: 0,
          QUALIFICATION: 0,
        },
        summary: '分析失敗',
      },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};

/**
 * 発話構造をストリーミングで分析
 */
export const analyzeUtteranceStructureStreaming = async (
  message: Message,
  onProgress?: (partialText: string) => void
): Promise<{ result: UtteranceStructureScore; usage: TokenUsage }> => {
  const prompt = getStructureAnalysisPrompt(message.text);

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      scores: {
        type: Type.OBJECT,
        properties: {
          CLAIM: { type: Type.NUMBER },
          REASON: { type: Type.NUMBER },
          EVIDENCE: { type: Type.NUMBER },
          WARRANT: { type: Type.NUMBER },
          BACKING: { type: Type.NUMBER },
          REBUTTAL: { type: Type.NUMBER },
          QUALIFICATION: { type: Type.NUMBER },
        },
        required: [
          'CLAIM',
          'REASON',
          'EVIDENCE',
          'WARRANT',
          'BACKING',
          'REBUTTAL',
          'QUALIFICATION',
        ],
      },
      snippets: {
        type: Type.OBJECT,
        properties: {
          CLAIM: { type: Type.STRING },
          REASON: { type: Type.STRING },
          EVIDENCE: { type: Type.STRING },
          WARRANT: { type: Type.STRING },
          BACKING: { type: Type.STRING },
          REBUTTAL: { type: Type.STRING },
          QUALIFICATION: { type: Type.STRING },
        },
      },
      scheme: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          label: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ['id', 'label', 'description'],
      },
      criticalQuestions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            isAddressed: { type: Type.BOOLEAN },
            aiComment: { type: Type.STRING },
          },
          required: ['question', 'isAddressed', 'aiComment'],
        },
      },
      summary: { type: Type.STRING },
    },
    required: ['scores', 'summary', 'scheme', 'criticalQuestions'],
  };

  try {
    const { data, usage } = await streamJsonContent<any>(
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

    const result: UtteranceStructureScore = {
      messageId: message.id,
      speaker: message.role === 'user' ? 'USER' : 'AI',
      scores: data.scores,
      snippets: data.snippets,
      scheme: data.scheme,
      criticalQuestions: data.criticalQuestions,
      summary: data.summary,
    };

    return { result, usage };
  } catch (error) {
    const apiError = parseApiError(error);
    console.error('Structure analysis streaming failed:', apiError);
    return {
      result: {
        messageId: message.id,
        speaker: message.role === 'user' ? 'USER' : 'AI',
        scores: {
          CLAIM: 0,
          REASON: 0,
          EVIDENCE: 0,
          WARRANT: 0,
          BACKING: 0,
          REBUTTAL: 0,
          QUALIFICATION: 0,
        },
        summary: '分析失敗',
      },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};
