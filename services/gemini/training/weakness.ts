import { ai } from '../client';
import { MODEL_NAME } from '../../../core/config/gemini.config';
import { TokenUsage, DebateArchive } from '../../../core/types';
import { cleanText } from '../utils/text-cleaner';
import { extractUsage } from '../utils/token-usage';
import { parseApiError } from '../../../core/utils/error-parser';

export const generateWeaknessProfile = async (
  archives: DebateArchive[]
): Promise<{ profile: string; usage: TokenUsage }> => {
  if (archives.length === 0) {
    return {
      profile: '過去のデータがありません。',
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }

  const recentArchives = archives.slice(-10);
  const summaryText = recentArchives
    .map(
      (a, i) => `
    [議論${i + 1}]
    テーマ: ${a.topic}
    スコア: ${a.feedback.score}
    改善点(Weaknesses): ${a.feedback.weaknesses.join(', ')}
    アドバイス: ${a.feedback.advice}
  `
    )
    .join('\n');

  const prompt = `
    あなたはディベートの分析官です。あるユーザーの過去の議論履歴（フィードバック）を分析し、
    このユーザーが陥りやすい「論理的弱点」や「癖」を特定してください。

    [過去の履歴]
    ${summaryText}

    [タスク]
    1. ユーザーの論理構成における共通の欠点（例：感情的になりやすい、根拠が薄い、ストローマン論法に弱い、など）を特定する。
    2. 次回のトレーニングで重点的に鍛えるべきポイントを提案する。
    3. 200文字以内の日本語で、「コーチへの申し送り事項」としてまとめてください。

    出力例:
    「ユーザーは反論されると感情的になり、論点がずれる傾向があります。特に倫理的なテーマでその傾向が強いです。次はあえて理不尽な攻撃を仕掛け、冷静さを保つ訓練が必要です。」
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'text/plain',
      },
    });
    return {
      profile: cleanText(response.text?.trim() || '分析に失敗しました。'),
      usage: extractUsage(response),
    };
  } catch (error) {
    const apiError = parseApiError(error);
    console.error('Weakness analysis failed:', apiError);
    return {
      profile: 'エラーにより分析できませんでした。',
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};
