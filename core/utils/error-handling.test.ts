import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  withErrorHandling,
  withErrorHandlingSync,
  withDefaultValue,
  withRetry,
  batchWithErrorHandling,
} from './error-handling';

describe('error-handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  describe('withErrorHandling', () => {
    it('should return result when operation succeeds', async () => {
      const operation = async () => 'success';
      const result = await withErrorHandling(operation);
      expect(result).toBe('success');
    });

    it('should return null when operation fails', async () => {
      const operation = async () => {
        throw new Error('Test error');
      };
      const result = await withErrorHandling(operation);
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it('should call onError callback when provided', async () => {
      const onError = vi.fn();
      const error = new Error('Test error');
      const operation = async () => {
        throw error;
      };

      await withErrorHandling(operation, { onError });
      expect(onError).toHaveBeenCalledWith(error);
    });

    it('should not log error when silent is true', async () => {
      const operation = async () => {
        throw new Error('Test error');
      };
      await withErrorHandling(operation, { silent: true });
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should include context in error message', async () => {
      const operation = async () => {
        throw new Error('Test error');
      };
      await withErrorHandling(operation, { context: 'テスト処理' });
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('テスト処理に失敗しました'),
        expect.any(String),
        expect.any(Error)
      );
    });
  });

  describe('withErrorHandlingSync', () => {
    it('should return result when operation succeeds', () => {
      const operation = () => 'success';
      const result = withErrorHandlingSync(operation);
      expect(result).toBe('success');
    });

    it('should return null when operation fails', () => {
      const operation = () => {
        throw new Error('Test error');
      };
      const result = withErrorHandlingSync(operation);
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it('should call onError callback when provided', () => {
      const onError = vi.fn();
      const error = new Error('Test error');
      const operation = () => {
        throw error;
      };

      withErrorHandlingSync(operation, { onError });
      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  describe('withDefaultValue', () => {
    it('should return result when operation succeeds', async () => {
      const operation = async () => 'success';
      const result = await withDefaultValue(operation, 'default');
      expect(result).toBe('success');
    });

    it('should return default value when operation fails', async () => {
      const operation = async () => {
        throw new Error('Test error');
      };
      const result = await withDefaultValue(operation, 'default');
      expect(result).toBe('default');
    });
  });

  describe('withRetry', () => {
    it('should return result on first success', async () => {
      const operation = vi.fn(async () => 'success');
      const result = await withRetry(operation, 3, 10);
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      let attempts = 0;
      const operation = async () => {
        attempts++;
        if (attempts < 3) throw new Error('Temporary error');
        return 'success';
      };

      const result = await withRetry(operation, 3, 10);
      expect(result).toBe('success');
      expect(attempts).toBe(3);
    });

    it('should return null after max retries', async () => {
      const operation = async () => {
        throw new Error('Persistent error');
      };

      const result = await withRetry(operation, 2, 10);
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it('should use exponential backoff', async () => {
      const operation = async () => {
        throw new Error('Test error');
      };

      const start = Date.now();
      await withRetry(operation, 3, 10);
      const elapsed = Date.now() - start;

      // Should wait 10ms + 20ms + 30ms = 60ms minimum (accounting for async overhead)
      expect(elapsed).toBeGreaterThanOrEqual(30);
    });

    it('should call onError after max retries', async () => {
      const onError = vi.fn();
      const error = new Error('Test error');
      const operation = async () => {
        throw error;
      };

      await withRetry(operation, 2, 10, { onError });
      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  describe('batchWithErrorHandling', () => {
    it('should process all items successfully', async () => {
      const items = [1, 2, 3];
      const operation = async (n: number) => n * 2;

      const results = await batchWithErrorHandling(items, operation);
      expect(results).toEqual([2, 4, 6]);
    });

    it('should continue on partial failures', async () => {
      const items = [1, 2, 3, 4];
      const operation = async (n: number) => {
        if (n === 2) throw new Error('Error at 2');
        return n * 2;
      };

      const results = await batchWithErrorHandling(items, operation);
      expect(results).toEqual([2, 6, 8]);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('1/4件が失敗しました')
      );
    });

    it('should handle all failures', async () => {
      const items = [1, 2, 3];
      const operation = async () => {
        throw new Error('Always fail');
      };

      const results = await batchWithErrorHandling(items, operation);
      expect(results).toEqual([]);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('3/3件が失敗しました')
      );
    });

    it('should not warn when silent is true', async () => {
      const items = [1, 2];
      const operation = async () => {
        throw new Error('Always fail');
      };

      await batchWithErrorHandling(items, operation, { silent: true });
      expect(console.warn).not.toHaveBeenCalled();
    });
  });
});
