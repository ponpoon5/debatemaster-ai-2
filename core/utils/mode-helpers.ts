/**
 * モード判定ヘルパー関数
 * 複数箇所で散在していたモード判定ロジックを統一
 */

import { DebateMode, DebateSettings } from '../types';

/**
 * デモモードかどうかを判定
 */
export const isDemoMode = (mode: DebateMode | DebateSettings): boolean => {
  const targetMode = typeof mode === 'object' ? mode.mode : mode;
  return targetMode === DebateMode.DEMO;
};

/**
 * スタディモードかどうかを判定
 */
export const isStudyMode = (mode: DebateMode | DebateSettings): boolean => {
  const targetMode = typeof mode === 'object' ? mode.mode : mode;
  return targetMode === DebateMode.STUDY;
};

/**
 * ドリルモードかどうかを判定
 */
export const isDrillMode = (mode: DebateMode | DebateSettings): boolean => {
  const targetMode = typeof mode === 'object' ? mode.mode : mode;
  return targetMode === DebateMode.DRILL;
};

/**
 * 標準的なディベートモードかどうかを判定
 */
export const isStandardDebate = (mode: DebateMode | DebateSettings): boolean => {
  const targetMode = typeof mode === 'object' ? mode.mode : mode;
  return targetMode === DebateMode.DEBATE;
};

/**
 * ファシリテーションモードかどうかを判定
 */
export const isFacilitationMode = (mode: DebateMode | DebateSettings): boolean => {
  const targetMode = typeof mode === 'object' ? mode.mode : mode;
  return targetMode === DebateMode.FACILITATION;
};

/**
 * ストーリーモードかどうかを判定
 */
export const isStoryMode = (mode: DebateMode | DebateSettings): boolean => {
  const targetMode = typeof mode === 'object' ? mode.mode : mode;
  return targetMode === DebateMode.STORY;
};

/**
 * 思考ジムモードかどうかを判定
 */
export const isThinkingGymMode = (mode: DebateMode | DebateSettings): boolean => {
  const targetMode = typeof mode === 'object' ? mode.mode : mode;
  return targetMode === DebateMode.THINKING_GYM;
};

/**
 * ディベート分析が必要なモードかどうかを判定
 * (DEBATE, FACILITATION, STORY)
 */
export const requiresDebateAnalysis = (mode: DebateMode | DebateSettings): boolean => {
  const targetMode = typeof mode === 'object' ? mode.mode : mode;
  return (
    targetMode === DebateMode.DEBATE ||
    targetMode === DebateMode.FACILITATION ||
    targetMode === DebateMode.STORY
  );
};

/**
 * トレーニングモードかどうかを判定
 * (STUDY, DRILL, THINKING_GYM)
 */
export const isTrainingMode = (mode: DebateMode | DebateSettings): boolean => {
  const targetMode = typeof mode === 'object' ? mode.mode : mode;
  return (
    targetMode === DebateMode.STUDY ||
    targetMode === DebateMode.DRILL ||
    targetMode === DebateMode.THINKING_GYM
  );
};

/**
 * 複数人のスピーカーがいるモードかどうかを判定
 * (FACILITATION, STORY)
 */
export const isMultiSpeakerMode = (mode: DebateMode | DebateSettings): boolean => {
  const targetMode = typeof mode === 'object' ? mode.mode : mode;
  return targetMode === DebateMode.FACILITATION || targetMode === DebateMode.STORY;
};
