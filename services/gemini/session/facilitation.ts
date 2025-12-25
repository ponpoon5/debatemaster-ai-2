import { Type, Schema } from '@google/genai';
import { ai } from '../client';
import { MODEL_NAME } from '../../../core/config/gemini.config';
import { FacilitationBoardData, Message, TokenUsage } from '../../../core/types';
import { cleanText } from '../utils/text-cleaner';
import { extractUsage } from '../utils/token-usage';
import { getFacilitationBoardPrompt } from '../prompts/session/facilitation';

export const generateFacilitationBoard = async (
  topic: string,
  history: Message[]
): Promise<{ board: FacilitationBoardData; usage: TokenUsage }> => {
  const transcript = history
    .map(msg => `${msg.role === 'user' ? 'Facilitator' : 'AI Characters'}: ${msg.text}`)
    .join('\n');

  const prompt = getFacilitationBoardPrompt(topic, transcript);

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      currentAgenda: {
        type: Type.STRING,
        description: '現在議論している具体的な論点（例：コストについて）',
      },
      opinionA: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: 'Aさんの主張要約' },
          pros: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Aさんが挙げるメリット/賛成理由',
          },
          cons: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Aさんが挙げるデメリット/懸念点',
          },
        },
        required: ['summary', 'pros', 'cons'],
      },
      opinionB: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: 'Bさんの主張要約' },
          pros: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Bさんが挙げるメリット/賛成理由',
          },
          cons: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Bさんが挙げるデメリット/懸念点',
          },
        },
        required: ['summary', 'pros', 'cons'],
      },
      agreedPoints: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: '両者が合意できた点',
      },
      conflictingPoints: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: '意見が食い違っている点',
      },
      facilitationHint: { type: Type.STRING, description: '合意形成に向けた次のアクション提案' },
    },
    required: [
      'currentAgenda',
      'opinionA',
      'opinionB',
      'agreedPoints',
      'conflictingPoints',
      'facilitationHint',
    ],
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

    // プロキシモードでは response.response.text() を使用
    let textContent = '';
    if (response.text) {
      textContent = response.text;
    } else if (response.response?.text) {
      textContent = typeof response.response.text === 'function'
        ? response.response.text()
        : response.response.text;
    }

    if (textContent) {
      const cleaned = cleanText(textContent);
      const board = JSON.parse(cleaned) as FacilitationBoardData;
      return { board, usage };
    }
    throw new Error('No response text');
  } catch (error) {
    console.error('Facilitation board generation failed:', error);
    // Fallback data
    return {
      board: {
        currentAgenda: '情報の整理中...',
        opinionA: { summary: '分析中', pros: [], cons: [] },
        opinionB: { summary: '分析中', pros: [], cons: [] },
        agreedPoints: [],
        conflictingPoints: [],
        facilitationHint: '議論を続けてください。',
      },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};
