import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { ApiError, ErrorCode } from '../core/types/error.types';
import { getUserFriendlyMessage } from '../core/utils/error-parser';

export const useErrorHandler = () => {
  const [lastError, setLastError] = useState<ApiError | null>(null);

  const handleError = useCallback((error: ApiError, context?: string) => {
    setLastError(error);
    const userMessage = getUserFriendlyMessage(error, context);

    // エラーの種類に応じてトーストのスタイルを変更
    switch (error.code) {
      case ErrorCode.QUOTA_EXCEEDED:
        toast.error(userMessage, {
          duration: 8000,
          icon: '⚠️',
        });
        break;

      case ErrorCode.SERVICE_UNAVAILABLE:
        toast.error(userMessage, {
          duration: 6000,
          icon: '🔧',
        });
        break;

      case ErrorCode.TIMEOUT:
        toast.error(userMessage, {
          duration: 5000,
          icon: '⏱️',
        });
        break;

      case ErrorCode.NETWORK_ERROR:
        toast.error(userMessage, {
          duration: 5000,
          icon: '📡',
        });
        break;

      default:
        toast.error(userMessage, {
          duration: 5000,
        });
        break;
    }
  }, []);

  const handleSuccess = useCallback((message: string, duration = 3000) => {
    toast.success(message, { duration });
  }, []);

  const handleInfo = useCallback((message: string, duration = 3000) => {
    toast(message, {
      duration,
      icon: 'ℹ️',
    });
  }, []);

  const clearError = useCallback(() => setLastError(null), []);

  return { lastError, handleError, handleSuccess, handleInfo, clearError };
};
