import { StoryAnalysis, DemoAnalysis } from './story.types';
import { WeaknessKey, BehaviorRate, HomeworkSuggestion } from './homework.types';
import { DebateMode } from './debate.types';
import { MiniGameType } from './minigame.types';
import { ThinkingFramework } from './mode.types';

export interface EvaluationMetrics {
  logic: number;
  evidence: number;
  rebuttal: number;
  persuasion: number;
  consistency: number;
  constructiveness: number;
  objectivity: number;
  clarity: number;
}

export interface MetricRubric {
  key: keyof EvaluationMetrics;
  label: string;
  score: number;
  weight: number; // percentage (e.g. 20 for 20%)
  descriptor: string; // Detailed description of why this specific score was given based on rubric levels
}

export interface SessionMetric {
  key: WeaknessKey;
  label: string;
  rate: BehaviorRate;
  score: number;
}

export interface SBIModel {
  situation: string; // 状況：議論のどの段階か、相手が何を言った直後か
  behavior: string; // 行動：ユーザーが取った具体的な発言内容や論理構成
  impact: string; // 影響：その行動が議論の説得力や展開にどう影響したか
}

export interface MessageReview {
  messageIndex: number;
  score?: number;
  critique?: string;
  sbi?: SBIModel; // NEW: SBIモデルによる構造化された批評
  betterResponse?: string;
  fallacy?: string;
  fallacyQuote?: string;
  fallacyExplanation?: string;
}

export interface ToulminElement {
  text: string;
  status: 'strong' | 'weak' | 'missing';
  comment: string;
}

export interface LogicStructure {
  type: 'best' | 'needs_improvement';
  summary: string;
  claim: ToulminElement;
  data: ToulminElement;
  warrant: ToulminElement;
}

export interface RhetoricAnalysis {
  ethos: number;
  pathos: number;
  logos: number;
  affirmationScore: number;
  affirmationComment: string;
}

export type QuestionType = 'OPEN' | 'CLOSED' | 'SUBTLE';

export interface QuestionAnalysis {
  messageIndex: number;
  questionText: string;
  type: QuestionType;
  effectiveness: number;
  comment: string;
}

export interface QuestioningStats {
  openCount: number;
  closedCount: number;
  subtleCount: number;
  score: number;
  advice: string;
}

export interface FacilitationAnalysis {
  understandingScore: number;
  organizingScore: number;
  consensusScore: number;
  feedback: string;
}

// --- Training Recommendations ---

export type TrainingActionType =
  | 'open_minigame'
  | 'open_textbook'
  | 'open_thinking_gym'
  | 'start_drill'
  | 'start_study';

export interface TrainingRecommendation {
  id: string;
  label: string; // e.g. "Practice Warrants"
  description: string;
  actionType: TrainingActionType;
  actionPayload: {
    minigameType?: MiniGameType;
    textbookChapterId?: number;
    thinkingFramework?: ThinkingFramework;
    drillTopic?: string; // For Drill mode
    studyTopic?: string; // For Study mode (fallacy name)
  };
}

// --- Exemplars & Calibration (Anchor Papers) ---

export interface ExemplarItem {
  level: 'Mastery' | 'Secure' | 'Developing' | 'Error';
  label: string; // e.g. "完璧な立論", "一般的なミス"
  text: string;
  explanation: string;
  score: number;
}

export interface ExemplarMetricSet {
  metricKey: keyof EvaluationMetrics;
  metricLabel: string;
  items: ExemplarItem[];
}

export interface FeedbackData {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  advice: string;
  metrics: EvaluationMetrics;
  detailedReview: MessageReview[];

  rubricDetails?: MetricRubric[];
  sessionMetrics?: SessionMetric[];
  homeworkSuggestions?: HomeworkSuggestion[];
  trainingRecommendations?: TrainingRecommendation[];

  // NEW: Exemplars for calibration
  exemplars?: ExemplarMetricSet[];

  logicAnalysis?: LogicStructure[];
  rhetoric?: RhetoricAnalysis;
  questioningAnalysis?: {
    stats: QuestioningStats;
    details: QuestionAnalysis[];
  };
  facilitation?: FacilitationAnalysis;
  storyAnalysis?: StoryAnalysis;
  demoAnalysis?: DemoAnalysis;
}
