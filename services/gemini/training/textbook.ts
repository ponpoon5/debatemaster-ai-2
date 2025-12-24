import { Type, Schema } from '@google/genai';
import { ai } from '../client';
import { MODEL_NAME } from '../../../core/config/gemini.config';
import { TokenUsage } from '../../../core/types';
import { cleanText } from '../utils/text-cleaner';
import { extractUsage } from '../utils/token-usage';
import { parseApiError } from '../../../core/utils/error-parser';

export const generateTextbookProblem = async (
  chapterTitle: string,
  context: string
): Promise<{ problem: string; usage: TokenUsage }> => {
  const prompt = `
  あなたは論理的思考の教育者です。
  教科書の章「${chapterTitle}」の理解度を確認するための短い練習問題（クイズ）を1つ作成してください。
  
  学習内容の文脈: ${context}
  
  【要件】
  - ユーザーが回答するための具体的な問題文のみを出力してください。
  - 解答や解説は含めないでください。
  - 問題は短く、シンプルに。
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return {
      problem: cleanText(response.text || ''),
      usage: extractUsage(response),
    };
  } catch (error) {
    const apiError = parseApiError(error);
    console.error('Textbook problem generation failed:', apiError);
    return {
      problem: '問題の生成に失敗しました。',
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};

export const evaluateTextbookAnswer = async (
  chapterTitle: string,
  problem: string,
  answer: string
): Promise<{ isCorrect: boolean; feedback: string; usage: TokenUsage }> => {
  const prompt = `
  あなたは論理的思考の教育者です。
  以下の練習問題に対するユーザーの回答を採点・解説してください。
  
  章: ${chapterTitle}
  問題: ${problem}
  ユーザーの回答: ${answer}
  
  JSON形式で出力してください:
  {
    "isCorrect": boolean, // 正解ならtrue
    "feedback": string // 解説文（正解の理由、または間違いの指摘とアドバイス）
  }
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      isCorrect: { type: Type.BOOLEAN },
      feedback: { type: Type.STRING },
    },
    required: ['isCorrect', 'feedback'],
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

    if (response.text) {
      return { ...JSON.parse(cleanText(response.text)), usage: extractUsage(response) };
    }
    throw new Error('No text');
  } catch (error) {
    const apiError = parseApiError(error);
    console.error('Textbook answer evaluation failed:', apiError);
    return {
      isCorrect: false,
      feedback: '採点エラー',
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};
