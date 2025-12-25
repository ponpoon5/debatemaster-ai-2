import { ai } from '../client';
import { MODEL_NAME } from '../../../core/config/gemini.config';
import { Message, TokenUsage, DebateSettings, DebateMode, FeedbackData } from '../../../core/types';
import { cleanText } from '../utils/text-cleaner';
import { extractUsage } from '../utils/token-usage';
import { getFeedbackPrompt } from '../prompts/analysis/feedback';
import { feedbackSchema } from './feedback/schema';
import { streamJsonContent } from '../utils/streaming-helpers';

export const generateFeedback = async (
  settings: DebateSettings,
  history: Message[]
): Promise<{ data: FeedbackData; usage: TokenUsage }> => {
  const transcript = history
    .map((msg, index) => `[ID:${index}] ${msg.role === 'user' ? 'User' : 'AI'}: ${msg.text}`)
    .join('\n');

  const topic = settings.topic;
  const isStoryMode = settings.mode === DebateMode.STORY;
  const isDemoMode = settings.mode === DebateMode.DEMO;

  const prompt = getFeedbackPrompt(topic, isStoryMode, isDemoMode, transcript);

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: feedbackSchema,
      },
    });

    const usage = extractUsage(response);

    if (!response.text) {
      throw new Error('No feedback text generated');
    }

    try {
      const cleaned = cleanText(response.text);
      const data = JSON.parse(cleaned) as FeedbackData;
      return { data, usage };
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Raw text:', response.text);
      return {
        data: {
          score: 0,
          summary: '分析結果のデータ形式が正しくありませんでした。',
          strengths: ['データ解析エラー'],
          weaknesses: ['AI応答のフォーマット不正'],
          advice: 'システムエラーにより正しいフィードバックを表示できませんでした。',
          metrics: {
            logic: 0,
            evidence: 0,
            rebuttal: 0,
            persuasion: 0,
            consistency: 0,
            constructiveness: 0,
            objectivity: 0,
            clarity: 0,
          },
          detailedReview: [],
        },
        usage,
      };
    }
  } catch (error) {
    console.error('Feedback generation failed:', error);
    return {
      data: {
        score: 0,
        summary: 'フィードバックの生成中に通信エラーが発生しました。',
        strengths: ['-'],
        weaknesses: ['-'],
        advice: 'ネットワーク接続またはAPIキーを確認し、再度お試しください。',
        metrics: {
          logic: 0,
          evidence: 0,
          rebuttal: 0,
          persuasion: 0,
          consistency: 0,
          constructiveness: 0,
          objectivity: 0,
          clarity: 0,
        },
        detailedReview: [],
      },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};

/**
 * フィードバックをストリーミングで生成（進捗コールバック付き）
 */
export const generateFeedbackStreaming = async (
  settings: DebateSettings,
  history: Message[],
  onProgress?: (partialText: string) => void
): Promise<{ data: FeedbackData; usage: TokenUsage }> => {
  const transcript = history
    .map((msg, index) => `[ID:${index}] ${msg.role === 'user' ? 'User' : 'AI'}: ${msg.text}`)
    .join('\n');

  const topic = settings.topic;
  const isStoryMode = settings.mode === DebateMode.STORY;
  const isDemoMode = settings.mode === DebateMode.DEMO;

  const prompt = getFeedbackPrompt(topic, isStoryMode, isDemoMode, transcript);

  try {
    const result = await streamJsonContent<FeedbackData>(
      {
        model: MODEL_NAME,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          responseSchema: feedbackSchema,
        },
      },
      onProgress
    );

    return result;
  } catch (error) {
    console.error('Feedback streaming failed:', error);
    return {
      data: {
        score: 0,
        summary: 'フィードバックの生成中に通信エラーが発生しました。',
        strengths: ['-'],
        weaknesses: ['-'],
        advice: 'ネットワーク接続またはAPIキーを確認し、再度お試しください。',
        metrics: {
          logic: 0,
          evidence: 0,
          rebuttal: 0,
          persuasion: 0,
          consistency: 0,
          constructiveness: 0,
          objectivity: 0,
          clarity: 0,
        },
        detailedReview: [],
      },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    };
  }
};
