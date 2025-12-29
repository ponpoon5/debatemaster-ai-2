import { useState, useEffect } from 'react';
import { LOADING_TIPS } from '../core/config/constants';

export const useLoadingSimulation = (isLoading: boolean, complexityFactor: number) => {
  const [progress, setProgress] = useState(0);
  const [estimatedSeconds, setEstimatedSeconds] = useState(10);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    let progressInterval: any;
    let timerInterval: any;
    let tipInterval: any;

    if (isLoading) {
      // Calculate estimated time based on conversation length (complexity)
      const estimated = Math.min(Math.max(5, 3 + Math.floor(complexityFactor * 0.5)), 35);

      setEstimatedSeconds(estimated);
      setElapsedSeconds(0);
      setProgress(0);

      const updateInterval = 100;
      const totalUpdates = (estimated * 1000) / updateInterval;
      // 変更: 95 → 70 に変更（初期段階は70%まで）
      const incrementPerUpdate = 70 / totalUpdates;

      progressInterval = setInterval(() => {
        setProgress(prev => {
          // 変更: 70%以上の場合は進捗を止める（ストリーミング進捗に任せる）
          if (prev >= 70) {
            clearInterval(progressInterval);
            return prev;
          }
          const randomFactor = 0.5 + Math.random();
          return Math.min(prev + incrementPerUpdate * randomFactor, 70);
        });
      }, updateInterval);

      timerInterval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);

      tipInterval = setInterval(() => {
        setCurrentTipIndex(prev => (prev + 1) % LOADING_TIPS.length);
      }, 4000);
    } else {
      // Reset when not loading
      setProgress(0);
      setElapsedSeconds(0);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (timerInterval) clearInterval(timerInterval);
      if (tipInterval) clearInterval(tipInterval);
    };
  }, [isLoading, complexityFactor]);

  return {
    progress,
    estimatedSeconds,
    elapsedSeconds,
    currentTip: LOADING_TIPS[currentTipIndex],
    setProgress, // 新規追加: 外部から進捗を設定可能に
  };
};
