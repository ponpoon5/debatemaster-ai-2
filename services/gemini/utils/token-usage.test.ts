import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { extractUsage } from './token-usage';

describe('extractUsage', () => {
  let consoleWarnSpy: any;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('valid responses', () => {
    it('should extract usage from complete response', () => {
      const response = {
        usageMetadata: {
          promptTokenCount: 100,
          candidatesTokenCount: 50,
          totalTokenCount: 150,
        },
      };

      const result = extractUsage(response);

      expect(result).toEqual({
        inputTokens: 100,
        outputTokens: 50,
        totalTokens: 150,
      });
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should handle zero token counts', () => {
      const response = {
        usageMetadata: {
          promptTokenCount: 0,
          candidatesTokenCount: 0,
          totalTokenCount: 0,
        },
      };

      const result = extractUsage(response);

      expect(result).toEqual({
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      });
    });

    it('should handle large token counts', () => {
      const response = {
        usageMetadata: {
          promptTokenCount: 999999,
          candidatesTokenCount: 888888,
          totalTokenCount: 1888887,
        },
      };

      const result = extractUsage(response);

      expect(result).toEqual({
        inputTokens: 999999,
        outputTokens: 888888,
        totalTokens: 1888887,
      });
    });
  });

  describe('missing or null usageMetadata', () => {
    it('should return zero values when usageMetadata is null', () => {
      const response = { usageMetadata: null };

      const result = extractUsage(response);

      expect(result).toEqual({
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      });
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'usageMetadata is null/undefined in response:',
        response
      );
    });

    it('should return zero values when usageMetadata is undefined', () => {
      const response = { usageMetadata: undefined };

      const result = extractUsage(response);

      expect(result).toEqual({
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      });
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should return zero values when usageMetadata property does not exist', () => {
      const response = { someOtherProperty: 'value' };

      const result = extractUsage(response);

      expect(result).toEqual({
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      });
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should return zero values when response is null', () => {
      const result = extractUsage(null);

      expect(result).toEqual({
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      });
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should return zero values when response is undefined', () => {
      const result = extractUsage(undefined);

      expect(result).toEqual({
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      });
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });

  describe('partial or malformed usageMetadata', () => {
    it('should use 0 for missing promptTokenCount', () => {
      const response = {
        usageMetadata: {
          candidatesTokenCount: 50,
          totalTokenCount: 50,
        },
      };

      const result = extractUsage(response);

      expect(result).toEqual({
        inputTokens: 0,
        outputTokens: 50,
        totalTokens: 50,
      });
    });

    it('should use 0 for missing candidatesTokenCount', () => {
      const response = {
        usageMetadata: {
          promptTokenCount: 100,
          totalTokenCount: 100,
        },
      };

      const result = extractUsage(response);

      expect(result).toEqual({
        inputTokens: 100,
        outputTokens: 0,
        totalTokens: 100,
      });
    });

    it('should use 0 for missing totalTokenCount', () => {
      const response = {
        usageMetadata: {
          promptTokenCount: 100,
          candidatesTokenCount: 50,
        },
      };

      const result = extractUsage(response);

      expect(result).toEqual({
        inputTokens: 100,
        outputTokens: 50,
        totalTokens: 0,
      });
    });

    it('should handle null values in token counts', () => {
      const response = {
        usageMetadata: {
          promptTokenCount: null,
          candidatesTokenCount: null,
          totalTokenCount: null,
        },
      };

      const result = extractUsage(response);

      expect(result).toEqual({
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      });
    });

    it('should handle undefined values in token counts', () => {
      const response = {
        usageMetadata: {
          promptTokenCount: undefined,
          candidatesTokenCount: undefined,
          totalTokenCount: undefined,
        },
      };

      const result = extractUsage(response);

      expect(result).toEqual({
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      });
    });

    it('should handle empty usageMetadata object', () => {
      const response = {
        usageMetadata: {},
      };

      const result = extractUsage(response);

      expect(result).toEqual({
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
      });
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle negative token counts (fallback to 0)', () => {
      const response = {
        usageMetadata: {
          promptTokenCount: -10,
          candidatesTokenCount: -5,
          totalTokenCount: -15,
        },
      };

      const result = extractUsage(response);

      // Nullish coalescing only handles null/undefined, not negative numbers
      expect(result).toEqual({
        inputTokens: -10,
        outputTokens: -5,
        totalTokens: -15,
      });
    });

    it('should handle string values in token counts', () => {
      const response = {
        usageMetadata: {
          promptTokenCount: '100' as any,
          candidatesTokenCount: '50' as any,
          totalTokenCount: '150' as any,
        },
      };

      const result = extractUsage(response);

      // Type coercion doesn't happen with ?? operator
      expect(result).toEqual({
        inputTokens: '100',
        outputTokens: '50',
        totalTokens: '150',
      });
    });

    it('should handle floating point token counts', () => {
      const response = {
        usageMetadata: {
          promptTokenCount: 100.5,
          candidatesTokenCount: 50.3,
          totalTokenCount: 150.8,
        },
      };

      const result = extractUsage(response);

      expect(result).toEqual({
        inputTokens: 100.5,
        outputTokens: 50.3,
        totalTokens: 150.8,
      });
    });
  });
});
