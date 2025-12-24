import { Message, UtteranceStructureScore } from '../types';
import { ApiError } from '../types/error.types';

// usageMetadata型ガード
export function hasValidUsageMetadata(response: any): boolean {
  return response?.usageMetadata !== null && response?.usageMetadata !== undefined;
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
