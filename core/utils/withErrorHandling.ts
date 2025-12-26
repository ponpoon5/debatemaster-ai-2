/**
 * エラーハンドリングユーティリティ
 * 統一されたエラー処理パターンを提供
 */

import { parseApiError } from './error-parser';

/**
 * 非同期操作をエラーハンドリングでラップする
 *
 * @param operation - 実行する非同期操作
 * @param context - エラーコンテキスト（ログ用）
 * @param onError - エラー時のコールバック（オプション）
 * @returns 操作結果またはnull（エラー時）
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string,
  onError?: (error: Error) => void
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    const parsedError = parseApiError(error);
    console.error(`[${context}] Error:`, {
      message: parsedError.userMessage,
      code: parsedError.statusCode,
      original: error,
    });

    if (onError) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      onError(errorObj);
    }

    return null;
  }
}

/**
 * 同期操作をエラーハンドリングでラップする
 *
 * @param operation - 実行する同期操作
 * @param context - エラーコンテキスト（ログ用）
 * @param defaultValue - エラー時のデフォルト値
 * @returns 操作結果またはデフォルト値（エラー時）
 */
export function withSyncErrorHandling<T>(
  operation: () => T,
  context: string,
  defaultValue: T
): T {
  try {
    return operation();
  } catch (error) {
    console.error(`[${context}] Error:`, error);
    return defaultValue;
  }
}

/**
 * エラーメッセージをユーザーフレンドリーな形式に変換
 *
 * @param error - エラーオブジェクト
 * @returns ユーザーフレンドリーなエラーメッセージ
 */
export function toUserFriendlyError(error: unknown): string {
  const parsed = parseApiError(error);
  return parsed.userMessage;
}
