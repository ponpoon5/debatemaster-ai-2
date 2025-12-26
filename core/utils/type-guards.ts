import { Message, UtteranceStructureScore } from '../types';
import { ApiError } from '../types/error.types';

// usageMetadata型ガード
export function hasValidUsageMetadata(response: unknown): boolean {
  if (typeof response !== 'object' || response === null) return false;
  const obj = response as Record<string, unknown>;
  return obj.usageMetadata !== null && obj.usageMetadata !== undefined;
}

// structureAnalysis型ガード（拡張Message型へのnarrowingに使用）
export interface AnalyzedMessage extends Message {
  structureAnalysis: UtteranceStructureScore;
}

export function hasStructureAnalysis(msg: Message): msg is AnalyzedMessage {
  return msg.structureAnalysis !== null && msg.structureAnalysis !== undefined;
}

// エラー型ガード
export function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'code' in error;
}
