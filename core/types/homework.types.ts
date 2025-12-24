import { DebateMode } from './debate.types';

export type WeaknessKey =
  | 'warrant_clarity' // 論拠の明確さ
  | 'evidence_quality' // 証拠の質・頻度
  | 'fallacy_frequency' // 誤謬の回避率
  | 'question_depth' // 質問の深さ
  | 'weighing_clarity' // 比較・優先順位付け
  | 'structure_consistency' // 構造的一貫性 (Claim-Data-Warrant)
  | 'emotional_control' // 冷静さ・客観性
  | 'listening_responsiveness'; // 反論への応答性

export type HomeworkDifficulty = 'easy' | 'normal' | 'hard';
export type HomeworkStatus = 'pending' | 'completed' | 'skipped';

export interface HomeworkEvidence {
  type: 'text';
  content: string;
  createdAt: string; // ISO 8601
}

export interface HomeworkTask {
  id: string;
  createdAt: string;
  sourceArchiveId?: string; // Which debate generated this task
  mode: DebateMode;
  title: string;
  description: string;
  targetSkills: WeaknessKey[];
  difficulty: HomeworkDifficulty;
  status: HomeworkStatus;
  completedAt?: string;
  evidence?: HomeworkEvidence;
}

export interface BehaviorRate {
  numerator: number; // e.g. "number of good warrants"
  denominator: number; // e.g. "total claims made"
}

export interface WeaknessMetric {
  key: WeaknessKey;
  label: string;
  description: string;
  rate: BehaviorRate;
  score: number; // 0-100 derived from rate
  lastUpdated: string;
  sampleSize: number; // Cumulative denominator
}

export interface WeaknessProfile {
  lastUpdated: string;
  metrics: Record<WeaknessKey, WeaknessMetric>;
}

export interface HomeworkSuggestion {
  title: string;
  description: string;
  targetSkills: WeaknessKey[];
  difficulty: HomeworkDifficulty;
  suggestedPracticeModes: DebateMode[];
}
