/**
 * プロキシ対応AIクライアントラッパー
 * USE_PROXYフラグに応じて、直接呼び出しとプロキシ経由を自動切替
 */

import { GoogleGenAI } from '@google/genai';
import { API_KEY, USE_PROXY, PROXY_URL } from '../../core/config/gemini.config';
import type {
  GeminiGenerateContentParams,
  GeminiResponse,
  GeminiStreamChunk,
  ProxyApiResponse,
  ProxyApiError,
} from '../../core/types/gemini-api.types';
import { streamFromProxy } from './utils/streaming-processor';
import { withRetry } from '../api/retry';

/**
 * プロキシ経由でAPI呼び出しを行うクライアント
 */
class ProxyAIClient {
  async generateContent(params: GeminiGenerateContentParams): Promise<GeminiResponse> {
    const { model, contents, config } = params;

    return withRetry(async () => {
      // PROXY_URLが空の場合は相対パス（同一ドメイン）を使用
      const url = PROXY_URL ? `${PROXY_URL}/api/gemini/generate` : '/api/gemini/generate';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model, contents, config }),
      });

      if (!response.ok) {
        const error: ProxyApiError = await response.json();
        throw new Error(error.message || 'Proxy request failed');
      }

      const data: ProxyApiResponse = await response.json();
      return {
        text: data.text,
        usageMetadata: data.usageMetadata,
        candidates: data.candidates,
        response: {
          text: () => data.text,
          usageMetadata: data.usageMetadata,
          candidates: data.candidates,
        },
      } as GeminiResponse;
    });
  }

  async *generateContentStream(params: GeminiGenerateContentParams): AsyncGenerator<GeminiStreamChunk> {
    const { model, contents, config } = params;
    // PROXY_URLが空の場合は相対パス（同一ドメイン）を使用
    const url = PROXY_URL ? `${PROXY_URL}/api/gemini/generate-stream` : '/api/gemini/generate-stream';
    yield* streamFromProxy(url, { model, contents, config });
  }
}

/**
 * モデルラッパー
 */
class ModelsWrapper {
  private directClient: GoogleGenAI | null = null;
  private proxyClient: ProxyAIClient | null = null;

  constructor() {
    if (USE_PROXY) {
      this.proxyClient = new ProxyAIClient();
    } else {
      this.directClient = new GoogleGenAI({ apiKey: API_KEY });
    }
  }

  async generateContent(params: GeminiGenerateContentParams): Promise<GeminiResponse> {
    if (USE_PROXY && this.proxyClient) {
      return await this.proxyClient.generateContent(params);
    } else if (this.directClient) {
      return withRetry(async () => {
        return await this.directClient!.models.generateContent(params) as Promise<GeminiResponse>;
      });
    }
    throw new Error('No client available');
  }

  async generateContentStream(params: GeminiGenerateContentParams): AsyncGenerator<GeminiStreamChunk> {
    if (USE_PROXY && this.proxyClient) {
      return this.proxyClient.generateContentStream(params);
    } else if (this.directClient) {
      return this.directClient.models.generateContentStream(params) as AsyncGenerator<GeminiStreamChunk>;
    }
    throw new Error('No client available');
  }
}

/**
 * Chatsラッパー
 */
class ChatsWrapper {
  private wrapper: AIClientWrapper;

  constructor(wrapper: AIClientWrapper) {
    this.wrapper = wrapper;
  }

  create(options: {
    model: string;
    history?: Array<{ role: string; parts: Array<{ text: string }> }>;
    config?: Record<string, unknown>;
  }) {
    // chats.create()は内部でgetGenerativeModel().startChat()を呼ぶだけ
    const genModel = this.wrapper.getGenerativeModel({ model: options.model });
    return genModel.startChat({
      history: options.history,
      systemInstruction: options.config?.systemInstruction,
      generationConfig: options.config,
    });
  }
}

/**
 * AIクライアントラッパー
 */
class AIClientWrapper {
  models: ModelsWrapper;
  chats: ChatsWrapper;

  constructor() {
    console.log('🔧 AIClientWrapper constructor called');
    this.models = new ModelsWrapper();
    this.chats = new ChatsWrapper(this);
    console.log('🔧 chats initialized:', !!this.chats);
  }

