import { describe, it, expect } from 'vitest';
import {
  isDemoMode,
  isStudyMode,
  isDrillMode,
  isStandardDebate,
  isFacilitationMode,
  isStoryMode,
  isThinkingGymMode,
  requiresDebateAnalysis,
  isTrainingMode,
  isMultiSpeakerMode,
} from './mode-helpers';
import { DebateMode, DebateSettings, Difficulty } from '../types';

describe('mode-helpers', () => {
  describe('isDemoMode', () => {
    it('should return true for DEMO mode', () => {
      expect(isDemoMode(DebateMode.DEMO)).toBe(true);
    });

    it('should return false for non-DEMO modes', () => {
      expect(isDemoMode(DebateMode.DEBATE)).toBe(false);
      expect(isDemoMode(DebateMode.STUDY)).toBe(false);
    });

    it('should work with DebateSettings object', () => {
      const settings: DebateSettings = {
        topic: 'Test',
        difficulty: Difficulty.NORMAL,
        mode: DebateMode.DEMO,
      };
      expect(isDemoMode(settings)).toBe(true);
    });
  });

  describe('isStudyMode', () => {
    it('should return true for STUDY mode', () => {
      expect(isStudyMode(DebateMode.STUDY)).toBe(true);
    });

    it('should return false for non-STUDY modes', () => {
      expect(isStudyMode(DebateMode.DEMO)).toBe(false);
      expect(isStudyMode(DebateMode.DEBATE)).toBe(false);
    });
  });

  describe('isDrillMode', () => {
    it('should return true for DRILL mode', () => {
      expect(isDrillMode(DebateMode.DRILL)).toBe(true);
    });

    it('should return false for non-DRILL modes', () => {
      expect(isDrillMode(DebateMode.DEMO)).toBe(false);
      expect(isDrillMode(DebateMode.DEBATE)).toBe(false);
    });
  });

  describe('isStandardDebate', () => {
    it('should return true for DEBATE mode', () => {
      expect(isStandardDebate(DebateMode.DEBATE)).toBe(true);
    });

    it('should return false for non-DEBATE modes', () => {
      expect(isStandardDebate(DebateMode.DEMO)).toBe(false);
      expect(isStandardDebate(DebateMode.FACILITATION)).toBe(false);
    });
  });

  describe('isFacilitationMode', () => {
    it('should return true for FACILITATION mode', () => {
      expect(isFacilitationMode(DebateMode.FACILITATION)).toBe(true);
    });

    it('should return false for non-FACILITATION modes', () => {
      expect(isFacilitationMode(DebateMode.DEBATE)).toBe(false);
      expect(isFacilitationMode(DebateMode.STORY)).toBe(false);
    });
  });

  describe('isStoryMode', () => {
    it('should return true for STORY mode', () => {
      expect(isStoryMode(DebateMode.STORY)).toBe(true);
    });

    it('should return false for non-STORY modes', () => {
      expect(isStoryMode(DebateMode.DEBATE)).toBe(false);
      expect(isStoryMode(DebateMode.FACILITATION)).toBe(false);
    });
  });

  describe('isThinkingGymMode', () => {
    it('should return true for THINKING_GYM mode', () => {
      expect(isThinkingGymMode(DebateMode.THINKING_GYM)).toBe(true);
    });

    it('should return false for non-THINKING_GYM modes', () => {
      expect(isThinkingGymMode(DebateMode.DEBATE)).toBe(false);
      expect(isThinkingGymMode(DebateMode.STUDY)).toBe(false);
    });
  });

  describe('requiresDebateAnalysis', () => {
    it('should return true for DEBATE, FACILITATION, and STORY modes', () => {
      expect(requiresDebateAnalysis(DebateMode.DEBATE)).toBe(true);
      expect(requiresDebateAnalysis(DebateMode.FACILITATION)).toBe(true);
      expect(requiresDebateAnalysis(DebateMode.STORY)).toBe(true);
    });

    it('should return false for other modes', () => {
      expect(requiresDebateAnalysis(DebateMode.DEMO)).toBe(false);
      expect(requiresDebateAnalysis(DebateMode.STUDY)).toBe(false);
      expect(requiresDebateAnalysis(DebateMode.DRILL)).toBe(false);
      expect(requiresDebateAnalysis(DebateMode.THINKING_GYM)).toBe(false);
    });
  });

  describe('isTrainingMode', () => {
    it('should return true for STUDY, DRILL, and THINKING_GYM modes', () => {
      expect(isTrainingMode(DebateMode.STUDY)).toBe(true);
      expect(isTrainingMode(DebateMode.DRILL)).toBe(true);
      expect(isTrainingMode(DebateMode.THINKING_GYM)).toBe(true);
    });

    it('should return false for other modes', () => {
      expect(isTrainingMode(DebateMode.DEMO)).toBe(false);
      expect(isTrainingMode(DebateMode.DEBATE)).toBe(false);
      expect(isTrainingMode(DebateMode.FACILITATION)).toBe(false);
    });
  });

  describe('isMultiSpeakerMode', () => {
    it('should return true for FACILITATION and STORY modes', () => {
      expect(isMultiSpeakerMode(DebateMode.FACILITATION)).toBe(true);
      expect(isMultiSpeakerMode(DebateMode.STORY)).toBe(true);
    });

    it('should return false for other modes', () => {
      expect(isMultiSpeakerMode(DebateMode.DEMO)).toBe(false);
      expect(isMultiSpeakerMode(DebateMode.DEBATE)).toBe(false);
      expect(isMultiSpeakerMode(DebateMode.STUDY)).toBe(false);
    });
  });
});
