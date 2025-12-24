import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from './useErrorHandler';
import { ErrorCode } from '../core/types/error.types';

describe('useErrorHandler', () => {
  let alertSpy: any;

  beforeEach(() => {
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('should initialize with null lastError', () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(result.current.lastError).toBeNull();
  });

  it('should provide handleError, clearError, and lastError', () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(result.current).toHaveProperty('handleError');
    expect(result.current).toHaveProperty('clearError');
    expect(result.current).toHaveProperty('lastError');
    expect(typeof result.current.handleError).toBe('function');
    expect(typeof result.current.clearError).toBe('function');
  });

  describe('handleError', () => {
    it('should set lastError and show alert', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = {
        code: ErrorCode.QUOTA_EXCEEDED,
        message: 'APIの利用制限を超過しました',
      };

      act(() => {
        result.current.handleError(error);
      });

      expect(result.current.lastError).toEqual(error);
      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('APIの利用制限を超過'));
    });

    it('should include context in alert message', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = {
        code: ErrorCode.NETWORK_ERROR,
        message: 'ネットワークエラー',
      };

      act(() => {
        result.current.handleError(error, 'データ取得');
      });

      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('データ取得中に'));
    });

    it('should update lastError with each call', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error1 = {
        code: ErrorCode.TIMEOUT,
        message: 'タイムアウト',
      };
      const error2 = {
        code: ErrorCode.PARSE_ERROR,
        message: 'パースエラー',
      };

      act(() => {
        result.current.handleError(error1);
      });
      expect(result.current.lastError).toEqual(error1);

      act(() => {
        result.current.handleError(error2);
      });
      expect(result.current.lastError).toEqual(error2);
      expect(alertSpy).toHaveBeenCalledTimes(2);
    });

    it('should handle service unavailable error', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = {
        code: ErrorCode.SERVICE_UNAVAILABLE,
        message: 'サービス利用不可',
      };

      act(() => {
        result.current.handleError(error);
      });

      expect(result.current.lastError).toEqual(error);
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('AIサービスが一時的に混雑'));
    });

    it('should handle unknown error', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = {
        code: ErrorCode.UNKNOWN,
        message: 'カスタムエラーメッセージ',
      };

      act(() => {
        result.current.handleError(error);
      });

      expect(result.current.lastError).toEqual(error);
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('カスタムエラーメッセージ'));
    });

    it('should include error details if present', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = {
        code: ErrorCode.QUOTA_EXCEEDED,
        message: 'APIの利用制限を超過しました',
        status: 429,
        details: { originalError: 'Detailed info' },
      };

      act(() => {
        result.current.handleError(error);
      });

      expect(result.current.lastError).toEqual(error);
      expect(result.current.lastError?.status).toBe(429);
      expect(result.current.lastError?.details).toEqual({ originalError: 'Detailed info' });
    });
  });

  describe('clearError', () => {
    it('should reset lastError to null', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = {
        code: ErrorCode.TIMEOUT,
        message: 'タイムアウト',
      };

      act(() => {
        result.current.handleError(error);
      });
      expect(result.current.lastError).toEqual(error);

      act(() => {
        result.current.clearError();
      });
      expect(result.current.lastError).toBeNull();
    });

    it('should not throw when called with no error set', () => {
      const { result } = renderHook(() => useErrorHandler());

      expect(() => {
        act(() => {
          result.current.clearError();
        });
      }).not.toThrow();

      expect(result.current.lastError).toBeNull();
    });

    it('should be callable multiple times', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error = {
        code: ErrorCode.NETWORK_ERROR,
        message: 'ネットワークエラー',
      };

      act(() => {
        result.current.handleError(error);
      });

      act(() => {
        result.current.clearError();
      });
      expect(result.current.lastError).toBeNull();

      act(() => {
        result.current.clearError();
      });
      expect(result.current.lastError).toBeNull();
    });
  });

  describe('callback stability', () => {
    it('should maintain handleError reference across renders', () => {
      const { result, rerender } = renderHook(() => useErrorHandler());
      const firstHandleError = result.current.handleError;

      rerender();
      const secondHandleError = result.current.handleError;

      expect(firstHandleError).toBe(secondHandleError);
    });

    it('should maintain clearError reference across renders', () => {
      const { result, rerender } = renderHook(() => useErrorHandler());
      const firstClearError = result.current.clearError;

      rerender();
      const secondClearError = result.current.clearError;

      expect(firstClearError).toBe(secondClearError);
    });
  });

  describe('integration scenarios', () => {
    it('should handle error -> clear -> error cycle', () => {
      const { result } = renderHook(() => useErrorHandler());
      const error1 = {
        code: ErrorCode.QUOTA_EXCEEDED,
        message: 'エラー1',
      };
      const error2 = {
        code: ErrorCode.TIMEOUT,
        message: 'エラー2',
      };

      act(() => {
        result.current.handleError(error1);
      });
      expect(result.current.lastError).toEqual(error1);

      act(() => {
        result.current.clearError();
      });
      expect(result.current.lastError).toBeNull();

      act(() => {
        result.current.handleError(error2);
      });
      expect(result.current.lastError).toEqual(error2);
      expect(alertSpy).toHaveBeenCalledTimes(2);
    });

    it('should work in async error handling scenario', async () => {
      const { result } = renderHook(() => useErrorHandler());

      const asyncOperation = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        throw new Error('Async error');
      };

      try {
        await asyncOperation();
      } catch (error) {
        act(() => {
          result.current.handleError({
            code: ErrorCode.UNKNOWN,
            message: 'Async error',
          });
        });
      }

      expect(result.current.lastError?.message).toBe('Async error');
      expect(alertSpy).toHaveBeenCalledTimes(1);
    });
  });
});
