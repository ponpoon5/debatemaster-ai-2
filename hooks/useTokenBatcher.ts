import { useRef, useCallback } from 'react';
import type { TokenUsage } from '../core/types';

/**
 * トークン使用量の更新をバッチ処理するカスタムフック
 * 複数の分析が同時に実行される場合に、トークン更新を1つにまとめることでパフォーマンスを向上
 */
export const useTokenBatcher = (updateTokenUsage: (usage: TokenUsage) => void) => {
  const batchQueueRef = useRef<TokenUsage[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const BATCH_DELAY_MS = 100; // 100ms以内の更新をバッチ化

  /**
   * トークン使用量をバッチキューに追加し、遅延後にまとめて更新
   */
  const batchUpdateToken = useCallback(
    (usage: TokenUsage) => {
      batchQueueRef.current.push(usage);

      // 既存のタイマーをクリア
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // 新しいタイマーを設定（100ms後に実行）
      timerRef.current = setTimeout(() => {
        if (batchQueueRef.current.length === 0) return;

        // バッチ内の全トークン使用量を合算
        const totalUsage = batchQueueRef.current.reduce(
          (acc, curr) => ({
            inputTokens: acc.inputTokens + curr.inputTokens,
            outputTokens: acc.outputTokens + curr.outputTokens,
            totalTokens: acc.totalTokens + curr.totalTokens,
          }),
          { inputTokens: 0, outputTokens: 0, totalTokens: 0 }
        );

        console.log(
          `📦 Token batch update: ${batchQueueRef.current.length} updates merged into 1 (total: ${totalUsage.totalTokens} tokens)`
        );

        // 1回の更新にまとめる
        updateTokenUsage(totalUsage);

        // キューをクリア
        batchQueueRef.current = [];
        timerRef.current = null;
      }, BATCH_DELAY_MS);
    },
    [updateTokenUsage]
  );

  return batchUpdateToken;
};
