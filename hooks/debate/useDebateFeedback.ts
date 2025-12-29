import { useCallback } from 'react';
import { DebateSettings, Message, FeedbackData, TokenUsage, DebateArchive } from '../../core/types';
import { generateFeedbackStreaming } from '../../services/gemini/index';
import { parseApiError } from '../../core/utils/error-parser';
import { ScreenType } from '../useDebateApp';

// 最小ローディング時間（UX改善のため）
const MIN_LOADING_TIME_MS = 1500;

// 最小ローディング時間を保証するヘルパー関数
const withMinLoadingTime = async <T>(promise: Promise<T>, minTimeMs: number): Promise<T> => {
  const startTime = Date.now();
  const result = await promise;
  const elapsed = Date.now() - startTime;
  const remainingTime = minTimeMs - elapsed;

  if (remainingTime > 0) {
    await new Promise(resolve => setTimeout(resolve, remainingTime));
  }

  return result;
};

interface UseDebateFeedbackParams {
  settings: DebateSettings | null;
  messages: Message[];
  setFeedback: (feedback: FeedbackData | null) => void;
  setScreen: (screen: ScreenType) => void;
  setIsLoadingFeedback: (loading: boolean) => void;
  updateTokenUsage: (usage: TokenUsage) => void;
  addArchive: (archive: DebateArchive, settings: DebateSettings) => void;
  handleError: (error: unknown, context?: string) => void;
  tokenUsage: TokenUsage;
  setLoadingProgress?: (progress: number) => void; // 新規追加
}

export const useDebateFeedback = ({
  settings,
  messages,
  setFeedback,
  setScreen,
  setIsLoadingFeedback,
  updateTokenUsage,
  addArchive,
  handleError,
  tokenUsage,
  setLoadingProgress, // 新規追加
}: UseDebateFeedbackParams) => {
  const handleEndDebate = useCallback(async () => {
    if (!settings) return;
    setIsLoadingFeedback(true);
    try {
      // ストリーミングでフィードバックを生成（進捗コールバック付き）
      const result = await withMinLoadingTime(
        generateFeedbackStreaming(settings, messages, (progress) => {
          // 変更: 進捗パーセンテージを更新
          setLoadingProgress?.(progress);
        }),
        MIN_LOADING_TIME_MS
      );
      setFeedback(result.data);
      updateTokenUsage(result.usage);
      setScreen('feedback');

      // 現在のトークン使用量を取得してアーカイブに保存
      const currentTokenUsage = { ...tokenUsage };

      const newArchive: DebateArchive = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        topic: settings.topic,
        messages: messages,
        feedback: result.data,
        tokenUsage: currentTokenUsage,
      };
      addArchive(newArchive, settings);
    } catch (error: unknown) {
      console.error(error);
      const apiError = parseApiError(error);
      handleError(apiError, 'フィードバック生成');
    } finally {
      setIsLoadingFeedback(false);
    }
  }, [
    settings,
    messages,
    setFeedback,
    setScreen,
    setIsLoadingFeedback,
    updateTokenUsage,
    addArchive,
    handleError,
    tokenUsage,
    setLoadingProgress, // 新規追加
  ]);

  return {
    handleEndDebate,
  };
};
