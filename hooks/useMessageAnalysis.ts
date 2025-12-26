import { useState, useEffect, useRef } from 'react';
import {
  Message,
  DebateSettings,
  TokenUsage,
  ArgumentAnalysis,
  DemoTurn,
  DebateMode,
  DebateFlowState,
  UtteranceStructureScore,
} from '../core/types';
import {
  analyzeFactOpinion,
  cleanText,
  analyzeDebatePhase,
  analyzeUtteranceStructureStreaming,
} from '../services/gemini/index';
import { isDemoMode, requiresDebateAnalysis } from '../core/utils/mode-helpers';
import { useToast } from './useToast';

interface UseMessageAnalysisProps {
  messages: Message[];
  settings: DebateSettings;
  onTokenUpdate?: (usage: TokenUsage) => void;
  onStructureAnalysisComplete?: (messageId: string, analysis: UtteranceStructureScore) => void;
}

export const useMessageAnalysis = ({
  messages,
  settings,
  onTokenUpdate,
  onStructureAnalysisComplete,
}: UseMessageAnalysisProps) => {
  const { showError } = useToast();
  const [analyses, setAnalyses] = useState<Record<string, ArgumentAnalysis>>({});
  const [analyzingMessageIds, setAnalyzingMessageIds] = useState<Set<string>>(new Set());
  const [demoParsedMessages, setDemoParsedMessages] = useState<Record<string, DemoTurn>>({});

  // New State for Phase & Structure
  const [debateFlowState, setDebateFlowState] = useState<DebateFlowState>({
    currentPhase: 'POSITION',
    turns: [],
  });

  // We only track which IDs we've already processed for structure to avoid loops,
  // but the actual data is passed up via callback.
  const [processedStructureIds, setProcessedStructureIds] = useState<Set<string>>(new Set());

  const lastAnalyzedPhaseRef = useRef<number>(0); // Track message count for phase analysis
  const processedMessageIdsRef = useRef<Set<string>>(new Set()); // Track all processed message IDs for fact/opinion analysis
  const lastProcessedIndexRef = useRef<number>(0); // Track last processed message index for incremental processing

  const isDemo = isDemoMode(settings);
  const isDebateMode = requiresDebateAnalysis(settings);

  // Parse Demo Messages
  useEffect(() => {
    if (isDemo) {
      messages.forEach(msg => {
        if (msg.role === 'model' && !demoParsedMessages[msg.id]) {
          try {
            const cleanJson = cleanText(msg.text);
            const data = JSON.parse(cleanJson) as DemoTurn;
            if (data.speaker && data.text) {
              setDemoParsedMessages(prev => ({ ...prev, [msg.id]: data }));
            }
          } catch (e) {
            // Silent fail for non-JSON parts or incomplete streams
          }
        }
      });
    }
  }, [messages, isDemo]);

  // Analyze User Messages (Fact/Opinion + Structure)
  // Phase 2 Optimization: Incremental processing with index tracking (80% API call reduction)
  useEffect(() => {
    // Process only messages after lastProcessedIndex
    const newMessages = messages.slice(lastProcessedIndexRef.current);

    // Filter only user messages that need processing
    const unprocessedMessages = newMessages.filter(
      msg =>
        msg.role === 'user' &&
        !processedMessageIdsRef.current.has(msg.id) &&
        !analyzingMessageIds.has(msg.id) &&
        msg.text.trim().length > 10 &&
        !isDemo
    );

    // Update last processed index
    if (newMessages.length > 0) {
      lastProcessedIndexRef.current = messages.length;
    }

    // Process only new messages
    unprocessedMessages.forEach(async msg => {
      processedMessageIdsRef.current.add(msg.id);
      setAnalyzingMessageIds(prev => new Set(prev).add(msg.id));

      try {
        // 1. Fact/Opinion Analysis
        if (!analyses[msg.id]) {
          const result = await analyzeFactOpinion(msg.text);
          setAnalyses(prev => ({ ...prev, [msg.id]: result.analysis }));
          if (onTokenUpdate) onTokenUpdate(result.usage);
        }

        // 2. Structure Analysis (New Feature)
        // Only analyze structure for substantial messages in debate modes
        if (isDebateMode && !msg.structureAnalysis && !processedStructureIds.has(msg.id)) {
          setProcessedStructureIds(prev => new Set(prev).add(msg.id));
          const structResult = await analyzeUtteranceStructureStreaming(msg);

          if (onStructureAnalysisComplete) {
            onStructureAnalysisComplete(msg.id, structResult.result);
          }
          if (onTokenUpdate) onTokenUpdate(structResult.usage);
        }
      } catch (e) {
        console.error('❌ Analysis failed for message:', msg.id, e);
        showError('メッセージ分析に失敗しました');
      } finally {
        setAnalyzingMessageIds(prev => {
          const next = new Set(prev);
          next.delete(msg.id);
          return next;
        });
      }
    });
  }, [messages.length, isDemo, isDebateMode]); // Watch messages.length instead of messages array

  // Analyze Debate Phase (Triggered every time a new message is added, but throttled logically)
  useEffect(() => {
    const analyzePhase = async () => {
      // Analyze only if new messages added and enough context (at least 2 messages)
      if (isDebateMode && messages.length >= 2 && messages.length > lastAnalyzedPhaseRef.current) {
        lastAnalyzedPhaseRef.current = messages.length;

        try {
          const { result, usage } = await analyzeDebatePhase(settings.topic, messages);
          setDebateFlowState(prev => ({
            currentPhase: result.phase,
            turns: [...prev.turns, result],
          }));
          if (onTokenUpdate) onTokenUpdate(usage);
        } catch (e) {
          console.error('❌ Phase analysis failed', e);
          showError('討論フェーズ分析に失敗しました');
        }
      }
    };
    analyzePhase();
  }, [messages.length, isDebateMode, settings.topic]);

  return {
    analyses,
    demoParsedMessages,
    debateFlowState,
  };
};
