import { ai } from '../client';
import { MODEL_NAME } from '../../../core/config/gemini.config';
import { Message, TokenUsage, BurdenAnalysis } from '../../../core/types';
import { cleanText } from '../utils/text-cleaner';
import { extractUsage } from '../utils/token-usage';
import { burdenAnalysisSchema } from './burden/schema';
import { streamJsonContent } from '../utils/streaming-helpers';

export const analyzeBurdenOfProof = async (
  topic: string,
  history: Message[]
): Promise<{ data: BurdenAnalysis; usage: TokenUsage }> => {
  const transcript = history
    .map((msg, index) => `[ID:${index}] ${msg.role === 'user' ? 'User' : 'AI'}: ${msg.text}`)
    .join('\n');

  const prompt = `
あなたは論理的議論の専門家です。以下の議論における「立証責任（Burden of Proof）」を分析してください。

**重要: 全ての説明文は必ず日本語で出力してください。claim、explanation、reasoning等のテキストフィールドは全て日本語で記述してください。**

テーマ: ${topic}

【分析タスク】
1. 各主張（Claim）を特定し、誰が立証責任を負うかを明確にしてください。
2. Critical Question (CQ) が発せられた際、以下を区別してください:
   - 「単なる疑問 (simple_question)」: 主張者の説明不足を指摘するもので、立証責任は元の主張者に残る
   - 「反証を要する指摘 (counter_claim)」: 新たな証拠や論理を提示するもので、質問者が立証責任を負う

3. 各立証責任の状態を評価してください:
   - active: 証拠がまだ提示されていない
   - fulfilled: 十分な証拠が提示された
   - challenged: 争点化されており、さらなる証拠が必要
   - abandoned: 主張が放棄された

【重要な原則】
- 主張を行った者（Claimant）が、その主張を立証する第一義的な責任を負います。
- 単なる疑問提起では立証責任は移転しません。質問者が「あなたの主張は○○だから間違っている」と反証する場合のみ、質問者に立証責任が発生します。
- CQの種類を正確に識別し、burdenHolderを適切に設定してください。

【出力形式】
JSON形式で、以下の構造に従って出力してください:
- burdens: 立証責任のリスト
- summary: 統計情報

**再度確認: claim、explanation、reasoning等の全てのテキストは日本語で記述してください。**

議論履歴:
${transcript}
`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: burdenAnalysisSchema,
      },
    });

    const usage = extractUsage(response);

    if (!response.text) {
      throw new Error('No burden analysis generated');
    }

    try {
      const cleaned = cleanText(response.text);
      const data = JSON.parse(cleaned) as BurdenAnalysis;
      return { data, usage };
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Raw text:', response.text);
      return {
        data: {
          burdens: [],
          summary: {
            userActiveBurdens: 0,
            aiActiveBurdens: 0,
            totalResolved: 0,
            criticalQuestionsCount: 0,
          },
        },
        usage,
      };
    }
  } catch (error) {
    console.error('Burden analysis failed:', error);
    return {
      data: {
        burdens: [],
        summary: {
          userActiveBurdens: 0,
          aiActiveBurdens: 0,
          totalResolved: 0,
          criticalQuestionsCount: 0,
        },
      },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};

/**
 * 立証責任をストリーミングで分析
 */
export const analyzeBurdenOfProofStreaming = async (
  topic: string,
  history: Message[],
  onProgress?: (partialText: string) => void
): Promise<{ data: BurdenAnalysis; usage: TokenUsage }> => {
  const transcript = history
    .map((msg, index) => `[ID:${index}] ${msg.role === 'user' ? 'User' : 'AI'}: ${msg.text}`)
    .join('\n');

  const prompt = `
あなたは論理的議論の専門家です。以下の議論における「立証責任（Burden of Proof）」を分析してください。

**重要: 全ての説明文は必ず日本語で出力してください。claim、explanation、reasoning等のテキストフィールドは全て日本語で記述してください。**

テーマ: ${topic}

【分析タスク】
1. 各主張（Claim）を特定し、誰が立証責任を負うかを明確にしてください。
2. Critical Question (CQ) が発せられた際、以下を区別してください:
   - 「単なる疑問 (simple_question)」: 主張者の説明不足を指摘するもので、立証責任は元の主張者に残る
   - 「反証を要する指摘 (counter_claim)」: 新たな証拠や論理を提示するもので、質問者が立証責任を負う

3. 各立証責任の状態を評価してください:
   - active: 証拠がまだ提示されていない
   - fulfilled: 十分な証拠が提示された
   - challenged: 争点化されており、さらなる証拠が必要
   - abandoned: 主張が放棄された

【重要な原則】
- 主張を行った者（Claimant）が、その主張を立証する第一義的な責任を負います。
- 単なる疑問提起では立証責任は移転しません。質問者が「あなたの主張は○○だから間違っている」と反証する場合のみ、質問者に立証責任が発生します。
- CQの種類を正確に識別し、burdenHolderを適切に設定してください。

【出力形式】
JSON形式で、以下の構造に従って出力してください:
- burdens: 立証責任のリスト
- summary: 統計情報

**再度確認: claim、explanation、reasoning等の全てのテキストは日本語で記述してください。**

議論履歴:
${transcript}
`;

  try {
    const { data, usage } = await streamJsonContent<BurdenAnalysis>(
      {
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: burdenAnalysisSchema,
        },
      },
      onProgress
    );

    return { data, usage };
  } catch (error) {
    console.error('Burden analysis streaming failed:', error);
    return {
      data: {
        burdens: [],
        summary: {
          userActiveBurdens: 0,
          aiActiveBurdens: 0,
          totalResolved: 0,
          criticalQuestionsCount: 0,
        },
      },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};
