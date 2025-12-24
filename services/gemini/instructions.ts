import {
  Difficulty,
  DebateMode,
  PremiseData,
  ThinkingFramework,
  StoryScenario,
  DebateType,
} from '../../core/types';
import { getDemoInstruction } from './prompts/modes/demo';
import { getStoryInstruction } from './prompts/modes/story';
import { getFacilitationInstruction } from './prompts/modes/facilitation';
import {
  getThinkingGymInstruction,
  getDrillInstruction,
  getStudyInstruction,
  getWeaknessTrainingInstruction,
} from './prompts/modes/training';
import { getStandardDebateInstruction } from './prompts/modes/standard';

export const getSystemInstruction = (
  topic: string,
  difficulty: Difficulty,
  mode: DebateMode = DebateMode.DEBATE,
  weaknessProfile?: string,
  premises?: PremiseData,
  facilitationSettings?: { aStance: 'PRO' | 'CON' },
  debateType?: DebateType,
  thinkingFramework?: ThinkingFramework,
  storyScenario?: StoryScenario
): string => {
  if (mode === DebateMode.DEMO) {
    return getDemoInstruction(topic);
  }

  if (mode === DebateMode.STORY && storyScenario) {
    return getStoryInstruction(storyScenario);
  }

  if (mode === DebateMode.THINKING_GYM && thinkingFramework) {
    return getThinkingGymInstruction(thinkingFramework);
  }

  if (mode === DebateMode.FACILITATION) {
    return getFacilitationInstruction(topic, facilitationSettings);
  }

  if (mode === DebateMode.DRILL) {
    return getDrillInstruction(topic);
  }

  if (mode === DebateMode.STUDY) {
    return getStudyInstruction(topic);
  }

  if (mode === DebateMode.TRAINING) {
    return getWeaknessTrainingInstruction(weaknessProfile || '');
  }

  // Default: Standard Debate
  return getStandardDebateInstruction(topic, difficulty, debateType, premises);
};
