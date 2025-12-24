import { useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * トースト通知を表示するための汎用フック
 * 成功、エラー、情報、警告など様々な通知に対応
 */
export const useToast = () => {
  const showSuccess = useCallback((message: string, duration = 3000) => {
    toast.success(message, { duration });
  }, []);

  const showError = useCallback((message: string, duration = 5000) => {
    toast.error(message, { duration });
  }, []);

  const showInfo = useCallback((message: string, duration = 3000) => {
    toast(message, {
      duration,
      icon: 'ℹ️',
    });
  }, []);

  const showWarning = useCallback((message: string, duration = 4000) => {
    toast(message, {
      duration,
      icon: '⚠️',
      style: {
        background: '#fef3c7',
        color: '#92400e',
      },
    });
  }, []);

  const showLoading = useCallback((message: string) => {
    return toast.loading(message);
  }, []);

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }, []);

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismiss,
  };
};
