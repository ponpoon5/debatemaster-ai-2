import { Type, Schema } from '@google/genai';
import { ai } from '../client';
import { MODEL_NAME } from '../../../core/config/gemini.config';
import { Message, TokenUsage, TurnPhaseInfo, DebateProgressPhase } from '../../../core/types';
import { cleanText } from '../utils/text-cleaner';
import { extractUsage } from '../utils/token-usage';
import { getPhaseAnalysisPrompt } from '../prompts/analysis/phase';
import { parseApiError } from '../../../core/utils/error-parser';

export const analyzeDebatePhase = async (
  topic: string,
  history: Message[]
): Promise<{ result: TurnPhaseInfo; usage: TokenUsage }> => {
  const recentHistory = history.slice(-6);
  const transcript = recentHistory
    .map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.text}`)
    .join('\n');

  const lastMsg = history[history.length - 1];
  const prompt = getPhaseAnalysisPrompt(topic, transcript);

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      phase: {
        type: Type.STRING,
        enum: ['POSITION', 'GROUNDS', 'CLASH', 'REBUTTAL', 'WEIGHING', 'CLOSING'],
      },
      confidence: { type: Type.NUMBER },
      rationale: { type: Type.STRING },
      winCondition: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ['label', 'description'],
      },
    },
    required: ['phase', 'confidence', 'rationale', 'winCondition'],
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

      const result: TurnPhaseInfo = {
        messageId: lastMsg?.id || 'unknown',
        speaker: lastMsg?.role === 'user' ? 'USER' : 'AI',
        phase: data.phase as DebateProgressPhase,
        confidence: data.confidence,
        rationale: data.rationale,
        winCondition: data.winCondition,
      };

      return { result, usage };
    }
    throw new Error('No response text');
  } catch (error) {
    console.error('Phase analysis failed:', error);
    return {
      result: {
        messageId: lastMsg?.id || 'unknown',
        speaker: lastMsg?.role === 'user' ? 'USER' : 'AI',
        phase: 'CLASH',
        confidence: 0,
        rationale: 'Analysis failed',
        winCondition: { label: '現状分析中', description: '議論を続けてください' },
      },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};
