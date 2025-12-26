import { useEffect, useRef } from 'react';

/**
 * コンポーネントのレンダリングパフォーマンスを測定するフック
 * 開発環境でのみ動作し、本番環境では何もしない
 */
export const usePerformance = (componentName: string) => {
  const renderCount = useRef(0);
  const renderStartTime = useRef(0);

  if (process.env.NODE_ENV === 'development') {
    // レンダリング開始時刻を記録
    renderStartTime.current = performance.now();
  }

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      renderCount.current += 1;
      const renderTime = performance.now() - renderStartTime.current;

      // 10ms以上かかった場合は警告
      if (renderTime > 10) {
        console.warn(
          `[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms (render #${renderCount.current})`
        );
      } else {
        console.info(
          `[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms (render #${renderCount.current})`
        );
      }
    }
  });
};

/**
 * 依存配列の変更を追跡するフック（デバッグ用）
 */
export const useWhyDidYouUpdate = (name: string, props: Record<string, any>) => {
  const previousProps = useRef<Record<string, any>>();

  useEffect(() => {
    if (previousProps.current && process.env.NODE_ENV === 'development') {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: unknown; to: unknown }> = {};

      allKeys.forEach(key => {
        if (previousProps.current?.[key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current?.[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.info(`[Why Update] ${name}:`, changedProps);
      }
    }

    previousProps.current = props;
  });
};

/**
 * コンポーネントのマウント/アンマウントを追跡
 */
export const useComponentLifecycle = (componentName: string) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[Lifecycle] ${componentName} mounted`);
      return () => {
        console.info(`[Lifecycle] ${componentName} unmounted`);
      };
    }
  }, [componentName]);
};

/**
 * メモリ使用量を定期的にチェック（開発環境のみ）
 */
export const useMemoryMonitor = (intervalMs = 5000) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const interval = setInterval(() => {
        const memory = (performance as any).memory;
        if (memory) {
          const usedMB = (memory.usedJSHeapSize / 1048576).toFixed(2);
          const totalMB = (memory.totalJSHeapSize / 1048576).toFixed(2);
          const limitMB = (memory.jsHeapSizeLimit / 1048576).toFixed(2);

          console.info(`[Memory] Used: ${usedMB}MB / Total: ${totalMB}MB / Limit: ${limitMB}MB`);
        }
      }, intervalMs);

      return () => clearInterval(interval);
    }
  }, [intervalMs]);
};
