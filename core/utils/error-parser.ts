import { ApiError, ErrorCode } from '../types/error.types';

export function parseApiError(error: unknown): ApiError {
  const status = getErrorStatus(error);
  const errorStr = JSON.stringify(error);
  const message = getErrorMessage(error);

  // 429エラー（クオータ超過）の検出
  if (status === 429 || errorStr.includes('429') || errorStr.includes('quota')) {
    return {
      code: ErrorCode.QUOTA_EXCEEDED,
      message: 'APIの利用制限を超過しました',
      status,
      details: error,
    };
  }

  // 503エラー（サービス利用不可）の検出
  if (status === 503 || errorStr.includes('503')) {
    return {
      code: ErrorCode.SERVICE_UNAVAILABLE,
      message: 'AIサービスが一時的に利用できません',
      status,
      details: error,
    };
  }

  // タイムアウトエラーの検出
  if (message.includes('タイムアウト') || message.includes('timeout')) {
    return {
      code: ErrorCode.TIMEOUT,
      message: '通信がタイムアウトしました',
      status,
      details: error,
    };
  }

  // その他のエラー
  return {
    code: ErrorCode.UNKNOWN,
    message: message || '不明なエラーが発生しました',
    status,
    details: error,
  };
}

function getErrorStatus(error: unknown): number | undefined {
  if (typeof error === 'object' && error !== null) {
    return (error as any).status ?? (error as any).response?.status;
  }
  return undefined;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return '';
}

export function getUserFriendlyMessage(error: ApiError, context?: string): string {
  const contextPrefix = context ? `${context}中に` : '';

  switch (error.code) {
    case ErrorCode.QUOTA_EXCEEDED:
      return `${contextPrefix}APIの利用制限を超過しました。\nプランの上限に達したか、リクエスト頻度が高すぎます。\nしばらく時間を空けてから再試行してください。`;

    case ErrorCode.SERVICE_UNAVAILABLE:
      return `${contextPrefix}AIサービスが一時的に混雑しています。\nしばらく待ってから再試行してください。`;

    case ErrorCode.TIMEOUT:
      return `${contextPrefix}通信がタイムアウトしました。\nネットワーク環境を確認し、もう一度お試しください。`;

    case ErrorCode.NETWORK_ERROR:
      return `${contextPrefix}ネットワークエラーが発生しました。\n接続を確認してください。`;

    case ErrorCode.PARSE_ERROR:
      return `${contextPrefix}応答の解析に失敗しました。\n再試行してください。`;

    default:
      return `${contextPrefix}エラーが発生しました: ${error.message}`;
  }
}
