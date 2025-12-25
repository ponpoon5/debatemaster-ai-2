/**
 * プロキシサーバー経由でGemini APIを呼び出すクライアント
 */

import type {
  GeminiGenerateContentParams,
  GeminiStreamChunk,
  GeminiUsageMetadata,
  GeminiContent,
  ProxyApiResponse,
  ProxyApiError,
} from '../../core/types/gemini-api.types';
import { streamFromProxy } from './utils/streaming-processor';

const PROXY_URL = import.meta.env.VITE_PROXY_URL || '';

/**
 * 非ストリーミングでコンテンツを生成
 */
export async function generateContentViaProxy(params: GeminiGenerateContentParams): Promise<ProxyApiResponse> {
  const response = await fetch(`${PROXY_URL}/api/gemini/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error: ProxyApiError = await response.json();
    throw new Error(error.message || 'Failed to generate content');
  }

  return await response.json();
}

/**
 * ストリーミングでコンテンツを生成
 */
export async function* generateContentStreamViaProxy(
  params: GeminiGenerateContentParams
): AsyncGenerator<GeminiStreamChunk> {
  yield* streamFromProxy(`${PROXY_URL}/api/gemini/generate-stream`, params);
}

interface ChatStreamParams {
  model: string;
  history: GeminiContent[];
  message: string;
  config?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

/**
 * チャットをストリーミングで実行
 */
export async function* sendChatMessageStreamViaProxy(
  params: ChatStreamParams
): AsyncGenerator<GeminiStreamChunk> {
  yield* streamFromProxy(`${PROXY_URL}/api/gemini/chat-stream`, params);
}

/**
 * プロキシサーバーのヘルスチェック
 */
export async function checkProxyHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${PROXY_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}
