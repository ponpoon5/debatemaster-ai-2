import { Chat } from '@google/genai';
import { ai } from './client';
import { MODEL_NAME } from '../../core/config/gemini.config';
import {
  Difficulty,
  DebateMode,
  PremiseData,
  ThinkingFramework,
  StoryScenario,
  DebateType,
  Message,
} from '../../core/types';
import { getSystemInstruction } from './instructions';

export const createDebateChat = (
  topic: string,
  difficulty: Difficulty,
  history?: Message[],
  mode: DebateMode = DebateMode.DEBATE,
  weaknessProfile?: string,
  premises?: PremiseData,
  facilitationSettings?: { aStance: 'PRO' | 'CON' },
  debateType?: DebateType,
  thinkingFramework?: ThinkingFramework,
  storyScenario?: StoryScenario
): Chat => {
  const config: {
    systemInstruction: string;
    responseMimeType?: string;
  } = {
    systemInstruction: getSystemInstruction(
      topic,
      difficulty,
      mode,
      weaknessProfile,
      premises,
      facilitationSettings,
      debateType,
      thinkingFramework,
      storyScenario
    ),
  };

  // For Demo mode, suggest JSON mimetype to ensure structured output
  if (mode === DebateMode.DEMO) {
    config.responseMimeType = 'application/json';
  }

  const chatOptions: {
    model: string;
    config: typeof config;
    history?: Array<{ role: string; parts: Array<{ text: string }> }>;
  } = {
    model: MODEL_NAME,
    config: config,
  };

  // Hydrate history if provided
  if (history && history.length > 0) {
    chatOptions.history = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));
  }

  return ai.chats.create(chatOptions);
};
