/**
 * Unified API Client
 * 統一APIクライアント層
 */

import { GoogleGenerativeAI, GenerativeModel } from '@google/genai';
import { withRetry, createTimeoutController } from './retry';
import { ApiError, NetworkError, TimeoutError, ApiRequestOptions } from './types';
import { parseApiError } from '../../core/utils/error-parser';

const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * Unified API Client for Gemini
 */
export class GeminiApiClient {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel | null = null;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Initialize model
   */
  initModel(modelName: string = 'gemini-2.0-flash-exp'): GenerativeModel {
    this.model = this.genAI.getGenerativeModel({ model: modelName });
    return this.model;
  }

  /**
   * Get current model (or initialize if not exists)
   */
  getModel(modelName?: string): GenerativeModel {
    if (!this.model || modelName) {
      return this.initModel(modelName);
    }
    return this.model;
  }

  /**
   * Generate content with retry and timeout
   */
  async generateContent(
    prompt: string,
    options: ApiRequestOptions = {}
  ): Promise<string> {
    const timeout = options.timeout || DEFAULT_TIMEOUT;

    return withRetry(async () => {
      const controller = createTimeoutController(timeout);

      try {
        const model = this.getModel();
        const result = await model.generateContent(prompt);

        if (!result.response) {
          throw new ApiError('No response from API');
        }

        const text = result.response.text();
        if (!text) {
          throw new ApiError('Empty response from API');
        }

        return text;
      } catch (error) {
        // Handle timeout
        if (controller.signal.aborted) {
          throw new TimeoutError(`Request timed out after ${timeout}ms`);
        }

        // Handle network errors
        if (error instanceof Error) {
          const message = error.message.toLowerCase();
          if (
            message.includes('network') ||
            message.includes('fetch') ||
            message.includes('connection')
          ) {
            throw new NetworkError('Network error occurred', error);
          }
        }

        // Parse and normalize API errors
        const parsedError = parseApiError(error);
        throw new ApiError(
          parsedError.userMessage,
          parsedError.statusCode,
          error
        );
      }
    }, { timeout, maxRetries: options.retries });
  }

  /**
   * Start chat session with retry support
   */
  startChat(history: Array<{ role: string; parts: Array<{ text: string }> }> = []) {
    const model = this.getModel();
    return model.startChat({ history });
  }

  /**
   * Send message in chat with retry and timeout
   */
  async sendChatMessage(
    chat: ReturnType<GenerativeModel['startChat']>,
    message: string,
    options: ApiRequestOptions = {}
  ): Promise<string> {
    const timeout = options.timeout || DEFAULT_TIMEOUT;

    return withRetry(async () => {
      const controller = createTimeoutController(timeout);

      try {
        const result = await chat.sendMessage(message);

        if (!result.response) {
          throw new ApiError('No response from chat API');
        }

        const text = result.response.text();
        if (!text) {
          throw new ApiError('Empty response from chat API');
        }

        return text;
      } catch (error) {
        // Handle timeout
        if (controller.signal.aborted) {
          throw new TimeoutError(`Chat message timed out after ${timeout}ms`);
        }

        // Handle network errors
        if (error instanceof Error) {
          const message = error.message.toLowerCase();
          if (
            message.includes('network') ||
            message.includes('fetch') ||
            message.includes('connection')
          ) {
            throw new NetworkError('Network error in chat', error);
          }
        }

        // Parse and normalize API errors
        const parsedError = parseApiError(error);
        throw new ApiError(
          parsedError.userMessage,
          parsedError.statusCode,
          error
        );
      }
    }, { timeout, maxRetries: options.retries });
  }
}

// Singleton instance
let apiClientInstance: GeminiApiClient | null = null;

/**
 * Get or create API client instance
 */
export function getApiClient(apiKey?: string): GeminiApiClient {
  if (!apiClientInstance) {
    if (!apiKey) {
      throw new Error('API key is required for first initialization');
    }
    apiClientInstance = new GeminiApiClient(apiKey);
  }
  return apiClientInstance;
}

/**
 * Reset API client (for testing or API key change)
 */
export function resetApiClient(): void {
  apiClientInstance = null;
}
