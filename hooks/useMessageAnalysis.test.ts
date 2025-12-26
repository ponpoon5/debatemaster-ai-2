import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMessageAnalysis } from './useMessageAnalysis';
import { Message, DebateSettings, DebateMode } from '../core/types';
import * as geminiIndex from '../services/gemini/index';

// Mock toast
vi.mock('./useToast', () => ({
  useToast: () => ({
    showError: vi.fn(),
  }),
}));

// Mock Gemini services
vi.mock('../services/gemini/index', () => ({
  analyzeFactOpinion: vi.fn(),
  cleanText: vi.fn((text: string) => text),
  analyzeDebatePhase: vi.fn(),
  analyzeUtteranceStructureStreaming: vi.fn(),
}));

// Mock mode helpers
vi.mock('../core/utils/mode-helpers', () => ({
  isDemoMode: vi.fn((settings) => settings.mode === 'DEMO'),
  requiresDebateAnalysis: vi.fn((settings) =>
    settings.mode === 'DEBATE' || settings.mode === 'STUDY' || settings.mode === 'DRILL'
  ),
}));

describe('useMessageAnalysis', () => {
  const mockDebateSettings: DebateSettings = {
    topic: 'テストトピック',
    mode: DebateMode.DEBATE,
    difficulty: 'INTERMEDIATE',
    userStance: 'PRO' as const,
    agentStance: 'CON' as const,
  };

  const mockOnTokenUpdate = vi.fn();
  const mockOnStructureAnalysisComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up default mocks to prevent undefined errors
    vi.mocked(geminiIndex.analyzeUtteranceStructureStreaming).mockResolvedValue({
      result: { claim: '', reasoning: '', evidence: '', overallScore: 0 },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    });

    vi.mocked(geminiIndex.analyzeDebatePhase).mockResolvedValue({
      result: { phase: 'POSITION' as const, summary: '' },
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    });
  });

  describe('Incremental Processing (Phase 2 Optimization)', () => {
    it('should process only new messages after initial load', async () => {
      const initialMessages: Message[] = [
        { id: '1', role: 'user', text: 'Initial message for testing' },
      ];

      vi.mocked(geminiIndex.analyzeFactOpinion).mockResolvedValue({
        analysis: { factCount: 1, opinionCount: 1 },
        usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 },
      });

      const { rerender } = renderHook(
        ({ messages }) =>
          useMessageAnalysis({
            messages,
            settings: mockDebateSettings,
            onTokenUpdate: mockOnTokenUpdate,
          }),
        { initialProps: { messages: initialMessages } }
      );

      await waitFor(() => {
        expect(geminiIndex.analyzeFactOpinion).toHaveBeenCalledTimes(1);
      });

      // Add a new message
      const updatedMessages: Message[] = [
        ...initialMessages,
        { id: '2', role: 'user', text: 'Second message for testing' },
      ];

      rerender({ messages: updatedMessages });

      await waitFor(() => {
        expect(geminiIndex.analyzeFactOpinion).toHaveBeenCalledTimes(2);
      });
    });

    it('should not reprocess old messages on re-render', async () => {
      const messages: Message[] = [
        { id: '1', role: 'user', text: 'Test message one' },
        { id: '2', role: 'user', text: 'Test message two' },
      ];

      vi.mocked(geminiIndex.analyzeFactOpinion).mockResolvedValue({
        analysis: { factCount: 1, opinionCount: 1 },
        usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 },
      });

      const { rerender } = renderHook(
        ({ messages }) =>
          useMessageAnalysis({
            messages,
            settings: mockDebateSettings,
            onTokenUpdate: mockOnTokenUpdate,
          }),
        { initialProps: { messages } }
      );

      await waitFor(() => {
        expect(geminiIndex.analyzeFactOpinion).toHaveBeenCalledTimes(2);
      });

      // Re-render with same messages (simulating state update elsewhere)
      rerender({ messages });

      // Wait a bit to ensure no additional calls
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(geminiIndex.analyzeFactOpinion).toHaveBeenCalledTimes(2); // Still 2, not more
    });
  });

  describe('Fact/Opinion Analysis', () => {
    it('should analyze user messages and update state', async () => {
      const messages: Message[] = [
        { id: '1', role: 'user', text: 'This is a factual statement with evidence' },
      ];

      const mockAnalysis = { factCount: 2, opinionCount: 0 };
      vi.mocked(geminiIndex.analyzeFactOpinion).mockResolvedValue({
        analysis: mockAnalysis,
        usage: { inputTokens: 15, outputTokens: 8, totalTokens: 23 },
      });

      const { result } = renderHook(() =>
        useMessageAnalysis({
          messages,
          settings: mockDebateSettings,
          onTokenUpdate: mockOnTokenUpdate,
        })
      );

      await waitFor(() => {
        expect(result.current.analyses['1']).toEqual(mockAnalysis);
        expect(mockOnTokenUpdate).toHaveBeenCalledWith({
          inputTokens: 15,
          outputTokens: 8,
          totalTokens: 23,
        });
      });
    });

    it('should skip messages shorter than 10 characters', async () => {
      const messages: Message[] = [
        { id: '1', role: 'user', text: 'Short' },
        { id: '2', role: 'user', text: 'This is long enough to analyze' },
      ];

      vi.mocked(geminiIndex.analyzeFactOpinion).mockResolvedValue({
        analysis: { factCount: 1, opinionCount: 1 },
        usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 },
      });

      renderHook(() =>
        useMessageAnalysis({
          messages,
          settings: mockDebateSettings,
        })
      );

      await waitFor(() => {
        expect(geminiIndex.analyzeFactOpinion).toHaveBeenCalledTimes(1);
        expect(geminiIndex.analyzeFactOpinion).toHaveBeenCalledWith(
          'This is long enough to analyze'
        );
      });
    });

    it('should skip model messages for fact/opinion analysis', async () => {
      const messages: Message[] = [
        { id: '1', role: 'model', text: 'AI response message here' },
        { id: '2', role: 'user', text: 'User message to analyze' },
      ];

      vi.mocked(geminiIndex.analyzeFactOpinion).mockResolvedValue({
        analysis: { factCount: 1, opinionCount: 1 },
        usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 },
      });

      renderHook(() =>
        useMessageAnalysis({
          messages,
          settings: mockDebateSettings,
        })
      );

      await waitFor(() => {
        expect(geminiIndex.analyzeFactOpinion).toHaveBeenCalledTimes(1);
        expect(geminiIndex.analyzeFactOpinion).toHaveBeenCalledWith('User message to analyze');
      });
    });
  });

  describe('Structure Analysis', () => {
    it('should analyze structure for debate mode messages', async () => {
      const messages: Message[] = [
        {
          id: '1',
          role: 'user',
          text: 'Structured argument with claim and reasoning',
        },
      ];

      const mockStructure = {
        claim: 'Main claim',
        reasoning: 'Supporting reasoning',
        evidence: 'Evidence provided',
        overallScore: 85,
      };

      vi.mocked(geminiIndex.analyzeFactOpinion).mockResolvedValue({
        analysis: { factCount: 1, opinionCount: 1 },
        usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 },
      });

      vi.mocked(geminiIndex.analyzeUtteranceStructureStreaming).mockResolvedValue({
        result: mockStructure,
        usage: { inputTokens: 20, outputTokens: 15, totalTokens: 35 },
      });

      renderHook(() =>
        useMessageAnalysis({
          messages,
          settings: mockDebateSettings,
          onTokenUpdate: mockOnTokenUpdate,
          onStructureAnalysisComplete: mockOnStructureAnalysisComplete,
        })
      );

      await waitFor(() => {
        expect(geminiIndex.analyzeUtteranceStructureStreaming).toHaveBeenCalledWith(messages[0]);
        expect(mockOnStructureAnalysisComplete).toHaveBeenCalledWith('1', mockStructure);
        expect(mockOnTokenUpdate).toHaveBeenCalledWith({
          inputTokens: 20,
          outputTokens: 15,
          totalTokens: 35,
        });
      });
    });

    it('should not analyze structure in demo mode', async () => {
      const demoSettings: DebateSettings = {
        ...mockDebateSettings,
        mode: DebateMode.DEMO,
      };

      const messages: Message[] = [
        { id: '1', role: 'user', text: 'Message in demo mode' },
      ];

      renderHook(() =>
        useMessageAnalysis({
          messages,
          settings: demoSettings,
          onStructureAnalysisComplete: mockOnStructureAnalysisComplete,
        })
      );

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(geminiIndex.analyzeUtteranceStructureStreaming).not.toHaveBeenCalled();
      expect(mockOnStructureAnalysisComplete).not.toHaveBeenCalled();
    });

    it('should not reanalyze structure for already analyzed messages', async () => {
      const messages: Message[] = [
        {
          id: '1',
          role: 'user',
          text: 'Test message',
          structureAnalysis: { claim: 'existing', reasoning: 'existing', evidence: 'existing', overallScore: 80 },
        },
      ];

      vi.mocked(geminiIndex.analyzeFactOpinion).mockResolvedValue({
        analysis: { factCount: 1, opinionCount: 1 },
        usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 },
      });

      renderHook(() =>
        useMessageAnalysis({
          messages,
          settings: mockDebateSettings,
          onStructureAnalysisComplete: mockOnStructureAnalysisComplete,
        })
      );

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(geminiIndex.analyzeUtteranceStructureStreaming).not.toHaveBeenCalled();
    });
  });

  describe('Phase Analysis', () => {
    it('should analyze debate phase when messages are added', async () => {
      const messages: Message[] = [
        { id: '1', role: 'user', text: 'Opening statement' },
        { id: '2', role: 'model', text: 'Counter argument' },
      ];

      const mockPhaseResult = {
        phase: 'REBUTTAL' as const,
        summary: 'Debate has moved to rebuttal phase',
      };

      vi.mocked(geminiIndex.analyzeFactOpinion).mockResolvedValue({
        analysis: { factCount: 1, opinionCount: 1 },
        usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 },
      });

      vi.mocked(geminiIndex.analyzeDebatePhase).mockResolvedValue({
        result: mockPhaseResult,
        usage: { inputTokens: 50, outputTokens: 20, totalTokens: 70 },
      });

      const { result } = renderHook(() =>
        useMessageAnalysis({
          messages,
          settings: mockDebateSettings,
          onTokenUpdate: mockOnTokenUpdate,
        })
      );

      await waitFor(() => {
        expect(geminiIndex.analyzeDebatePhase).toHaveBeenCalledWith(
          mockDebateSettings.topic,
          messages
        );
        expect(result.current.debateFlowState.currentPhase).toBe('REBUTTAL');
        expect(result.current.debateFlowState.turns).toHaveLength(1);
        expect(mockOnTokenUpdate).toHaveBeenCalledWith({
          inputTokens: 50,
          outputTokens: 20,
          totalTokens: 70,
        });
      });
    });

    it('should not analyze phase with less than 2 messages', async () => {
      const messages: Message[] = [
        { id: '1', role: 'user', text: 'Single message' },
      ];

      vi.mocked(geminiIndex.analyzeFactOpinion).mockResolvedValue({
        analysis: { factCount: 1, opinionCount: 1 },
        usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 },
      });

      renderHook(() =>
        useMessageAnalysis({
          messages,
          settings: mockDebateSettings,
        })
      );

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(geminiIndex.analyzeDebatePhase).not.toHaveBeenCalled();
    });

    it('should not analyze phase in demo mode', async () => {
      const demoSettings: DebateSettings = {
        ...mockDebateSettings,
        mode: DebateMode.DEMO,
      };

      const messages: Message[] = [
        { id: '1', role: 'user', text: 'First message' },
        { id: '2', role: 'model', text: 'Second message' },
      ];

      renderHook(() =>
        useMessageAnalysis({
          messages,
          settings: demoSettings,
        })
      );

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(geminiIndex.analyzeDebatePhase).not.toHaveBeenCalled();
    });
  });

  describe('Demo Mode Parsing', () => {
    it('should parse JSON messages in demo mode', async () => {
      const demoSettings: DebateSettings = {
        ...mockDebateSettings,
        mode: DebateMode.DEMO,
      };

      const messages: Message[] = [
        {
          id: '1',
          role: 'model',
          text: JSON.stringify({ speaker: 'AFFIRMATIVE', text: 'Opening statement' }),
        },
      ];

      const { result } = renderHook(() =>
        useMessageAnalysis({
          messages,
          settings: demoSettings,
        })
      );

      await waitFor(() => {
        expect(result.current.demoParsedMessages['1']).toEqual({
          speaker: 'AFFIRMATIVE',
          text: 'Opening statement',
        });
      });
    });

    it('should handle invalid JSON gracefully in demo mode', async () => {
      const demoSettings: DebateSettings = {
        ...mockDebateSettings,
        mode: DebateMode.DEMO,
      };

      const messages: Message[] = [
        { id: '1', role: 'model', text: 'Invalid JSON content' },
      ];

      const { result } = renderHook(() =>
        useMessageAnalysis({
          messages,
          settings: demoSettings,
        })
      );

      await new Promise(resolve => setTimeout(resolve, 100));

      // Should not crash and should not add to demoParsedMessages
      expect(result.current.demoParsedMessages['1']).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle fact/opinion analysis errors gracefully', async () => {
      const messages: Message[] = [
        { id: '1', role: 'user', text: 'Test message that will fail' },
      ];

      vi.mocked(geminiIndex.analyzeFactOpinion).mockRejectedValue(
        new Error('API Error')
      );

      const { result } = renderHook(() =>
        useMessageAnalysis({
          messages,
          settings: mockDebateSettings,
        })
      );

      await new Promise(resolve => setTimeout(resolve, 200));

      // Should not crash and analyses should remain empty
      expect(result.current.analyses['1']).toBeUndefined();
    });

    it('should handle phase analysis errors gracefully', async () => {
      const messages: Message[] = [
        { id: '1', role: 'user', text: 'First message' },
        { id: '2', role: 'model', text: 'Second message' },
      ];

      vi.mocked(geminiIndex.analyzeFactOpinion).mockResolvedValue({
        analysis: { factCount: 1, opinionCount: 1 },
        usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 },
      });

      vi.mocked(geminiIndex.analyzeDebatePhase).mockRejectedValue(
        new Error('Phase analysis failed')
      );

      const { result } = renderHook(() =>
        useMessageAnalysis({
          messages,
          settings: mockDebateSettings,
        })
      );

      await new Promise(resolve => setTimeout(resolve, 200));

      // Should not crash, debateFlowState should have default values
      expect(result.current.debateFlowState.currentPhase).toBe('POSITION');
      expect(result.current.debateFlowState.turns).toHaveLength(0);
    });
  });
});
