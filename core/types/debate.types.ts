import { PremiseData, ThinkingFramework } from './mode.types';
import { StoryScenario } from './story.types';
import { MiniGameType } from './minigame.types';
import { Message } from './common.types';
import { FeedbackData } from './feedback.types';

/**
 * 難易度設定 (4段階固定)
 * 仕様変更により3段階に減らすことは禁止されています。
 */
export enum Difficulty {
  EASY = 'EASY', // 初級：肯定・称賛ベース
  NORMAL = 'NORMAL', // 中級：論理的一貫性
  HARD = 'HARD', // 上級：厳密な証拠・論拠
  EXTREME = 'EXTREME', // 超上級：詭弁・レトリック・心理戦
}

export enum DebateMode {
  DEBATE = 'DEBATE',
  STUDY = 'STUDY',
  TRAINING = 'TRAINING',
  DRILL = 'DRILL',
  FACILITATION = 'FACILITATION',
  THINKING_GYM = 'THINKING_GYM',
  STORY = 'STORY',
  DEMO = 'DEMO',
  TEXTBOOK = 'TEXTBOOK',
  MINIGAME = 'MINIGAME',
}

export enum DebateType {
  POLICY = 'POLICY',
  FACT = 'FACT',
  VALUE = 'VALUE',
}

export interface DebateSettings {
  topic: string;
  difficulty: Difficulty;
  mode: DebateMode;
  debateType?: DebateType;
  premises?: PremiseData;
  facilitationSettings?: {
    aStance: 'PRO' | 'CON';
  };
  thinkingFramework?: ThinkingFramework;
  storyScenario?: StoryScenario;
  miniGameType?: MiniGameType;
  weaknessProfile?: string;
  // For direct navigation setup
  initialDrillConfig?: string;
  textbookChapterId?: number;
}

export interface DebateArchive {
  id: string;
  date: string;
  lastModified?: string;
  topic: string;
  messages: Message[];
  feedback: FeedbackData;
}

// --- Debate Phase Tracker ---

export type DebateProgressPhase =
  | 'POSITION' // 立場表明
  | 'GROUNDS' // 根拠提示
  | 'CLASH' // 論点衝突
  | 'REBUTTAL' // 再反論
  | 'WEIGHING' // 重要度比較
  | 'CLOSING'; // 結論整理

export interface PhaseWinCondition {
  label: string; // Short title e.g. "Attack Definitions"
  description: string; // Contextual advice e.g. "The opponent's definition of 'freedom' is vague. Attack it."
}

export interface TurnPhaseInfo {
  messageId: string;
  speaker: 'USER' | 'AI';
  phase: DebateProgressPhase;
  confidence: number;
  rationale?: string;
  winCondition?: PhaseWinCondition; // NEW: Dynamic guidance
}

export interface DebateFlowState {
  currentPhase: DebateProgressPhase;
  winCondition?: PhaseWinCondition; // NEW
  turns: TurnPhaseInfo[];
}

// --- Strategy & Rebuttal Templates ---

export enum DebatePhase {
  CLAIM = 'CLAIM',
  EVIDENCE = 'EVIDENCE',
  REBUTTAL = 'REBUTTAL',
  DEFENSE = 'DEFENSE',
  FALLACY = 'FALLACY',
  FRAMING = 'FRAMING',
  CONCESSION = 'CONCESSION',
  SYNTHESIS = 'SYNTHESIS',
}

export interface RebuttalTemplateField {
  id: string;
  label: string;
  placeholder: string;
  hint?: string; // Pre-filled suggestion from AI
}

export interface RebuttalTemplate {
  title: string;
  fields: RebuttalTemplateField[];
}

export interface StrategicMove {
  type: 'logical_attack' | 'reframing' | 'concession';
  title: string;
  summary: string;
  expected_effect: string;
  reason?: string; // NEW: Why this move is good for the current phase
  template: string;
}

export interface TurnAnalysis {
  claim_summary: string;
  evidence_summary: string;
  weak_point: string;
  rhetoric_device: string;
  detected_fallacy: string | null;
}

export interface StrategyAnalysis {
  analysis: TurnAnalysis;
  moves: StrategicMove[];
  currentPhase: DebatePhase;
  rebuttalTemplate?: RebuttalTemplate; // NEW: Structured template for the modal
}
