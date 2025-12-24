/**
 * プロキシ対応AIクライアントラッパー
 * USE_PROXYフラグに応じて、直接呼び出しとプロキシ経由を自動切替
 */

import { GoogleGenAI } from '@google/genai';
import { API_KEY, USE_PROXY, PROXY_URL } from '../../core/config/gemini.config';

/**
 * プロキシ経由でAPI呼び出しを行うクライアント
 */
class ProxyAIClient {
  async generateContent(params: any): Promise<any> {
    const { model, contents, config } = params;

    const response = await fetch(`${PROXY_URL}/api/gemini/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, contents, config }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Proxy request failed');
    }

    const data = await response.json();
    return {
      text: data.text,
      usageMetadata: data.usageMetadata,
      response: {
        text: () => data.text,
        usageMetadata: data.usageMetadata,
      },
    };
  }

  async *generateContentStream(params: any): AsyncGenerator<any> {
    const { model, contents, config } = params;

    const response = await fetch(`${PROXY_URL}/api/gemini/generate-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, contents, config }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Proxy stream request failed');
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
              yield {
                text: parsed.text || '',
                usageMetadata: parsed.usageMetadata,
              };
            } catch (e) {
              // JSON parse error - skip
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
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

  async generateContent(params: any): Promise<any> {
    if (USE_PROXY && this.proxyClient) {
      return await this.proxyClient.generateContent(params);
    } else if (this.directClient) {
      return await this.directClient.models.generateContent(params);
    }
    throw new Error('No client available');
  }

  async generateContentStream(params: any): AsyncGenerator<any> {
    if (USE_PROXY && this.proxyClient) {
      return this.proxyClient.generateContentStream(params);
    } else if (this.directClient) {
      return this.directClient.models.generateContentStream(params);
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

  create(options: any) {
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
        generateContent: async (params: any) => {
          const response = await fetch(`${PROXY_URL}/api/gemini/generate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: config.model,
              contents: params.contents,
              config: params.generationConfig,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Proxy request failed');
          }

          const data = await response.json();
          return {
            response: {
              text: () => data.text,
              usageMetadata: data.usageMetadata,
            },
          };
        },
        startChat: (chatParams: any) => {
          // プロキシモード用のチャットラッパー
          // 注意: sendMessage（非ストリーミング）は現在プロキシ未対応のため、
          // フロントエンドで直接Gemini APIを呼び出す（開発環境推奨）
          return {
            sendMessage: async (message: any) => {
              const response = await fetch(`${PROXY_URL}/api/gemini/chat`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: config.model,
                  history: chatParams.history || [],
                  message: message.message,
                  config: chatParams.generationConfig,
                }),
              });

              if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Chat request failed');
              }

              const data = await response.json();
              return {
                text: data.text,
                usageMetadata: data.usageMetadata,
                response: {
                  text: () => data.text,
                  usageMetadata: data.usageMetadata,
                },
              };
            },
            sendMessageStream: async (message: any) => {
              const response = await fetch(`${PROXY_URL}/api/gemini/chat-stream`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: config.model,
                  history: chatParams.history || [],
                  message: message.message,
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
                          yield {
                            text: parsed.text || '',
                            usageMetadata: parsed.usageMetadata,
                          };
                        } catch (e) {
                          // JSON parse error - skip
                        }
                      }
                    }
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
        generateContent: async (params: any) => {
          return await directClient.models.generateContent({
            model: config.model,
            contents: params.contents,
            generationConfig: params.generationConfig,
          });
        },
        startChat: (chatParams: any) => {
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
