import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useChatTools } from './useChatTools';
import { Message, DebateSettings, DebateMode } from '../core/types';
import * as geminiIndex from '../services/gemini/index';

// Mock Gemini services
vi.mock('../services/gemini/index', () => ({
  getDebateAdviceStreaming: vi.fn(),
  getDebateSummaryStreaming: vi.fn(),
  generateFacilitationBoard: vi.fn(),
  generateLiveStrategyStreaming: vi.fn(),
}));

describe('useChatTools', () => {
  const mockSettings: DebateSettings = {
    topic: 'テストトピック',
    mode: DebateMode.DEBATE,
    difficulty: 'INTERMEDIATE',
    userStance: 'PRO' as const,
    agentStance: 'CON' as const,
  };

  const mockMessages: Message[] = [
    { id: '1', role: 'user', text: 'ユーザーメッセージ1' },
    { id: '2', role: 'model', text: 'AIメッセージ1' },
  ];

  const mockOnTokenUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Advice機能', () => {
    it('should handle advice request successfully', async () => {
      const mockAdviceData = {
        advice: 'テストアドバイス',
        detectedFallacy: null,
        fallacyQuote: null,
        fallacyExplanation: null,
        sentimentScore: 0.8,
      };

      vi.mocked(geminiIndex.getDebateAdviceStreaming).mockResolvedValue({
        ...mockAdviceData,
        usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
      });

      const { result } = renderHook(() =>
        useChatTools({
          messages: mockMessages,
          settings: mockSettings,
          inputText: 'テスト入力',
          isSending: false,
          onTokenUpdate: mockOnTokenUpdate,
        })
      );

      await act(async () => {
        await result.current.getAdvice();
      });

      await waitFor(() => {
        expect(result.current.adviceData.advice).toBe('テストアドバイス');
        expect(result.current.adviceData.sentimentScore).toBe(0.8);
        expect(result.current.showAdvicePanel).toBe(true);
        expect(mockOnTokenUpdate).toHaveBeenCalledWith({
          inputTokens: 10,
          outputTokens: 20,
          totalTokens: 30,
        });
      });
    });

    it('should use cached advice when available', async () => {
      const mockAdviceData = {
        advice: 'キャッシュされたアドバイス',
        detectedFallacy: null,
        fallacyQuote: null,
        fallacyExplanation: null,
        sentimentScore: 0.9,
      };

      vi.mocked(geminiIndex.getDebateAdviceStreaming).mockResolvedValue({
        ...mockAdviceData,
        usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
      });

      const { result } = renderHook(() =>
        useChatTools({
          messages: mockMessages,
          settings: mockSettings,
          inputText: 'テスト入力',
          isSending: false,
        })
      );

      // First call - should fetch
      await act(async () => {
        await result.current.getAdvice();
      });

      expect(geminiIndex.getDebateAdviceStreaming).toHaveBeenCalledTimes(1);

      // Second call with same context - should use cache
      await act(async () => {
        await result.current.getAdvice();
      });

      expect(geminiIndex.getDebateAdviceStreaming).toHaveBeenCalledTimes(1); // Still 1, not called again
      expect(result.current.adviceData.advice).toBe('キャッシュされたアドバイス');
    });
  });

  describe('Strategy機能', () => {
    it('should generate strategy successfully', async () => {
      const mockStrategyData = {
        currentSituation: 'テスト状況',
        suggestedMoves: ['提案1', '提案2'],
        rebuttalTemplate: 'テストテンプレート',
      };

      vi.mocked(geminiIndex.generateLiveStrategyStreaming).mockResolvedValue({
        strategy: mockStrategyData,
        usage: { inputTokens: 15, outputTokens: 25, totalTokens: 40 },
      });

      const { result } = renderHook(() =>
        useChatTools({
          messages: mockMessages,
          settings: mockSettings,
          inputText: '',
          isSending: false,
          onTokenUpdate: mockOnTokenUpdate,
        })
      );

      await act(async () => {
        await result.current.getStrategy();
      });

      await waitFor(() => {
        expect(result.current.strategyData).toEqual(mockStrategyData);
        expect(mockOnTokenUpdate).toHaveBeenCalledWith({
          inputTokens: 15,
          outputTokens: 25,
          totalTokens: 40,
        });
      });
    });

    it('should use cached strategy when context is same', async () => {
      const mockStrategyData = {
        currentSituation: 'キャッシュされた状況',
        suggestedMoves: ['提案A'],
        rebuttalTemplate: 'キャッシュテンプレート',
      };

      vi.mocked(geminiIndex.generateLiveStrategyStreaming).mockResolvedValue({
        strategy: mockStrategyData,
        usage: { inputTokens: 15, outputTokens: 25, totalTokens: 40 },
      });

      const { result } = renderHook(() =>
        useChatTools({
          messages: mockMessages,
          settings: mockSettings,
          inputText: '',
          isSending: false,
        })
      );

      // First call
      await act(async () => {
        await result.current.getStrategy();
      });

      await waitFor(() => {
        expect(result.current.strategyData).toEqual(mockStrategyData);
      });

      // Clear mock and call again with same context
      vi.clearAllMocks();

      // Second call with same message count - should use cache
      await act(async () => {
        await result.current.getStrategy();
      });

      // Should not call API again (cache hit)
      expect(geminiIndex.generateLiveStrategyStreaming).not.toHaveBeenCalled();
      expect(result.current.strategyData).toEqual(mockStrategyData);
    });
  });

  describe('Summary機能', () => {
    it('should generate summary successfully', async () => {
      const mockSummaryPoints = ['ポイント1', 'ポイント2', 'ポイント3'];

      vi.mocked(geminiIndex.getDebateSummaryStreaming).mockResolvedValue({
        points: mockSummaryPoints,
        usage: { inputTokens: 50, outputTokens: 30, totalTokens: 80 },
      });

      const { result } = renderHook(() =>
        useChatTools({
          messages: mockMessages,
          settings: mockSettings,
          inputText: '',
          isSending: false,
          onTokenUpdate: mockOnTokenUpdate,
        })
      );

      await act(async () => {
        await result.current.summaryState.generate();
      });

      await waitFor(() => {
        expect(result.current.summaryState.points).toEqual(mockSummaryPoints);
        expect(result.current.summaryState.isOpen).toBe(true);
        expect(mockOnTokenUpdate).toHaveBeenCalled();
      });
    });
  });

  describe('Whiteboard機能', () => {
    it('should generate whiteboard successfully', async () => {
      const mockBoardData = {
        title: 'テストボード',
        sections: [{ title: 'セクション1', content: '内容1' }],
      };

      vi.mocked(geminiIndex.generateFacilitationBoard).mockResolvedValue({
        board: mockBoardData,
        usage: { inputTokens: 60, outputTokens: 40, totalTokens: 100 },
      });

      const { result } = renderHook(() =>
        useChatTools({
          messages: mockMessages,
          settings: mockSettings,
          inputText: '',
          isSending: false,
          onTokenUpdate: mockOnTokenUpdate,
        })
      );

      await act(async () => {
        await result.current.boardState.generate();
      });

      await waitFor(() => {
        expect(result.current.boardState.data).toEqual(mockBoardData);
        expect(result.current.boardState.isOpen).toBe(true);
        expect(mockOnTokenUpdate).toHaveBeenCalled();
      });
    });
  });

  describe('resetTools', () => {
    it('should reset all tool states', () => {
      const { result } = renderHook(() =>
        useChatTools({
          messages: mockMessages,
          settings: mockSettings,
          inputText: '',
          isSending: false,
        })
      );

      act(() => {
        result.current.resetTools();
      });

      expect(result.current.adviceData).toEqual({
        advice: null,
        detectedFallacy: null,
        fallacyQuote: null,
        fallacyExplanation: null,
        sentimentScore: null,
      });
      expect(result.current.strategyData).toBeNull();
      expect(result.current.showAdvicePanel).toBe(false);
    });
  });
});
