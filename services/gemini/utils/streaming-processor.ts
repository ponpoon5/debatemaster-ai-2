/**
 * ストリーミング処理の共通ユーティリティ
 * proxy-wrapperとproxy-clientで重複していたストリーミング処理を統一
 */

import type { GeminiStreamChunk, ProxyApiError } from '../../../core/types/gemini-api.types';

/**
 * Server-Sent Events (SSE) 形式のストリームを処理する共通関数
 *
 * @param reader - ReadableStreamのリーダー
 * @param onChunk - チャンクを受信したときのコールバック
 * @param onError - エラー発生時のコールバック
 */
export async function* processSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<GeminiStreamChunk> {
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6); // Remove 'data: ' prefix
          if (data === '[DONE]') return;

          let parsed: GeminiStreamChunk;
          try {
            parsed = JSON.parse(data);
          } catch (e) {
            // JSON parse error - skip malformed line
            console.warn('Failed to parse SSE chunk:', data, e);
            continue;
          }

          // Check for error after successful parsing
          if (parsed.error) {
            throw new Error(parsed.message || 'Stream error');
          }

          yield parsed;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * フェッチレスポンスからストリームリーダーを取得し、エラーハンドリングを行う
 *
 * @param url - フェッチ先のURL
 * @param body - リクエストボディ
 * @returns ReadableStreamのリーダー
 */
export async function createStreamReader(
  url: string,
  body: Record<string, unknown>
): Promise<ReadableStreamDefaultReader<Uint8Array>> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error: ProxyApiError = await response.json();
    throw new Error(error.message || 'Failed to start stream');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No reader available from response body');
  }

  return reader;
}

/**
 * ストリーム全体を処理し、AsyncGeneratorとして返す統合関数
 *
 * @param url - フェッチ先のURL
 * @param body - リクエストボディ
 * @returns ストリームチャンクのAsyncGenerator
 */
export async function* streamFromProxy(
  url: string,
  body: Record<string, unknown>
): AsyncGenerator<GeminiStreamChunk> {
  const reader = await createStreamReader(url, body);
  yield* processSSEStream(reader);
}
