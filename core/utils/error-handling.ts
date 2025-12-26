/**
 * Unified Error Handling Utilities
 * エラーハンドリング統一ユーティリティ
 */

/**
 * エラーメッセージを抽出する内部ヘルパー関数
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return '不明なエラー';
}

export interface ErrorHandlingOptions {
  /** エラー発生時に表示するコンテキスト情報 */
  context?: string;
  /** エラーをログに記録するかどうか（デフォルト: true） */
  silent?: boolean;
  /** リトライ可能なエラーかどうかを示すフラグ */
  canRetry?: boolean;
  /** エラー発生時のコールバック */
  onError?: (error: Error) => void;
}

/**
 * 非同期操作をエラーハンドリングでラップする
 * @param operation 実行する非同期操作
 * @param options エラーハンドリングオプション
 * @returns 操作の結果、またはエラー時はnull
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  options: ErrorHandlingOptions = {}
): Promise<T | null> {
  const { context = '処理', silent = false, onError } = options;

  try {
    return await operation();
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    if (!silent) {
      console.error(`❌ ${context}に失敗しました:`, errorMessage, error);
    }

    if (onError && error instanceof Error) {
      onError(error);
    }

    return null;
  }
}

/**
 * 同期操作をエラーハンドリングでラップする
 * @param operation 実行する同期操作
 * @param options エラーハンドリングオプション
 * @returns 操作の結果、またはエラー時はnull
 */
export function withErrorHandlingSync<T>(
  operation: () => T,
  options: ErrorHandlingOptions = {}
): T | null {
  const { context = '処理', silent = false, onError } = options;

  try {
    return operation();
  } catch (error) {
    const errorMessage = getErrorMessage(error);

    if (!silent) {
      console.error(`❌ ${context}に失敗しました:`, errorMessage, error);
    }

    if (onError && error instanceof Error) {
      onError(error);
    }

    return null;
  }
}

/**
 * エラーを安全に処理し、デフォルト値を返す
 * @param operation 実行する非同期操作
 * @param defaultValue エラー時のデフォルト値
 * @param options エラーハンドリングオプション
 * @returns 操作の結果、またはデフォルト値
 */
export async function withDefaultValue<T>(
  operation: () => Promise<T>,
  defaultValue: T,
  options: ErrorHandlingOptions = {}
): Promise<T> {
  const result = await withErrorHandling(operation, options);
  return result !== null ? result : defaultValue;
}

/**
 * 複数のリトライを伴う非同期操作
 * @param operation 実行する非同期操作
 * @param maxRetries 最大リトライ回数
 * @param delay リトライ間の遅延（ミリ秒）
 * @param options エラーハンドリングオプション
 * @returns 操作の結果、またはエラー時はnull
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  options: ErrorHandlingOptions = {}
): Promise<T | null> {
  const { context = '処理', silent = false } = options;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;

      if (!silent) {
        if (isLastAttempt) {
          console.error(`❌ ${context}に失敗しました（${attempt}/${maxRetries}回目）:`, error);
        } else {
          console.warn(`⚠️ ${context}に失敗（${attempt}/${maxRetries}回目）、リトライします...`, error);
        }
      }

      if (isLastAttempt) {
        if (options.onError && error instanceof Error) {
          options.onError(error);
        }
        return null;
      }

      // 指数バックオフ
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  return null;
}

/**
 * バッチ処理用のエラーハンドリング
 * 一部が失敗しても続行し、成功したもののみ返す
 * @param items 処理対象のアイテム配列
 * @param operation 各アイテムに適用する操作
 * @param options エラーハンドリングオプション
 * @returns 成功した結果の配列
 */
export async function batchWithErrorHandling<T, R>(
  items: T[],
  operation: (item: T) => Promise<R>,
  options: ErrorHandlingOptions = {}
): Promise<R[]> {
  const { context = 'バッチ処理', silent = false } = options;
  const results: R[] = [];
  let failedCount = 0;

  for (const item of items) {
    const result = await withErrorHandling(
      () => operation(item),
      { ...options, silent: true }
    );

    if (result !== null) {
      results.push(result);
    } else {
      failedCount++;
    }
  }

  if (!silent && failedCount > 0) {
    console.warn(`⚠️ ${context}: ${failedCount}/${items.length}件が失敗しました`);
  }

  return results;
}
