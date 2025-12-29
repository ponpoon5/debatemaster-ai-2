/**
 * Gemini API 型定義
 *
 * Google Generative AI APIのレスポンス型を定義
 * any型を削減し、型安全性を向上させるための基盤
 */

/**
 * Gemini API生成リクエストのパラメータ
 */
export interface GeminiGenerateContentParams {
  model: string;
  contents: GeminiContent[];
  config?: GeminiGenerationConfig;
}

/**
 * Gemini APIコンテンツ構造
 */
export interface GeminiContent {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

/**
 * Gemini APIコンテンツのパート
 */
export interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

/**
 * Gemini API生成設定
 */
export interface GeminiGenerationConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
  responseSchema?: unknown;
  stopSequences?: string[];
  thinkingConfig?: {
    mode: 'THINKING_MODE_UNSPECIFIED' | 'DISABLED' | 'ENABLED_SHOW' | 'ENABLED_HIDE' | 'ENABLED_REGENERATE';
  };
}

/**
 * Gemini APIレスポンス
 */
export interface GeminiResponse {
  text: string;
  usageMetadata?: GeminiUsageMetadata;
  candidates?: GeminiCandidate[];
}

/**
 * Gemini API使用量メタデータ
 */
export interface GeminiUsageMetadata {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
}

/**
 * Gemini API候補
 */
export interface GeminiCandidate {
  content: GeminiContent;
  finishReason?: string;
  safetyRatings?: GeminiSafetyRating[];
  citationMetadata?: unknown;
}

/**
 * Gemini API安全性評価
 */
export interface GeminiSafetyRating {
  category: string;
  probability: string;
}

/**
 * Gemini APIストリーミングチャンク
 */
export interface GeminiStreamChunk {
  text?: string;
  usageMetadata?: GeminiUsageMetadata;
  error?: string;
  message?: string;
}

/**
 * プロキシAPIレスポンス
 */
export interface ProxyApiResponse {
  text: string;
  usageMetadata?: GeminiUsageMetadata;
  candidates?: GeminiCandidate[];
}

/**
 * プロキシAPIエラーレスポンス
 */
export interface ProxyApiError {
  error: string;
  message: string;
  statusCode?: number;
}
