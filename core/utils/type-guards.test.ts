import { describe, it, expect } from 'vitest';
import { hasValidUsageMetadata, hasStructureAnalysis, isApiError } from './type-guards';
import { Message } from '../types';
import { ErrorCode } from '../types/error.types';

describe('hasValidUsageMetadata', () => {
  it('should return true when usageMetadata exists', () => {
    const response = {
      usageMetadata: {
        promptTokenCount: 10,
        candidatesTokenCount: 20,
        totalTokenCount: 30,
      },
    };

    expect(hasValidUsageMetadata(response)).toBe(true);
  });

  it('should return false when usageMetadata is null', () => {
    const response = { usageMetadata: null };

    expect(hasValidUsageMetadata(response)).toBe(false);
  });

  it('should return false when usageMetadata is undefined', () => {
    const response = { usageMetadata: undefined };

    expect(hasValidUsageMetadata(response)).toBe(false);
  });

  it('should return false when response is null', () => {
    expect(hasValidUsageMetadata(null)).toBe(false);
  });

  it('should return false when response is undefined', () => {
    expect(hasValidUsageMetadata(undefined)).toBe(false);
  });

  it('should return false when usageMetadata property does not exist', () => {
    const response = { someOtherProperty: 'value' };

    expect(hasValidUsageMetadata(response)).toBe(false);
  });

  it('should return true when usageMetadata is an empty object', () => {
    const response = { usageMetadata: {} };

    expect(hasValidUsageMetadata(response)).toBe(true);
  });
});

describe('hasStructureAnalysis', () => {
  it('should return true and narrow type when structureAnalysis exists', () => {
    const message: Message = {
      role: 'user',
      text: 'Test message',
      structureAnalysis: {
        overall: 8.5,
        claim: 9.0,
        warrant: 8.0,
        backing: 8.5,
        qualifier: 7.0,
        rebuttal: 8.0,
      },
    };

    const result = hasStructureAnalysis(message);
    expect(result).toBe(true);

    // Type narrowing verification (compile-time check)
    if (hasStructureAnalysis(message)) {
      expect(message.structureAnalysis.overall).toBe(8.5);
      expect(message.structureAnalysis.claim).toBe(9.0);
    }
  });

  it('should return false when structureAnalysis is null', () => {
    const message: Message = {
      role: 'user',
      text: 'Test message',
      structureAnalysis: null as any,
    };

    expect(hasStructureAnalysis(message)).toBe(false);
  });

  it('should return false when structureAnalysis is undefined', () => {
    const message: Message = {
      role: 'user',
      text: 'Test message',
      structureAnalysis: undefined,
    };

    expect(hasStructureAnalysis(message)).toBe(false);
  });

  it('should return false when structureAnalysis property does not exist', () => {
    const message: Message = {
      role: 'user',
      text: 'Test message',
    };

    expect(hasStructureAnalysis(message)).toBe(false);
  });

  it('should work with filter to narrow array type', () => {
    const messages: Message[] = [
      {
        role: 'user',
        text: 'Message 1',
        structureAnalysis: {
          overall: 8.0,
          claim: 8.0,
          warrant: 8.0,
          backing: 8.0,
          qualifier: 8.0,
          rebuttal: 8.0,
        },
      },
      {
        role: 'user',
        text: 'Message 2',
        structureAnalysis: undefined,
      },
      {
        role: 'user',
        text: 'Message 3',
        structureAnalysis: {
          overall: 9.0,
          claim: 9.0,
          warrant: 9.0,
          backing: 9.0,
          qualifier: 9.0,
          rebuttal: 9.0,
        },
      },
    ];

    const analyzed = messages.filter(hasStructureAnalysis);

    expect(analyzed).toHaveLength(2);
    // Type is now narrowed to AnalyzedMessage[]
    analyzed.forEach(msg => {
      expect(msg.structureAnalysis.overall).toBeGreaterThan(0);
    });
  });
});

describe('isApiError', () => {
  it('should return true for valid ApiError object', () => {
    const error = {
      code: ErrorCode.QUOTA_EXCEEDED,
      message: 'Test error',
    };

    expect(isApiError(error)).toBe(true);
  });

  it('should return true when status and details are included', () => {
    const error = {
      code: ErrorCode.NETWORK_ERROR,
      message: 'Network error',
      status: 500,
      details: { additional: 'info' },
    };

    expect(isApiError(error)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isApiError(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isApiError(undefined)).toBe(false);
  });

  it('should return false for string', () => {
    expect(isApiError('error string')).toBe(false);
  });

  it('should return false for number', () => {
    expect(isApiError(404)).toBe(false);
  });

  it('should return false for Error instance without code', () => {
    const error = new Error('Standard error');

    expect(isApiError(error)).toBe(false);
  });

  it('should return false for object without code property', () => {
    const error = {
      message: 'Error message',
      status: 500,
    };

    expect(isApiError(error)).toBe(false);
  });

  it('should return true for Error instance with code property', () => {
    const error = new Error('Error with code');
    (error as any).code = ErrorCode.TIMEOUT;

    expect(isApiError(error)).toBe(true);
  });

  it('should work as type guard in conditional', () => {
    const unknownError: unknown = {
      code: ErrorCode.PARSE_ERROR,
      message: 'Parse failed',
    };

    if (isApiError(unknownError)) {
      // Type is narrowed to ApiError
      expect(unknownError.code).toBe(ErrorCode.PARSE_ERROR);
      expect(unknownError.message).toBe('Parse failed');
    }
  });
});
