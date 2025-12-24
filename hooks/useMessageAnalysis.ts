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

  const isDemoMode = settings.mode === DebateMode.DEMO;
  const isDebateMode =
    settings.mode === DebateMode.DEBATE ||
    settings.mode === DebateMode.FACILITATION ||
    settings.mode === DebateMode.STORY;

  // Parse Demo Messages
  useEffect(() => {
    if (isDemoMode) {
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
  }, [messages, isDemoMode]);

  // Analyze User Messages (Fact/Opinion + Structure)
  useEffect(() => {
    messages.forEach(async msg => {
      // Base Condition for Analysis
      if (
        msg.role === 'user' &&
        !analyzingMessageIds.has(msg.id) &&
        msg.text.trim().length > 10 &&
        !isDemoMode
      ) {
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
          console.error('Analysis failed', e);
        } finally {
          setAnalyzingMessageIds(prev => {
            const next = new Set(prev);
            next.delete(msg.id);
            return next;
          });
        }
      }
    });
  }, [messages, isDemoMode, isDebateMode]);

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
          console.error('Phase analysis failed', e);
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
