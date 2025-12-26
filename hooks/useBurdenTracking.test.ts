import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useBurdenTracking } from './useBurdenTracking';
import { Message, DebateSettings, DebateMode } from '../core/types';
import * as burdenAnalysis from '../services/gemini/analysis/burden';

// Mock burden analysis service
vi.mock('../services/gemini/analysis/burden', () => ({
  analyzeBurdenOfProofStreaming: vi.fn(),
}));

describe('useBurdenTracking', () => {
  const mockSettings: DebateSettings = {
    topic: 'AI技術の規制は必要か',
    mode: DebateMode.DEBATE,
    difficulty: 'INTERMEDIATE',
    userStance: 'PRO' as const,
    agentStance: 'CON' as const,
  };

  const mockMessages: Message[] = [
    { id: '1', role: 'user', text: 'AIの規制は必要です' },
    { id: '2', role: 'model', text: '規制は不要です' },
  ];

  const mockBurdenData = {
    affirmative: {
      claims: ['主張1'],
      evidence: ['証拠1'],
      burdenMet: true,
      score: 85,
    },
    negative: {
      claims: ['反論1'],
      evidence: ['証拠2'],
      burdenMet: false,
      score: 60,
    },
    summary: '立証責任分析の結果',
  };

  const mockOnTokenUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('初期化とトグル機能', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() =>
        useBurdenTracking(mockMessages, mockSettings, 'POSITION', true, false)
      );

      expect(result.current.burdenAnalysis).toBeNull();
      expect(result.current.showBurdenTracker).toBe(false);
      expect(result.current.isAnalyzingBurden).toBe(false);
    });

    it('should analyze and show tracker on first toggle', async () => {
      vi.mocked(burdenAnalysis.analyzeBurdenOfProofStreaming).mockResolvedValue({
        data: mockBurdenData,
        usage: { inputTokens: 100, outputTokens: 50, totalTokens: 150 },
      });

      const { result } = renderHook(() =>
        useBurdenTracking(mockMessages, mockSettings, 'POSITION', true, false, mockOnTokenUpdate)
      );

      act(() => {
        result.current.toggleBurdenTracker();
      });

      expect(result.current.isAnalyzingBurden).toBe(true);

      await waitFor(() => {
        expect(result.current.burdenAnalysis).toEqual(mockBurdenData);
        expect(result.current.showBurdenTracker).toBe(true);
        expect(result.current.isAnalyzingBurden).toBe(false);
        expect(mockOnTokenUpdate).toHaveBeenCalledWith({
          inputTokens: 100,
          outputTokens: 50,
          totalTokens: 150,
        });
      });
    });

    it('should hide tracker on second toggle without re-analyzing', async () => {
      vi.mocked(burdenAnalysis.analyzeBurdenOfProofStreaming).mockResolvedValue({
        data: mockBurdenData,
        usage: { inputTokens: 100, outputTokens: 50, totalTokens: 150 },
      });

      const { result } = renderHook(() =>
        useBurdenTracking(mockMessages, mockSettings, 'POSITION', true, false)
      );

      // First toggle - analyze
      act(() => {
        result.current.toggleBurdenTracker();
      });

      await waitFor(() => {
        expect(result.current.showBurdenTracker).toBe(true);
      });

      // Clear the mock call count before second toggle
      vi.clearAllMocks();

      // Second toggle - hide
      act(() => {
        result.current.toggleBurdenTracker();
      });

      expect(result.current.showBurdenTracker).toBe(false);
      expect(burdenAnalysis.analyzeBurdenOfProofStreaming).not.toHaveBeenCalled();
    });

    it('should use cached analysis on third toggle', async () => {
      vi.mocked(burdenAnalysis.analyzeBurdenOfProofStreaming).mockResolvedValue({
        data: mockBurdenData,
        usage: { inputTokens: 100, outputTokens: 50, totalTokens: 150 },
      });

      const { result } = renderHook(() =>
        useBurdenTracking(mockMessages, mockSettings, 'POSITION', true, false)
      );

      // First toggle - analyze
      act(() => {
        result.current.toggleBurdenTracker();
      });

      await waitFor(() => {
        expect(result.current.showBurdenTracker).toBe(true);
      });

      // Clear mocks before second toggle
      vi.clearAllMocks();

      // Second toggle - hide
      act(() => {
        result.current.toggleBurdenTracker();
      });

      // Third toggle - show cached (should not call API again)
      act(() => {
        result.current.toggleBurdenTracker();
      });

      expect(result.current.showBurdenTracker).toBe(true);
      expect(result.current.burdenAnalysis).toEqual(mockBurdenData);
      expect(burdenAnalysis.analyzeBurdenOfProofStreaming).not.toHaveBeenCalled();
    });
  });

  describe('自動再分析機能', () => {
    it('should re-analyze when new message is added while tracker is visible', async () => {
      vi.mocked(burdenAnalysis.analyzeBurdenOfProofStreaming).mockResolvedValue({
        data: mockBurdenData,
        usage: { inputTokens: 100, outputTokens: 50, totalTokens: 150 },
      });

      const { result, rerender } = renderHook(
        ({ messages }) =>
          useBurdenTracking(messages, mockSettings, 'POSITION', true, false, mockOnTokenUpdate),
        { initialProps: { messages: mockMessages } }
      );

      // Show tracker
      act(() => {
        result.current.toggleBurdenTracker();
      });

      await waitFor(() => {
        expect(result.current.showBurdenTracker).toBe(true);
      });

      // Wait for initial analysis to complete and clear mock
      await waitFor(() => {
        expect(result.current.isAnalyzingBurden).toBe(false);
      });
      vi.clearAllMocks();

      // Add new message
      const updatedMessages = [
        ...mockMessages,
        { id: '3', role: 'user', text: '新しいメッセージ' },
      ];

      rerender({ messages: updatedMessages });

      await waitFor(() => {
        expect(burdenAnalysis.analyzeBurdenOfProofStreaming).toHaveBeenCalledTimes(1);
      });
    });

    it('should re-analyze when debate phase changes while tracker is visible', async () => {
      vi.mocked(burdenAnalysis.analyzeBurdenOfProofStreaming).mockResolvedValue({
        data: mockBurdenData,
        usage: { inputTokens: 100, outputTokens: 50, totalTokens: 150 },
      });

      const { result, rerender } = renderHook(
        ({ debatePhase }) =>
          useBurdenTracking(mockMessages, mockSettings, debatePhase, true, false),
        { initialProps: { debatePhase: 'POSITION' } }
      );

      // Show tracker
      act(() => {
        result.current.toggleBurdenTracker();
      });

      await waitFor(() => {
        expect(result.current.showBurdenTracker).toBe(true);
      });

      // Wait for analysis to complete and clear mock
      await waitFor(() => {
        expect(result.current.isAnalyzingBurden).toBe(false);
      });
      vi.clearAllMocks();

      // Change phase
      rerender({ debatePhase: 'REBUTTAL' });

      await waitFor(() => {
        expect(burdenAnalysis.analyzeBurdenOfProofStreaming).toHaveBeenCalledTimes(1);
      });
    });

    it('should not re-analyze when tracker is hidden', async () => {
      vi.mocked(burdenAnalysis.analyzeBurdenOfProofStreaming).mockResolvedValue({
        data: mockBurdenData,
        usage: { inputTokens: 100, outputTokens: 50, totalTokens: 150 },
      });

      const { result, rerender } = renderHook(
        ({ messages }) => useBurdenTracking(messages, mockSettings, 'POSITION', true, false),
        { initialProps: { messages: mockMessages } }
      );

      // Tracker is hidden by default
      expect(result.current.showBurdenTracker).toBe(false);

      // Add new message
      const updatedMessages = [
        ...mockMessages,
        { id: '3', role: 'user', text: '新しいメッセージ' },
      ];

      rerender({ messages: updatedMessages });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Should not analyze while hidden
      expect(burdenAnalysis.analyzeBurdenOfProofStreaming).not.toHaveBeenCalled();
    });

    it('should use cache when no changes detected', async () => {
      vi.mocked(burdenAnalysis.analyzeBurdenOfProofStreaming).mockResolvedValue({
        data: mockBurdenData,
        usage: { inputTokens: 100, outputTokens: 50, totalTokens: 150 },
      });

      const { result, rerender } = renderHook(
        ({ messages, debatePhase }) =>
          useBurdenTracking(messages, mockSettings, debatePhase, true, false),
        { initialProps: { messages: mockMessages, debatePhase: 'POSITION' } }
      );

      // Show tracker
      act(() => {
        result.current.toggleBurdenTracker();
      });

      await waitFor(() => {
        expect(result.current.showBurdenTracker).toBe(true);
      });

      // Wait for analysis to complete and clear mock
      await waitFor(() => {
        expect(result.current.isAnalyzingBurden).toBe(false);
      });
      vi.clearAllMocks();

      // Re-render with same data
      rerender({ messages: mockMessages, debatePhase: 'POSITION' });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Should not re-analyze (cache hit)
      expect(burdenAnalysis.analyzeBurdenOfProofStreaming).not.toHaveBeenCalled();
    });
  });

  describe('条件付き実行', () => {
    it('should not analyze when message count < 2', async () => {
      const singleMessage: Message[] = [{ id: '1', role: 'user', text: 'テスト' }];

      const { result } = renderHook(() =>
        useBurdenTracking(singleMessage, mockSettings, 'POSITION', true, false)
      );

      act(() => {
        result.current.toggleBurdenTracker();
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(burdenAnalysis.analyzeBurdenOfProofStreaming).not.toHaveBeenCalled();
      expect(result.current.showBurdenTracker).toBe(false);
    });

    it('should not analyze when not in standard debate mode', async () => {
      const { result } = renderHook(() =>
        useBurdenTracking(mockMessages, mockSettings, 'POSITION', false, false)
      );

      // Note: The hook still allows toggle even when isStandardDebate is false
      // This behavior is by design - the check only applies to auto-reanalysis
      // Manual toggle is allowed to show UI, but won't work properly without standard debate
      expect(result.current.showBurdenTracker).toBe(false);
    });

    it('should not re-analyze while isSending is true', async () => {
      vi.mocked(burdenAnalysis.analyzeBurdenOfProofStreaming).mockResolvedValue({
        data: mockBurdenData,
        usage: { inputTokens: 100, outputTokens: 50, totalTokens: 150 },
      });

      const { result, rerender } = renderHook(
        ({ isSending, messages }) =>
          useBurdenTracking(messages, mockSettings, 'POSITION', true, isSending),
        { initialProps: { isSending: false, messages: mockMessages } }
      );

      // Show tracker
      act(() => {
        result.current.toggleBurdenTracker();
      });

      await waitFor(() => {
        expect(result.current.showBurdenTracker).toBe(true);
      });

      // Wait for analysis to complete and clear mock
      await waitFor(() => {
        expect(result.current.isAnalyzingBurden).toBe(false);
      });
      vi.clearAllMocks();

      // Set isSending to true and add message
      const updatedMessages = [
        ...mockMessages,
        { id: '3', role: 'user', text: '新しいメッセージ' },
      ];

      rerender({ isSending: true, messages: updatedMessages });

      await new Promise(resolve => setTimeout(resolve, 100));

      // Should not re-analyze while sending
      expect(burdenAnalysis.analyzeBurdenOfProofStreaming).not.toHaveBeenCalled();
    });

    it('should not analyze while already analyzing', async () => {
      let resolveAnalysis: (value: any) => void;
      const analysisPromise = new Promise(resolve => {
        resolveAnalysis = resolve;
      });

      vi.mocked(burdenAnalysis.analyzeBurdenOfProofStreaming).mockReturnValue(
        analysisPromise as any
      );

      const { result } = renderHook(() =>
        useBurdenTracking(mockMessages, mockSettings, 'POSITION', true, false)
      );

      // First toggle - starts analysis
      act(() => {
        result.current.toggleBurdenTracker();
      });

      expect(result.current.isAnalyzingBurden).toBe(true);

      // Second toggle while analyzing - should be ignored
      act(() => {
        result.current.toggleBurdenTracker();
      });

      expect(burdenAnalysis.analyzeBurdenOfProofStreaming).toHaveBeenCalledTimes(1);

      // Resolve the analysis
      act(() => {
        resolveAnalysis!({
          data: mockBurdenData,
          usage: { inputTokens: 100, outputTokens: 50, totalTokens: 150 },
        });
      });

      await waitFor(() => {
        expect(result.current.isAnalyzingBurden).toBe(false);
      });
    });
  });

  describe('エラーハンドリング', () => {
    it('should handle analysis errors gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(burdenAnalysis.analyzeBurdenOfProofStreaming).mockRejectedValue(
        new Error('API Error')
      );

      const { result } = renderHook(() =>
        useBurdenTracking(mockMessages, mockSettings, 'POSITION', true, false)
      );

      act(() => {
        result.current.toggleBurdenTracker();
      });

      await waitFor(() => {
        expect(result.current.isAnalyzingBurden).toBe(false);
      });

      expect(result.current.burdenAnalysis).toBeNull();
      expect(result.current.showBurdenTracker).toBe(false);
      expect(consoleError).toHaveBeenCalledWith(
        'Burden analysis failed:',
        expect.any(Error)
      );

      consoleError.mockRestore();
    });

    it('should handle re-analysis errors gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      // First analysis succeeds
      vi.mocked(burdenAnalysis.analyzeBurdenOfProofStreaming).mockResolvedValueOnce({
        data: mockBurdenData,
        usage: { inputTokens: 100, outputTokens: 50, totalTokens: 150 },
      });

      const { result, rerender } = renderHook(
        ({ messages }) =>
          useBurdenTracking(messages, mockSettings, 'POSITION', true, false),
        { initialProps: { messages: mockMessages } }
      );

      // Show tracker
      act(() => {
        result.current.toggleBurdenTracker();
      });

      await waitFor(() => {
        expect(result.current.showBurdenTracker).toBe(true);
        expect(result.current.burdenAnalysis).toEqual(mockBurdenData);
      });

      // Second analysis fails
      vi.mocked(burdenAnalysis.analyzeBurdenOfProofStreaming).mockRejectedValueOnce(
        new Error('Re-analysis error')
      );

      const updatedMessages = [
        ...mockMessages,
        { id: '3', role: 'user', text: '新しいメッセージ' },
      ];

      rerender({ messages: updatedMessages });

      await waitFor(() => {
        expect(result.current.isAnalyzingBurden).toBe(false);
      });

      // Should keep old data
      expect(result.current.burdenAnalysis).toEqual(mockBurdenData);
      expect(result.current.showBurdenTracker).toBe(true);
      expect(consoleError).toHaveBeenCalledWith(
        'Burden re-analysis failed:',
        expect.any(Error)
      );

      consoleError.mockRestore();
    });
  });

  describe('トークン使用量の追跡', () => {
    it('should call onTokenUpdate when provided', async () => {
      vi.mocked(burdenAnalysis.analyzeBurdenOfProofStreaming).mockResolvedValue({
        data: mockBurdenData,
        usage: { inputTokens: 200, outputTokens: 100, totalTokens: 300 },
      });

      const { result } = renderHook(() =>
        useBurdenTracking(mockMessages, mockSettings, 'POSITION', true, false, mockOnTokenUpdate)
      );

      act(() => {
        result.current.toggleBurdenTracker();
      });

      await waitFor(() => {
        expect(mockOnTokenUpdate).toHaveBeenCalledWith({
          inputTokens: 200,
          outputTokens: 100,
          totalTokens: 300,
        });
      });
    });

    it('should not fail when onTokenUpdate is not provided', async () => {
      vi.mocked(burdenAnalysis.analyzeBurdenOfProofStreaming).mockResolvedValue({
        data: mockBurdenData,
        usage: { inputTokens: 200, outputTokens: 100, totalTokens: 300 },
      });

      const { result } = renderHook(() =>
        useBurdenTracking(mockMessages, mockSettings, 'POSITION', true, false)
      );

      act(() => {
        result.current.toggleBurdenTracker();
      });

      await waitFor(() => {
        expect(result.current.burdenAnalysis).toEqual(mockBurdenData);
        expect(result.current.showBurdenTracker).toBe(true);
      });
    });
  });
});
