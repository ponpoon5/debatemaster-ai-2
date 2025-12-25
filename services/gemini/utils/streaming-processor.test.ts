import { describe, it, expect, vi } from 'vitest';
import { processSSEStream, createStreamReader, streamFromProxy } from './streaming-processor';
import type { GeminiStreamChunk } from '../../../core/types/gemini-api.types';

// Mock ReadableStream
class MockReadableStream {
  private chunks: Uint8Array[];
  private index = 0;

  constructor(chunks: string[]) {
    const encoder = new TextEncoder();
    this.chunks = chunks.map(chunk => encoder.encode(chunk));
  }

  getReader() {
    return {
      read: async () => {
        if (this.index >= this.chunks.length) {
          return { done: true as const, value: undefined };
        }
        const value = this.chunks[this.index];
        this.index++;
        return { done: false as const, value };
      },
      releaseLock: vi.fn(),
    };
  }
}

describe('streaming-processor', () => {
  describe('processSSEStream', () => {
    it('should process valid SSE chunks', async () => {
      const mockChunks = [
        'data: {"text":"Hello","usageMetadata":{"promptTokenCount":10}}\n',
        'data: {"text":" World","usageMetadata":{"promptTokenCount":5}}\n',
        'data: [DONE]\n',
      ];

      const mockStream = new MockReadableStream(mockChunks);
      const reader = mockStream.getReader();

      const results: GeminiStreamChunk[] = [];
      for await (const chunk of processSSEStream(reader as any)) {
        results.push(chunk);
      }

      expect(results).toHaveLength(2);
      expect(results[0].text).toBe('Hello');
      expect(results[1].text).toBe(' World');
    });

    it('should skip malformed JSON lines', async () => {
      const mockChunks = [
        'data: {"text":"Valid"}\n',
        'data: {invalid json}\n',
        'data: {"text":"Also Valid"}\n',
        'data: [DONE]\n',
      ];

      const mockStream = new MockReadableStream(mockChunks);
      const reader = mockStream.getReader();

      const results: GeminiStreamChunk[] = [];
      for await (const chunk of processSSEStream(reader as any)) {
        results.push(chunk);
      }

      expect(results).toHaveLength(2);
      expect(results[0].text).toBe('Valid');
      expect(results[1].text).toBe('Also Valid');
    });

    it('should stop when [DONE] is received', async () => {
      const mockChunks = [
        'data: {"text":"First"}\n',
        'data: [DONE]\n',
        'data: {"text":"Should not reach here"}\n',
      ];

      const mockStream = new MockReadableStream(mockChunks);
      const reader = mockStream.getReader();

      const results: GeminiStreamChunk[] = [];
      for await (const chunk of processSSEStream(reader as any)) {
        results.push(chunk);
      }

      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('First');
    });

    it('should throw error when chunk contains error field', async () => {
      const mockChunks = [
        'data: {"text":"Valid"}\n',
        'data: {"error":true,"message":"Test error"}\n',
      ];

      const mockStream = new MockReadableStream(mockChunks);
      const reader = mockStream.getReader();

      const results: GeminiStreamChunk[] = [];
      await expect(async () => {
        for await (const chunk of processSSEStream(reader as any)) {
          results.push(chunk);
        }
      }).rejects.toThrow('Test error');
    });

    it('should handle empty lines', async () => {
      const mockChunks = [
        'data: {"text":"First"}\n',
        '\n',
        'data: {"text":"Second"}\n',
        'data: [DONE]\n',
      ];

      const mockStream = new MockReadableStream(mockChunks);
      const reader = mockStream.getReader();

      const results: GeminiStreamChunk[] = [];
      for await (const chunk of processSSEStream(reader as any)) {
        results.push(chunk);
      }

      expect(results).toHaveLength(2);
      expect(results[0].text).toBe('First');
      expect(results[1].text).toBe('Second');
    });

    it('should release lock when done', async () => {
      const mockChunks = ['data: [DONE]\n'];
      const mockStream = new MockReadableStream(mockChunks);
      const reader = mockStream.getReader();
      const releaseLock = vi.spyOn(reader, 'releaseLock');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for await (const _chunk of processSSEStream(reader as any)) {
        // Just iterate
      }

      expect(releaseLock).toHaveBeenCalled();
    });
  });

  describe('createStreamReader', () => {
    it('should throw error if response is not ok', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'Bad Request' }),
      });

      await expect(createStreamReader('http://test.com/api', { test: 'data' })).rejects.toThrow(
        'Bad Request'
      );
    });

    it('should throw error if no reader available', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        body: null,
      });

      await expect(createStreamReader('http://test.com/api', { test: 'data' })).rejects.toThrow(
        'No reader available'
      );
    });

    it('should return reader if response is ok', async () => {
      const mockReader = { read: vi.fn(), releaseLock: vi.fn() };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        body: {
          getReader: () => mockReader,
        },
      });

      const reader = await createStreamReader('http://test.com/api', { test: 'data' });
      expect(reader).toBe(mockReader);
    });
  });

  describe('streamFromProxy', () => {
    it('should integrate createStreamReader and processSSEStream', async () => {
      const mockChunks = [
        'data: {"text":"Integrated"}\n',
        'data: [DONE]\n',
      ];

      const mockStream = new MockReadableStream(mockChunks);
      const mockReader = mockStream.getReader();

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        body: {
          getReader: () => mockReader,
        },
      });

      const results: GeminiStreamChunk[] = [];
      for await (const chunk of streamFromProxy('http://test.com/api', { test: 'data' })) {
        results.push(chunk);
      }

      expect(results).toHaveLength(1);
      expect(results[0].text).toBe('Integrated');
    });
  });
});
