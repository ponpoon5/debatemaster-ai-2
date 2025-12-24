import { describe, it, expect } from 'vitest';
import { parseApiError, getUserFriendlyMessage } from './error-parser';
import { ErrorCode } from '../types/error.types';

describe('parseApiError', () => {
  describe('quota exceeded errors', () => {
    it('should detect 429 status code', () => {
      const error = { status: 429 };
      const result = parseApiError(error);

      expect(result.code).toBe(ErrorCode.QUOTA_EXCEEDED);
      expect(result.message).toBe('APIの利用制限を超過しました');
      expect(result.status).toBe(429);
    });

    it('should detect quota in error string', () => {
      const error = { message: 'quota exceeded' };
      const result = parseApiError(error);

      expect(result.code).toBe(ErrorCode.QUOTA_EXCEEDED);
    });

    it('should detect 429 in error object', () => {
      const error = { error: 'HTTP 429 error', code: 429 };
      const result = parseApiError(error);

      expect(result.code).toBe(ErrorCode.QUOTA_EXCEEDED);
    });
  });

  describe('service unavailable errors', () => {
    it('should detect 503 status code', () => {
      const error = { status: 503 };
      const result = parseApiError(error);

      expect(result.code).toBe(ErrorCode.SERVICE_UNAVAILABLE);
      expect(result.message).toBe('AIサービスが一時的に利用できません');
      expect(result.status).toBe(503);
    });

    it('should detect 503 in error string', () => {
      const error = { message: 'Service returned 503' };
      const result = parseApiError(error);

      expect(result.code).toBe(ErrorCode.SERVICE_UNAVAILABLE);
    });
  });

  describe('timeout errors', () => {
    it('should detect timeout in error message (Japanese)', () => {
      const error = new Error('タイムアウトしました');
      const result = parseApiError(error);

      expect(result.code).toBe(ErrorCode.TIMEOUT);
      expect(result.message).toBe('通信がタイムアウトしました');
    });

    it('should detect timeout in error message (English)', () => {
      const error = new Error('Request timeout');
      const result = parseApiError(error);

      expect(result.code).toBe(ErrorCode.TIMEOUT);
    });
  });

  describe('status extraction', () => {
    it('should extract status from direct property', () => {
      const error = { status: 404 };
      const result = parseApiError(error);

      expect(result.status).toBe(404);
    });

    it('should extract status from nested response', () => {
      const error = { response: { status: 500 } };
      const result = parseApiError(error);

      expect(result.status).toBe(500);
    });

    it('should handle missing status', () => {
      const error = { message: 'some error' };
      const result = parseApiError(error);

      expect(result.status).toBeUndefined();
    });
  });

  describe('message extraction', () => {
    it('should extract message from Error instance', () => {
      const error = new Error('Custom error message');
      const result = parseApiError(error);

      expect(result.code).toBe(ErrorCode.UNKNOWN);
      expect(result.message).toBe('Custom error message');
    });

    it('should handle string error', () => {
      const error = 'String error';
      const result = parseApiError(error);

      expect(result.code).toBe(ErrorCode.UNKNOWN);
      expect(result.message).toBe('String error');
    });

    it('should provide default message for unknown error', () => {
      const error = {};
      const result = parseApiError(error);

      expect(result.message).toBe('不明なエラーが発生しました');
    });
  });

  describe('error details', () => {
    it('should include original error in details', () => {
      const error = { status: 429, customField: 'value' };
      const result = parseApiError(error);

      expect(result.details).toEqual(error);
    });
  });
});

describe('getUserFriendlyMessage', () => {
  it('should return quota exceeded message', () => {
    const error = {
      code: ErrorCode.QUOTA_EXCEEDED,
      message: 'APIの利用制限を超過しました',
    };
    const message = getUserFriendlyMessage(error);

    expect(message).toContain('APIの利用制限を超過しました');
    expect(message).toContain('プランの上限に達した');
  });

  it('should return service unavailable message', () => {
    const error = {
      code: ErrorCode.SERVICE_UNAVAILABLE,
      message: 'AIサービスが一時的に利用できません',
    };
    const message = getUserFriendlyMessage(error);

    expect(message).toContain('AIサービスが一時的に混雑');
  });

  it('should return timeout message', () => {
    const error = {
      code: ErrorCode.TIMEOUT,
      message: '通信がタイムアウトしました',
    };
    const message = getUserFriendlyMessage(error);

    expect(message).toContain('タイムアウト');
  });

  it('should return network error message', () => {
    const error = {
      code: ErrorCode.NETWORK_ERROR,
      message: 'ネットワークエラー',
    };
    const message = getUserFriendlyMessage(error);

    expect(message).toContain('ネットワークエラー');
  });

  it('should return parse error message', () => {
    const error = {
      code: ErrorCode.PARSE_ERROR,
      message: 'パースエラー',
    };
    const message = getUserFriendlyMessage(error);

    expect(message).toContain('解析に失敗');
  });

  it('should return default message for unknown error code', () => {
    const error = {
      code: ErrorCode.UNKNOWN,
      message: 'カスタムエラー',
    };
    const message = getUserFriendlyMessage(error);

    expect(message).toContain('エラーが発生しました');
    expect(message).toContain('カスタムエラー');
  });

  describe('context prefix', () => {
    it('should add context prefix when provided', () => {
      const error = {
        code: ErrorCode.QUOTA_EXCEEDED,
        message: 'APIの利用制限を超過しました',
      };
      const message = getUserFriendlyMessage(error, 'データ取得');

      expect(message).toContain('データ取得中に');
    });

    it('should not add prefix when context is not provided', () => {
      const error = {
        code: ErrorCode.QUOTA_EXCEEDED,
        message: 'APIの利用制限を超過しました',
      };
      const message = getUserFriendlyMessage(error);

      expect(message).not.toContain('中に');
    });
  });
});
