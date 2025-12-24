/**
 * Burden of Proof Tracker Types
 * 立証責任トラッカーの型定義
 */

export type BurdenType =
  | 'claim' // 主張: 主張者が証拠を示す義務
  | 'simple_question' // 単なる疑問: 立証責任は元の主張者に残る
  | 'counter_claim'; // 反証を要する指摘: 質問者が証拠を出す必要がある

export type BurdenStatus =
  | 'active' // 立証責任が未履行
  | 'fulfilled' // 立証責任が履行された
  | 'challenged' // 立証責任が争点化されている
  | 'abandoned'; // 立証責任が放棄された

export interface BurdenOfProof {
  id: string;
  type: BurdenType;
  status: BurdenStatus;

  // 主張内容
  claimText: string;
  claimMessageIndex: number;
  claimant: 'user' | 'ai'; // 主張者

  // 立証責任を負う者
  burdenHolder: 'user' | 'ai';

  // 関連する証拠・反論
  evidenceMessageIndices: number[];

  // CQ (Critical Question) 関連
  isCriticalQuestion: boolean;
  criticalQuestionText?: string;
  criticalQuestionIndex?: number;

  // 評価・説明
  explanation: string; // なぜこの立証責任が発生したか
  assessment?: string; // 立証責任が履行されたかの評価

  // タイムスタンプ
  createdAt: number; // メッセージインデックス
  resolvedAt?: number; // 解決されたメッセージインデックス
}

export interface BurdenAnalysis {
  burdens: BurdenOfProof[];
  summary: {
    userActiveBurdens: number;
    aiActiveBurdens: number;
    totalResolved: number;
    criticalQuestionsCount: number;
  };
}
