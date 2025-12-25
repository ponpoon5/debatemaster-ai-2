import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTokenBatcher } from './useTokenBatcher';
import type { TokenUsage } from '../core/types';

describe('useTokenBatcher', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should batch multiple token updates into one', async () => {
    const mockUpdate = vi.fn();
    const { result } = renderHook(() => useTokenBatcher(mockUpdate));

    const usage1: TokenUsage = { inputTokens: 10, outputTokens: 20, totalTokens: 30 };
    const usage2: TokenUsage = { inputTokens: 15, outputTokens: 25, totalTokens: 40 };
    const usage3: TokenUsage = { inputTokens: 5, outputTokens: 10, totalTokens: 15 };

    act(() => {
      result.current(usage1);
      result.current(usage2);
      result.current(usage3);
    });

    // Before timer expires, no update should be called
    expect(mockUpdate).not.toHaveBeenCalled();

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // After timer, should be called once with merged values
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith({
      inputTokens: 30, // 10 + 15 + 5
      outputTokens: 55, // 20 + 25 + 10
      totalTokens: 85, // 30 + 40 + 15
    });
  });

  it('should reset timer if new update arrives within batch window', () => {
    const mockUpdate = vi.fn();
    const { result } = renderHook(() => useTokenBatcher(mockUpdate));

    const usage1: TokenUsage = { inputTokens: 10, outputTokens: 20, totalTokens: 30 };
    const usage2: TokenUsage = { inputTokens: 15, outputTokens: 25, totalTokens: 40 };

    act(() => {
      result.current(usage1);
    });

    // Fast-forward 50ms (half of batch delay)
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Add another update (should reset timer)
    act(() => {
      result.current(usage2);
    });

    // Fast-forward another 50ms (total 100ms, but timer was reset at 50ms)
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Should not have been called yet (only 50ms since last update)
    expect(mockUpdate).not.toHaveBeenCalled();

    // Fast-forward remaining 50ms
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Now should be called
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith({
      inputTokens: 25,
      outputTokens: 45,
      totalTokens: 70,
    });
  });

  it('should handle single update correctly', () => {
    const mockUpdate = vi.fn();
    const { result } = renderHook(() => useTokenBatcher(mockUpdate));

    const usage: TokenUsage = { inputTokens: 10, outputTokens: 20, totalTokens: 30 };

    act(() => {
      result.current(usage);
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith(usage);
  });

  it('should handle zero token values', () => {
    const mockUpdate = vi.fn();
    const { result } = renderHook(() => useTokenBatcher(mockUpdate));

    const usage: TokenUsage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };

    act(() => {
      result.current(usage);
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith(usage);
  });

  it('should clear queue after batch update', () => {
    const mockUpdate = vi.fn();
    const { result } = renderHook(() => useTokenBatcher(mockUpdate));

    const usage1: TokenUsage = { inputTokens: 10, outputTokens: 20, totalTokens: 30 };
    const usage2: TokenUsage = { inputTokens: 5, outputTokens: 10, totalTokens: 15 };

    // First batch
    act(() => {
      result.current(usage1);
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith(usage1);

    // Second batch (should not include first batch)
    act(() => {
      result.current(usage2);
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(mockUpdate).toHaveBeenCalledTimes(2);
    expect(mockUpdate).toHaveBeenNthCalledWith(2, usage2);
  });
});
