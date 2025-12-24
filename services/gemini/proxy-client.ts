/**
 * プロキシサーバー経由でGemini APIを呼び出すクライアント
 */

const PROXY_URL = import.meta.env.VITE_PROXY_URL || '';

interface GenerateContentParams {
  model: string;
  contents: any;
  config?: any;
}

interface StreamChunk {
  text?: string;
  usageMetadata?: any;
  error?: string;
  message?: string;
}

/**
 * 非ストリーミングでコンテンツを生成
 */
export async function generateContentViaProxy(params: GenerateContentParams) {
  const response = await fetch(`${PROXY_URL}/api/gemini/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate content');
  }

  return await response.json();
}

/**
 * ストリーミングでコンテンツを生成
 */
export async function* generateContentStreamViaProxy(
  params: GenerateContentParams
): AsyncGenerator<StreamChunk> {
  const response = await fetch(`${PROXY_URL}/api/gemini/generate-stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to start stream');
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No reader available');

  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              throw new Error(parsed.message || 'Stream error');
            }
            yield parsed;
          } catch (e) {
            // JSON parse error - skip line
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

interface ChatStreamParams {
  model: string;
  history: any[];
  message: string;
  config?: any;
}

/**
 * チャットをストリーミングで実行
 */
export async function* sendChatMessageStreamViaProxy(
  params: ChatStreamParams
): AsyncGenerator<StreamChunk> {
  const response = await fetch(`${PROXY_URL}/api/gemini/chat-stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to start chat stream');
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No reader available');

  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              throw new Error(parsed.message || 'Chat stream error');
            }
            yield parsed;
          } catch (e) {
            // JSON parse error - skip line
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
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
