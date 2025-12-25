import { useState, useEffect, useRef } from 'react';
import type { Message, DebateSettings, TokenUsage, BurdenAnalysis } from '../core/types';
import { analyzeBurdenOfProofStreaming } from '../services/gemini/analysis/burden';

/**
 * Burden of Proof追跡の状態
 */
export interface BurdenTrackingState {
  burdenAnalysis: BurdenAnalysis | null;
  showBurdenTracker: boolean;
  isAnalyzingBurden: boolean;
  toggleBurdenTracker: () => void;
}

/**
 * Burden of Proof追跡を管理するカスタムフック
 * ChatScreenから分離して責任を明確化
 */
export const useBurdenTracking = (
  messages: Message[],
  settings: DebateSettings,
  debatePhase: string,
  isStandardDebate: boolean,
  isSending: boolean,
  onTokenUpdate?: (usage: TokenUsage) => void
): BurdenTrackingState => {
  const [burdenAnalysis, setBurdenAnalysis] = useState<BurdenAnalysis | null>(null);
  const [showBurdenTracker, setShowBurdenTracker] = useState(false);
  const [isAnalyzingBurden, setIsAnalyzingBurden] = useState(false);

  const lastPhaseRef = useRef<string>('POSITION');
  const lastAnalyzedMessageCountRef = useRef<number>(0);

  // Re-analyze burden when messages change (if tracker is visible)
  useEffect(() => {
    if (!isStandardDebate || messages.length < 2 || !showBurdenTracker || isAnalyzingBurden || isSending) {
      return;
    }

    const phaseChanged = debatePhase !== lastPhaseRef.current;
    const messageCountChanged = messages.length !== lastAnalyzedMessageCountRef.current;

    // Skip if no changes (use cache)
    if (!phaseChanged && !messageCountChanged) {
      console.log('📦 Using cached burden analysis (no changes detected)');
      return;
    }

    if (phaseChanged) {
      console.log(`🔄 Debate phase changed from ${lastPhaseRef.current} to ${debatePhase}. Re-analyzing burden...`);
      lastPhaseRef.current = debatePhase;
    } else {
      console.log('🔄 New message detected. Re-analyzing burden...');
    }

    lastAnalyzedMessageCountRef.current = messages.length;

    setIsAnalyzingBurden(true);
    analyzeBurdenOfProofStreaming(settings.topic, messages)
      .then(({ data, usage }) => {
        console.log('Burden re-analysis result:', data);
        setBurdenAnalysis(data);
        if (onTokenUpdate && usage) {
          onTokenUpdate(usage);
        }
      })
      .catch(error => {
        console.error('Burden re-analysis failed:', error);
      })
      .finally(() => {
        setIsAnalyzingBurden(false);
      });
  }, [messages.length, debatePhase, isStandardDebate, showBurdenTracker, isSending, settings.topic, onTokenUpdate, isAnalyzingBurden]);

  // Burden of Proof Analysis (manual trigger with toggle)
  const toggleBurdenTracker = () => {
    // If already showing, just hide it
    if (showBurdenTracker) {
      setShowBurdenTracker(false);
      return;
    }

    // If we have cached analysis, show it
    if (burdenAnalysis) {
      setShowBurdenTracker(true);
      return;
    }

    // Otherwise, analyze first
    if (messages.length < 2 || isAnalyzingBurden) return;

    setIsAnalyzingBurden(true);
    analyzeBurdenOfProofStreaming(settings.topic, messages)
      .then(({ data, usage }) => {
        console.log('Burden analysis result:', data);
        setBurdenAnalysis(data);
        setShowBurdenTracker(true);
        if (onTokenUpdate && usage) {
          onTokenUpdate(usage);
        }
      })
      .catch(error => {
        console.error('Burden analysis failed:', error);
      })
      .finally(() => {
        setIsAnalyzingBurden(false);
      });
  };

  return {
    burdenAnalysis,
    showBurdenTracker,
    isAnalyzingBurden,
    toggleBurdenTracker,
  };
};
