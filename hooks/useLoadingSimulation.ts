import { useState, useEffect } from 'react';
import { LOADING_TIPS } from '../core/config/constants';

export const useLoadingSimulation = (isLoading: boolean, complexityFactor: number) => {
  const [progress, setProgress] = useState(0);
  const [estimatedSeconds, setEstimatedSeconds] = useState(10);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    let progressInterval: ReturnType<typeof setInterval> | undefined;
    let timerInterval: ReturnType<typeof setInterval> | undefined;
    let tipInterval: ReturnType<typeof setInterval> | undefined;

    if (isLoading) {
      // Calculate estimated time based on conversation length (complexity)
      const estimated = Math.min(Math.max(5, 3 + Math.floor(complexityFactor * 0.5)), 35);

      setEstimatedSeconds(estimated);
      setElapsedSeconds(0);
      setProgress(0);

      const updateInterval = 100;
      const totalUpdates = (estimated * 1000) / updateInterval;
      const incrementPerUpdate = 95 / totalUpdates;

      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return Math.min(prev + 0.05, 99);
          const randomFactor = 0.5 + Math.random();
          return Math.min(prev + incrementPerUpdate * randomFactor, 95);
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
  };
};
