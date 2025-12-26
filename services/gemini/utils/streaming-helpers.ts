import { ai } from '../client';
import { TokenUsage } from '../../../core/types';
import { GeminiGenerateContentParams } from '../../../core/types/gemini-api.types';
import { cleanText } from './text-cleaner';
import { extractUsage } from './token-usage';
import { parseApiError } from '../../../core/utils/error-parser';
import { USE_PROXY } from '../../../core/config/gemini.config';
import { generateContentStreamViaProxy } from '../proxy-client';

/**
 * ストリーミングレスポンスのチャンク情報
 */
export interface StreamingChunk {
  text: string;
  isComplete: boolean;
  usage?: TokenUsage;
}

/**
 * ストリーミングの進捗情報
 */
export interface StreamingProgress {
  stage: string;
  progress: number; // 0-100
  partialData?: string;
}

/**
 * ストリーミングコールバック型
 */
export type StreamingCallback = (progress: StreamingProgress) => void;

/**
 * ストリーミングオプション
 */
export interface StreamingOptions {
  onProgress?: (partialText: string) => void;
  timeout?: number;
  batchSize?: number;
}

/**
 * JSON応答をストリーミングで取得し、完全なJSONをパースして返す
 *
 * @param params - generateContentStreamのパラメータ
 * @param onProgress - 進捗コールバック（部分テキストを受け取る）
 * @returns パースされたJSONデータとトークン使用量
 */
export async function streamJsonContent<T>(
  params: GeminiGenerateContentParams,
  onProgress?: (partialText: string) => void
): Promise<{ data: T; usage: TokenUsage }> {
  let accumulatedText = '';
  let lastUsage: TokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };

  try {
    if (USE_PROXY) {
      // プロキシ経由でストリーミング
      const stream = generateContentStreamViaProxy(params);

      for await (const chunk of stream) {
        const chunkText = chunk.text || '';
        accumulatedText += chunkText;

        if (onProgress) {
          onProgress(accumulatedText);
        }

        if (chunk.usageMetadata) {
          lastUsage = {
            inputTokens: chunk.usageMetadata.inputTokens || 0,
            outputTokens: chunk.usageMetadata.outputTokens || 0,
            totalTokens: chunk.usageMetadata.totalTokens || 0,
          };
        }
      }
    } else {
      // 直接APIを呼び出し（開発用）
      const stream = await ai.models.generateContentStream(params);

      for await (const chunk of stream) {
        const chunkText = chunk.text || '';
        accumulatedText += chunkText;

        if (onProgress) {
          onProgress(accumulatedText);
        }

        if (chunk.usageMetadata) {
          lastUsage = extractUsage(chunk);
        }
      }
    }

    // 完全なJSONをパース
    const cleaned = cleanText(accumulatedText);
    const data = JSON.parse(cleaned) as T;

    return { data, usage: lastUsage };
  } catch (error) {
    // ストリーム中断時、部分結果があれば修復を試みる
    if (accumulatedText.length > 0) {
      console.warn('Stream interrupted, attempting partial parse:', error);

      try {
        const repaired = repairPartialJson(accumulatedText);
        const data = JSON.parse(repaired) as T;
        return { data, usage: lastUsage };
      } catch (repairError) {
        console.error('Could not repair JSON. Partial content:', accumulatedText.substring(0, 200));
      }
    }

    throw error;
  }
}

/**
 * テキスト応答をストリーミングで取得するジェネレーター
 *
 * @param params - generateContentStreamのパラメータ
 * @param batchSize - バッチサイズ（文字数）デフォルトは10文字
 * @yields ストリーミングチャンク
 */
export async function* streamTextContent(
  params: GeminiGenerateContentParams,
  batchSize: number = 10
): AsyncGenerator<StreamingChunk> {
  let buffer = '';
  let accumulatedText = '';
  let lastUsage: TokenUsage | undefined;

  try {
    const stream = await ai.models.generateContentStream(params);

    for await (const chunk of stream) {
      const chunkText = chunk.text || '';
      buffer += chunkText;

      // バッファが一定サイズに達したら出力
      if (buffer.length >= batchSize) {
        accumulatedText += buffer;
        yield {
          text: accumulatedText,
          isComplete: false,
        };
        buffer = '';
      }

      if (chunk.usageMetadata) {
        lastUsage = extractUsage(chunk);
      }
    }

    // 残りのバッファを出力
    if (buffer) {
      accumulatedText += buffer;
    }

    // 最終チャンク
    yield {
      text: accumulatedText,
      isComplete: true,
      usage: lastUsage,
    };
  } catch (error) {
    console.error('Stream error:', error);
    throw error;
  }
}

/**
 * ストリーミングジェネレーターにタイムアウトを適用
 *
 * @param streamGenerator - ストリームジェネレーター
 * @param timeoutMs - タイムアウト時間（ミリ秒）
 * @param onTimeout - タイムアウト時のコールバック
 * @yields ストリームチャンク
 */
export async function* withStreamTimeout<T>(
  streamGenerator: AsyncGenerator<T>,
  timeoutMs: number,
  onTimeout?: () => void
): AsyncGenerator<T> {
  const startTime = Date.now();

  for await (const chunk of streamGenerator) {
    if (Date.now() - startTime > timeoutMs) {
      if (onTimeout) onTimeout();
      throw new Error(`Stream timeout after ${timeoutMs}ms`);
    }
    yield chunk;
  }
}

/**
 * 不完全なJSONを修復する（ベストエフォート）
 *
 * @param partialJson - 不完全なJSON文字列
 * @returns 修復されたJSON文字列
 */
function repairPartialJson(partialJson: string): string {
  let repaired = partialJson.trim();

  // 未閉鎖の中括弧を閉じる
  const openBraces = (repaired.match(/\{/g) || []).length;
  const closeBraces = (repaired.match(/\}/g) || []).length;
  const braceDiff = openBraces - closeBraces;

  if (braceDiff > 0) {
    repaired += '}'.repeat(braceDiff);
  }

  // 未閉鎖の角括弧を閉じる
  const openBrackets = (repaired.match(/\[/g) || []).length;
  const closeBrackets = (repaired.match(/\]/g) || []).length;
  const bracketDiff = openBrackets - closeBrackets;

  if (bracketDiff > 0) {
    repaired += ']'.repeat(bracketDiff);
  }

  // 末尾のカンマを削除（不正なJSON）
  repaired = repaired.replace(/,(\s*[}\]])/, '$1');

  // 未閉鎖の文字列リテラルを閉じる
  const quotes = (repaired.match(/"/g) || []).length;
  if (quotes % 2 !== 0) {
    repaired += '"';
  }

  return repaired;
}
