import { Type, Schema } from '@google/genai';
import { ai } from '../client';
import { MODEL_NAME } from '../../../core/config/gemini.config';
import { StoryScenario, TokenUsage } from '../../../core/types';
import { cleanText } from '../utils/text-cleaner';
import { extractUsage } from '../utils/token-usage';
import { getScenarioPrompt } from '../prompts/setup/scenario';
import { parseApiError } from '../../../core/utils/error-parser';

export const generateStoryScenario = async (
  topic: string
): Promise<{ scenario: StoryScenario; usage: TokenUsage }> => {
  const prompt = getScenarioPrompt(topic);

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      worldSetting: { type: Type.STRING },
      currentProblem: { type: Type.STRING },
      userRole: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          mission: { type: Type.STRING },
        },
        required: ['title', 'description', 'mission'],
      },
      stakeholders: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            role: { type: Type.STRING },
            standpoint: { type: Type.STRING },
          },
          required: ['name', 'role', 'standpoint'],
        },
      },
      initialState: { type: Type.STRING },
    },
    required: [
      'title',
      'worldSetting',
      'currentProblem',
      'userRole',
      'stakeholders',
      'initialState',
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
    if (response.text) {
      const cleaned = cleanText(response.text);
      return { scenario: JSON.parse(cleaned) as StoryScenario, usage };
    }
    throw new Error('No text response');
  } catch (error) {
    const apiError = parseApiError(error);
    console.error('scenario failed:', apiError);
    // Fallback scenario
    return {
      scenario: {
        title: '生成エラー: デフォルトシナリオ',
        worldSetting: '架空の都市国家',
        currentProblem: 'AIによるエラーが発生しました',
        userRole: { title: '管理者', description: 'システム管理者', mission: '復旧' },
        stakeholders: [],
        initialState: 'エラーが発生しました。再試行してください。',
      },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};
