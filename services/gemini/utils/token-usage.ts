import { TokenUsage } from '../../../core/types/common.types';
import { hasValidUsageMetadata } from '../../../core/utils/type-guards';

export const extractUsage = (response: any): TokenUsage => {
  if (!hasValidUsageMetadata(response)) {
    console.warn('usageMetadata is null/undefined in response:', response);
    return { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
  }

  const usage = response.usageMetadata;
  return {
    inputTokens: usage.promptTokenCount ?? 0,
    outputTokens: usage.candidatesTokenCount ?? 0,
    totalTokens: usage.totalTokenCount ?? 0,
  };
};
