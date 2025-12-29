/**
 * Thinking Gym - 5 Whys Analysis Types
 * 5 Whys専用の詳細構造化型定義
 */

/**
 * 原因カテゴリ（Cause Type Tag）
 */
export enum CauseType {
  PERSON = 'person', // 人
  PROCESS = 'process', // プロセス
  TOOL = 'tool', // ツール
  INFORMATION = 'information', // 情報
  ENVIRONMENT = 'environment', // 環境
  MANAGEMENT = 'management', // 管理
}

/**
 * 制御可能性（Controllability）
 */
export enum Controllability {
  HIGH = 'high', // 高
  MEDIUM = 'medium', // 中
  LOW = 'low', // 低
}

/**
 * 根拠の種類
 */
export interface Evidence {
  data?: string; // 数値/ログ
  example?: string; // 具体例
  observation?: string; // 現場観測
}

/**
 * Why段階の詳細入力データ
 */
export interface WhyStep {
  // 原因文（必須）
  cause: string;

  // 因果のつなぎ説明（推奨）
  mechanism?: string;

  // 根拠（必須に近い推奨）
  evidence: Evidence;

  // 仮説フラグ（必須）
  isHypothesis: boolean;

  // 原因カテゴリ（必須）
  causeType: CauseType | null;

  // 確信度（必須、0-100）
  confidence: number;

  // 制御可能性（Why4/Why5で必須）
  controllability?: Controllability;
}

/**
 * 最終まとめ（Root Cause Summary）
 */
export interface RootCauseSummary {
  // 根本原因の要約（必須）
  rootCause: string;

  // 対策1つだけ（必須）
  oneAction: string;

  // 検証指標（必須）
  successMetric: string;
}

/**
 * 5 Whys完全データ
 */
export interface FiveWhysData {
  // 問題文
  problem: string;

  // Why1-5
  whys: [WhyStep, WhyStep, WhyStep, WhyStep, WhyStep];

  // 最終まとめ
  summary?: RootCauseSummary;
}

/**
 * バリデーションエラー種別
 */
export enum ValidationErrorType {
  REQUIRED_FIELD = 'required_field', // 必須項目未入力
  COUNTERMEASURE_IN_CAUSE = 'countermeasure_in_cause', // 対策混入
  ABSTRACT_WORD = 'abstract_word', // 抽象語
  WEAK_CONNECTION = 'weak_connection', // 因果の連続性が弱い
  SYNONYM_LOOP = 'synonym_loop', // 同義反復
  UNCONTROLLABLE_ROOT = 'uncontrollable_root', // 制御不能な根本原因
  MENTAL_ATTRIBUTION = 'mental_attribution', // 精神論・個人攻撃
}

/**
 * バリデーション結果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * バリデーションエラー（提出不可）
 */
export interface ValidationError {
  type: ValidationErrorType;
  whyIndex?: number; // どのWhyか（0-4）
  field?: string; // どのフィールドか
  message: string;
}

/**
 * バリデーション警告（提出可能だが減点）
 */
export interface ValidationWarning {
  type: ValidationErrorType;
  whyIndex?: number;
  field?: string;
  message: string;
  suggestedFix?: string;
}
