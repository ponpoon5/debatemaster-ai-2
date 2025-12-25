import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChatState } from './useChatState';

describe('useChatState', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useChatState());

    expect(result.current.inputText).toBe('');
    expect(result.current.showBuilder).toBe(false);
    expect(result.current.builderMode).toBe('builder');
    expect(result.current.showGymModal).toBe(false);
    expect(result.current.showHomeworkModal).toBe(false);
    expect(result.current.gymInitialTab).toBe('ai_topic');
    expect(result.current.isAutoPlaying).toBe(false);
  });

  it('should update inputText', () => {
    const { result } = renderHook(() => useChatState());

    act(() => {
      result.current.setInputText('Hello World');
    });

    expect(result.current.inputText).toBe('Hello World');
  });

  it('should toggle showBuilder', () => {
    const { result } = renderHook(() => useChatState());

    act(() => {
      result.current.setShowBuilder(true);
    });

    expect(result.current.showBuilder).toBe(true);

    act(() => {
      result.current.setShowBuilder(false);
    });

    expect(result.current.showBuilder).toBe(false);
  });

  it('should switch builderMode', () => {
    const { result } = renderHook(() => useChatState());

    act(() => {
      result.current.setBuilderMode('rebuttal');
    });

    expect(result.current.builderMode).toBe('rebuttal');

    act(() => {
      result.current.setBuilderMode('builder');
    });

    expect(result.current.builderMode).toBe('builder');
  });

  it('should toggle showGymModal', () => {
    const { result } = renderHook(() => useChatState());

    act(() => {
      result.current.setShowGymModal(true);
    });

    expect(result.current.showGymModal).toBe(true);
  });

  it('should toggle showHomeworkModal', () => {
    const { result } = renderHook(() => useChatState());

    act(() => {
      result.current.setShowHomeworkModal(true);
    });

    expect(result.current.showHomeworkModal).toBe(true);
  });

  it('should change gymInitialTab', () => {
    const { result } = renderHook(() => useChatState());

    act(() => {
      result.current.setGymInitialTab('custom_topic');
    });

    expect(result.current.gymInitialTab).toBe('custom_topic');
  });

  it('should toggle isAutoPlaying', () => {
    const { result } = renderHook(() => useChatState());

    act(() => {
      result.current.setIsAutoPlaying(true);
    });

    expect(result.current.isAutoPlaying).toBe(true);

    act(() => {
      result.current.setIsAutoPlaying(false);
    });

    expect(result.current.isAutoPlaying).toBe(false);
  });

  it('should maintain independent state for each instance', () => {
    const { result: result1 } = renderHook(() => useChatState());
    const { result: result2 } = renderHook(() => useChatState());

    act(() => {
      result1.current.setInputText('Instance 1');
      result2.current.setInputText('Instance 2');
    });

    expect(result1.current.inputText).toBe('Instance 1');
    expect(result2.current.inputText).toBe('Instance 2');
  });
});
