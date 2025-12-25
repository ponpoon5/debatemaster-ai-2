export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export type ToulminComponent =
  | 'CLAIM'
  | 'REASON'
  | 'EVIDENCE'
  | 'WARRANT'
  | 'BACKING'
  | 'REBUTTAL'
  | 'QUALIFICATION';

export interface CriticalQuestion {
  question: string;
  isAddressed: boolean;
  aiComment: string;
}

export interface ArgumentScheme {
  id: string;
  label: string;
  description: string;
}

export interface UtteranceStructureScore {
  messageId: string;
  speaker: 'USER' | 'AI';
  scores: Record<ToulminComponent, number>; // 0.0 - 1.0
  snippets?: Partial<Record<ToulminComponent, string>>;
  summary?: string;
  // New logical evaluation fields
  scheme?: ArgumentScheme;
  criticalQuestions?: CriticalQuestion[];
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  structureAnalysis?: UtteranceStructureScore;
  isPending?: boolean; // Optimistic UI flag for messages awaiting confirmation
}
