/**
 * Retry Logic with Exponential Backoff
 * 指数バックオフによるリトライロジック
 */

import { RetryConfig, ApiError, NetworkError, RateLimitError } from './types';

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 4,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  timeout: 30000, // 30 seconds
};

/**
 * Calculate exponential backoff delay with jitter
 */
function calculateBackoff(attempt: number, baseDelay: number, maxDelay: number): number {
  // Exponential backoff: baseDelay * 2^attempt
  const exponentialDelay = baseDelay * Math.pow(2, attempt);

  // Add jitter (random 0-20% variation) to prevent thundering herd
  const jitter = exponentialDelay * 0.2 * Math.random();

  // Cap at maxDelay
  return Math.min(exponentialDelay + jitter, maxDelay);
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof RateLimitError) {
    return true;
  }

  if (error instanceof NetworkError) {
    return true;
  }

  if (error instanceof ApiError) {
    // Retry on 5xx errors (server errors)
    if (error.statusCode && error.statusCode >= 500 && error.statusCode < 600) {
      return true;
    }
    // Retry on 429 (rate limit)
    if (error.statusCode === 429) {
      return true;
    }
    return false;
  }

  // Retry on network errors
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('econnreset') ||
      message.includes('econnrefused')
    );
  }

  return false;
}

/**
 * Execute function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: unknown;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if this is the last attempt
      if (attempt === retryConfig.maxRetries) {
        break;
      }

      // Don't retry if error is not retryable
      if (!isRetryableError(error)) {
        break;
      }

      // Calculate backoff delay
      const delay = calculateBackoff(attempt, retryConfig.baseDelay, retryConfig.maxDelay);

      // Log retry attempt
      console.warn(
        `⚠️ API request failed (attempt ${attempt + 1}/${retryConfig.maxRetries + 1}). ` +
        `Retrying in ${Math.round(delay)}ms...`,
        error instanceof Error ? error.message : error
      );

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // All retries exhausted
  throw lastError;
}

/**
 * Create abort controller with timeout
 */
export function createTimeoutController(timeout: number): AbortController {
  const controller = new AbortController();

  setTimeout(() => {
    controller.abort();
  }, timeout);

  return controller;
}
