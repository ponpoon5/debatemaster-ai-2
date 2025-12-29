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
  if (!PROXY_URL) {
    throw new Error('PROXY_URL is not configured. Cannot use proxy mode.');
  }

  const url = `${PROXY_URL}/api/gemini/generate`;
  console.log('📡 Proxy request to:', url);

  const response = await fetch(url, {
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
  if (!PROXY_URL) {
    throw new Error('PROXY_URL is not configured. Cannot use proxy mode.');
  }

  const url = `${PROXY_URL}/api/gemini/generate-stream`;
  console.log('📡 Proxy stream request to:', url);

  yield* streamFromProxy(url, params);
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
  if (!PROXY_URL) {
    throw new Error('PROXY_URL is not configured. Cannot use proxy mode.');
  }

  const url = `${PROXY_URL}/api/gemini/chat-stream`;
  console.log('📡 Proxy chat stream request to:', url);

  yield* streamFromProxy(url, params);
}

/**
 * プロキシサーバーのヘルスチェック
 */
export async function checkProxyHealth(): Promise<boolean> {
  if (!PROXY_URL) {
    console.warn('⚠️ PROXY_URL is not configured. Health check skipped.');
    return false;
  }

  try {
    const response = await fetch(`${PROXY_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}