  getGenerativeModel(config: { model: string }) {
    // Chat用のモデルインスタンスを返す
    // 直接モードの場合は本物のGoogleGenAI、プロキシモードの場合はラッパー
    if (USE_PROXY) {
      return {
        generateContent: async (params: { contents: unknown; generationConfig?: unknown; config?: unknown }) => {
          return withRetry(async () => {
            const url = PROXY_URL ? `${PROXY_URL}/api/gemini/generate` : '/api/gemini/generate';
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: config.model,
                contents: params.contents,
                config: params.generationConfig || params.config,
              }),
            });

            if (!response.ok) {
              const error: ProxyApiError = await response.json();
              throw new Error(error.message || 'Proxy request failed');
            }

            const data: ProxyApiResponse = await response.json();
            return {
              text: data.text,
              usageMetadata: data.usageMetadata,
              response: {
                text: () => data.text,
                usageMetadata: data.usageMetadata,
              },
            };
          });
        },
        startChat: (chatParams: {
          history?: Array<{ role: string; parts: Array<{ text: string }> }>;
          systemInstruction?: string;
          generationConfig?: unknown;
        }) => {
          // プロキシモード用のチャットラッパー
          // ローカルで会話履歴を蓄積し、各リクエストで送信する
          let accumulatedHistory = chatParams.history || [];

          return {
            sendMessage: async (params: { message: string }) => {
              return withRetry(async () => {
                const url = PROXY_URL ? `${PROXY_URL}/api/gemini/chat` : '/api/gemini/chat';
                const response = await fetch(url, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    model: config.model,
                    history: accumulatedHistory,
                    message: params.message,
                    config: chatParams.generationConfig,
                  }),
                });

                if (!response.ok) {
                  const error = await response.json();
                  throw new Error(error.message || 'Chat request failed');
                }

                const data = await response.json();

                // 履歴に追加（ユーザーメッセージとAIレスポンス）
                accumulatedHistory = [
                  ...accumulatedHistory,
                  { role: 'user', parts: [{ text: message.message }] },
                  { role: 'model', parts: [{ text: data.text }] },
                ];

                return {
                  text: data.text,
                  usageMetadata: data.usageMetadata,
                  response: {
                    text: () => data.text,
                    usageMetadata: data.usageMetadata,
                  },
                };
              });
            },
            sendMessageStream: async (params: { message: string }) => {
              const url = PROXY_URL ? `${PROXY_URL}/api/gemini/chat-stream` : '/api/gemini/chat-stream';
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: config.model,
                  history: accumulatedHistory,
                  message: params.message,
                  config: chatParams.generationConfig,
                }),
              });

              if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Chat stream failed');
              }

              const reader = response.body?.getReader();
              if (!reader) throw new Error('No reader available');

              const decoder = new TextDecoder();

              async function* streamGenerator() {
                let fullText = '';
                try {
                  while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                      if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') {
                          // ストリーム完了時に履歴に追加
                          if (fullText) {
                            accumulatedHistory = [
                              ...accumulatedHistory,
                              { role: 'user', parts: [{ text: message.message }] },
                              { role: 'model', parts: [{ text: fullText }] },
                            ];
                          }
                          return;
                        }

                        try {
                          const parsed = JSON.parse(data);
                          if (parsed.error) {
                            throw new Error(parsed.message || 'Stream error');
                          }
                          const chunkText = parsed.text || '';
                          fullText += chunkText;
                          yield {
                            text: chunkText,
                            usageMetadata: parsed.usageMetadata,
                          };
                        } catch (e) {
                          // JSON parse error - skip
                        }
                      }
                    }
                  }

                  // ストリーム終了時にも履歴に追加（[DONE]がない場合）
                  if (fullText && !accumulatedHistory.some(h => h.role === 'model' && h.parts[0].text === fullText)) {
                    accumulatedHistory = [
                      ...accumulatedHistory,
                      { role: 'user', parts: [{ text: message.message }] },
                      { role: 'model', parts: [{ text: fullText }] },
                    ];
                  }
                } finally {
                  reader.releaseLock();
                }
              }

              return streamGenerator();
            },
          };
        },
      };
    } else {
      // 直接モード - GoogleGenAI v1.34.0ではgetGenerativeModelがないため、
      // 互換性のためのラッパーオブジェクトを返す
      const directClient = new GoogleGenAI({ apiKey: API_KEY });
      return {
        generateContent: async (params: { contents: unknown; generationConfig?: unknown }) => {
          return withRetry(async () => {
            return await directClient.models.generateContent({
              model: config.model,
              contents: params.contents,
              generationConfig: params.generationConfig,
            });
          });
        },
        startChat: (chatParams: {
          history?: Array<{ role: string; parts: Array<{ text: string }> }>;
          systemInstruction?: string;
          generationConfig?: unknown;
        }) => {
          // chatsAPIを使ってチャットセッションを作成
          return directClient.chats.create({
            model: config.model,
            history: chatParams.history,
            config: {
              systemInstruction: chatParams.systemInstruction,
              ...chatParams.generationConfig,
            },
          });
        },
      };
    }
  }
}

export const ai = new AIClientWrapper();

// デバッグログ
console.log('🔧 AI Client Mode:', USE_PROXY ? 'PROXY' : 'DIRECT');
console.log('🔧 API_KEY exists:', !!API_KEY);
console.log('🔧 PROXY_URL:', PROXY_URL);

// PROXY_URLが空の場合は同一ドメインの /api を使用（Vercel等）
if (USE_PROXY && !PROXY_URL) {
  console.log('ℹ️ PROXY_URL is empty, using same-origin /api endpoints (Vercel mode)');
}
