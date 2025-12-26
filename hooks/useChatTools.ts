import { useState, useRef, useCallback } from 'react';
import {
  Message,
  DebateSettings,
  TokenUsage,
  StrategyAnalysis,
  FacilitationBoardData,
  DebateMode,
} from '../core/types';
import {
  getDebateAdviceStreaming,
  getDebateSummaryStreaming,
  generateFacilitationBoard,
  generateLiveStrategyStreaming,
} from '../services/gemini/index';

interface UseChatToolsProps {
  messages: Message[];
  settings: DebateSettings;
  inputText: string;
  isSending: boolean;
  onTokenUpdate?: (usage: TokenUsage) => void;
}

export const useChatTools = ({
  messages,
  settings,
  inputText,
  isSending,
  onTokenUpdate,
}: UseChatToolsProps) => {
  // Support/Advice State
  const [adviceData, setAdviceData] = useState<{
    advice: string | null;
    detectedFallacy: string | null;
    fallacyQuote: string | null;
    fallacyExplanation: string | null;
    sentimentScore: number | null;
  }>({
    advice: null,
    detectedFallacy: null,
    fallacyQuote: null,
    fallacyExplanation: null,
    sentimentScore: null,
  });
  const [showAdvicePanel, setShowAdvicePanel] = useState(false);
  const [isGettingAdvice, setIsGettingAdvice] = useState(false);
  const adviceCacheRef = useRef<{
    key: string;
    data: {
      advice: string | null;
      detectedFallacy: string | null;
      fallacyQuote: string | null;
      fallacyExplanation: string | null;
      sentimentScore: number | null;
    };
  } | null>(null);

  // Strategy State
  const [strategyData, setStrategyData] = useState<StrategyAnalysis | null>(null);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const strategyCacheRef = useRef<{ key: string; data: StrategyAnalysis } | null>(null);

  // Summary State
  const [summaryPoints, setSummaryPoints] = useState<string[]>([]);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const summaryCacheRef = useRef<number>(-1);

  // Whiteboard State
  const [boardData, setBoardData] = useState<FacilitationBoardData | null>(null);
  const [isBoardOpen, setIsBoardOpen] = useState(false);
  const [isGeneratingBoard, setIsGeneratingBoard] = useState(false);
  const boardCacheRef = useRef<number>(-1);

  // --- Actions (memoized with useCallback) ---

  const handleGetAdvice = useCallback(async () => {
    const trimmedInput = inputText.trim();
    const contextKey = `${messages.length}:${trimmedInput}`;

    if (adviceCacheRef.current && adviceCacheRef.current.key === contextKey) {
      setStrategyData(null);
      setAdviceData(adviceCacheRef.current.data);
      setShowAdvicePanel(true);
      return;
    }

    setAdviceData({
      advice: null,
      detectedFallacy: null,
      fallacyQuote: null,
      fallacyExplanation: null,
      sentimentScore: null,
    });
    setStrategyData(null);
    setShowAdvicePanel(false);
    setIsGettingAdvice(true);

    try {
      const result = await getDebateAdviceStreaming(settings.topic, messages, inputText);

      const newData = {
        advice: result.advice,
        detectedFallacy: result.detectedFallacy || null,
        fallacyQuote: result.fallacyQuote || null,
        fallacyExplanation: result.fallacyExplanation || null,
        sentimentScore: typeof result.sentimentScore === 'number' ? result.sentimentScore : null,
      };

      setAdviceData(newData);

      adviceCacheRef.current = {
        key: contextKey,
        data: newData,
      };

      setShowAdvicePanel(true);
      if (onTokenUpdate) onTokenUpdate(result.usage);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGettingAdvice(false);
    }
  }, [messages, inputText, settings.topic, onTokenUpdate]);

  const handleGetStrategy = useCallback(async () => {
    if (messages.length === 0) return;

    const contextKey = messages.length.toString();

    if (strategyCacheRef.current && strategyCacheRef.current.key === contextKey) {
      setShowAdvicePanel(false);
      setStrategyData(strategyCacheRef.current.data);
      return;
    }

    setIsGeneratingStrategy(true);
    setShowAdvicePanel(false);

    try {
      const { strategy, usage } = await generateLiveStrategyStreaming(settings.topic, messages);
      console.log('📊 Strategy generated:', strategy);
      console.log('📊 Number of moves:', strategy.moves?.length || 0);
      setStrategyData(strategy);

      strategyCacheRef.current = {
        key: contextKey,
        data: strategy,
      };

      if (onTokenUpdate) onTokenUpdate(usage);
    } catch (e) {
      console.error('Strategy generation failed', e);
    } finally {
      setIsGeneratingStrategy(false);
    }
  }, [messages, settings.topic, onTokenUpdate]);

  const handleGetSummary = useCallback(async () => {
    setIsSummaryOpen(true);
    if (messages.length === summaryCacheRef.current && summaryPoints.length > 0) return;

    setIsGeneratingSummary(true);
    try {
      const result = await getDebateSummaryStreaming(settings.topic, messages);
      setSummaryPoints(result.points);
      summaryCacheRef.current = messages.length;
      if (onTokenUpdate) onTokenUpdate(result.usage);
    } catch (error) {
      console.error(error);
      setSummaryPoints(['要約の生成に失敗しました']);
    } finally {
      setIsGeneratingSummary(false);
    }
  }, [messages, settings.topic, onTokenUpdate, summaryPoints.length]);

  const handleOpenWhiteboard = useCallback(async () => {
    setIsBoardOpen(true);
    if (messages.length === boardCacheRef.current && boardData) return;

    setIsGeneratingBoard(true);
    try {
      const result = await generateFacilitationBoard(settings.topic, messages);
      setBoardData(result.board);
      boardCacheRef.current = messages.length;
      if (onTokenUpdate) onTokenUpdate(result.usage);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingBoard(false);
    }
  }, [messages, settings.topic, onTokenUpdate, boardData]);

  const resetTools = useCallback(() => {
    setAdviceData({
      advice: null,
      detectedFallacy: null,
      fallacyQuote: null,
      fallacyExplanation: null,
      sentimentScore: null,
    });
    setShowAdvicePanel(false);
    setStrategyData(null);
  }, []);

  return {
    adviceData,
    showAdvicePanel,
    setShowAdvicePanel,
    isGettingAdvice,
    strategyData,
    setStrategyData,
    isGeneratingStrategy,
    getStrategy: handleGetStrategy,
    summaryState: {
      points: summaryPoints,
      isOpen: isSummaryOpen,
      setIsOpen: setIsSummaryOpen,
      isGenerating: isGeneratingSummary,
      generate: handleGetSummary,
    },
    boardState: {
      data: boardData,
      isOpen: isBoardOpen,
      setIsOpen: setIsBoardOpen,
      isGenerating: isGeneratingBoard,
      generate: handleOpenWhiteboard,
    },
    getAdvice: handleGetAdvice,
    resetTools,
  };
};
