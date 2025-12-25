import { Type, Schema } from '@google/genai';
import { ai } from '../client';
import { MODEL_NAME } from '../../../core/config/gemini.config';
import { ToulminLabResult, DefinitionLabResult, TokenUsage } from '../../../core/types';
import { cleanText } from '../utils/text-cleaner';
import { extractUsage } from '../utils/token-usage';
import { parseApiError } from '../../../core/utils/error-parser';

export const analyzeToulminConstruction = async (
  claim: string,
  data: string,
  warrant: string
): Promise<{ result: ToulminLabResult; usage: TokenUsage }> => {
  const prompt = `
    あなたはロジカルシンキングの鬼コーチです。
    ユーザーが構築した以下の「トゥールミンモデル（論理の三角形）」を厳しく審査してください。
    特に、Data（事実）とClaim（主張）を結びつける**Warrant（論拠）の妥当性**を重視してください。

    Claim: ${claim}
    Data: ${data}
    Warrant: ${warrant}

    出力要件（JSON）:
    1. score: 0-100の点数。
    2. critique: 全体の論評（日本語）。論理の飛躍がないか指摘してください。
    3. warrantImprovement: Warrantをより強固にするための具体的な修正案。
    `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.INTEGER },
      critique: { type: Type.STRING },
      warrantImprovement: { type: Type.STRING },
    },
    required: ['score', 'critique', 'warrantImprovement'],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json', responseSchema: schema },
    });
    const usage = extractUsage(response);
    if (response.text) {
      return { result: JSON.parse(cleanText(response.text)) as ToulminLabResult, usage };
    }
    throw new Error('No text');
  } catch (error) {
    const apiError = parseApiError(error);
    console.error('Toulmin construction analysis failed:', apiError);
    return {
      result: { score: 0, critique: 'エラーが発生しました', warrantImprovement: '-' },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};

export const challengeDefinition = async (
  word: string,
  definition: string
): Promise<{ result: DefinitionLabResult; usage: TokenUsage }> => {
  const prompt = `
    あなたは意地悪なソクラテスです。
    ユーザーが定義した言葉の「抜け穴」を探し、反例（Counter-example）を突きつけてください。

    対象の言葉: ${word}
    ユーザーの定義: ${definition}

    タスク:
    ユーザーの定義には当てはまるが、一般的にはその言葉に含まれないもの（過包摂）、
    あるいはその逆（過小包摂）の事例を探し、「反例」として提示してください。
    もし定義が完璧なら褒めてください。

    出力要件（JSON）:
    1. isRobust: 定義が堅牢ならtrue, 穴があればfalse
    2. counterExample: 具体的な反例（例：「あなたの定義だと、ペンギンも魚になりますが？」）
    3. explanation: なぜその定義が不十分なのかの解説
    `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      isRobust: { type: Type.BOOLEAN },
      counterExample: { type: Type.STRING },
      explanation: { type: Type.STRING },
    },
    required: ['isRobust', 'counterExample', 'explanation'],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json', responseSchema: schema },
    });
    const usage = extractUsage(response);
    if (response.text) {
      return { result: JSON.parse(cleanText(response.text)) as DefinitionLabResult, usage };
    }
    throw new Error('No text');
  } catch (error) {
    const apiError = parseApiError(error);
    console.error('Definition challenge failed:', apiError);
    return {
      result: { isRobust: false, counterExample: 'エラー', explanation: '通信エラー' },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};
