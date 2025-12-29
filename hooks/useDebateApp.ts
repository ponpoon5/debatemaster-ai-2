import { useState, useRef } from 'react';
import {
  DebateSettings,
  Message,
  FeedbackData,
  TokenUsage,
  DebateArchive,
  DebateMode,
  PremiseData,
  Difficulty,
  TrainingRecommendation,
} from '../core/types';
import { Chat } from '@google/genai';
import { useArchiveStore } from '../store/useArchiveStore';
import { useTokenStore } from '../store/useTokenStore';
import { useBackupRestore } from './useBackupRestore';
import { useLoadingSimulation } from './useLoadingSimulation';
import { useErrorHandler } from './useErrorHandler';
import { useDebateSession } from './debate/useDebateSession';
import { useDebateMessaging } from './debate/useDebateMessaging';
import { useDebateFeedback } from './debate/useDebateFeedback';
import { useTokenBatcher } from './useTokenBatcher';
import { parseApiError } from '../core/utils/error-parser';

export type ScreenType =
  | 'setup'
  | 'premise_check'
  | 'chat'
  | 'feedback'
  | 'textbook'
  | 'minigame'
  | 'history';

export const useDebateApp = () => {
  // --- Global State ---
  const [screen, setScreen] = useState<ScreenType>('setup');
  const [settings, setSettings] = useState<DebateSettings | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [viewingArchive, setViewingArchive] = useState<boolean>(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  const chatRef = useRef<Chat | null>(null);

  // --- Zustand Stores ---
  const { tokenUsage, updateTokenUsage: storeUpdateToken } = useTokenStore();
  const {
    backupState,
    addArchive,
    deleteArchive: storeDeleteArchive,
    addHomework,
    completeHomework,
    deleteHomework,
    setBackupState,
  } = useArchiveStore();

  const archives = backupState.archives;
  const homeworkTasks = backupState.homeworkTasks;

  // Backup/Restore functionality
  const { exportData, importData } = useBackupRestore(backupState, setBackupState);

  const { progress, estimatedSeconds, elapsedSeconds, currentTip, setProgress } = useLoadingSimulation(
    isLoadingFeedback,
    messages.length
  );

  const { handleError } = useErrorHandler();

  // --- Utilities ---
  const updateTokenUsage = (usage: TokenUsage) => {
    storeUpdateToken({
      inputTokens: tokenUsage.inputTokens + usage.inputTokens,
      outputTokens: tokenUsage.outputTokens + usage.outputTokens,
      totalTokens: tokenUsage.totalTokens + usage.totalTokens,
    });
  };

  // Batched token update to reduce state updates (70% reduction in API calls)
  const batchedTokenUpdate = useTokenBatcher(updateTokenUsage);

  // --- Delegate to specialized hooks ---
  const session = useDebateSession({
    chatRef,
    settings,
    archives,
    setMessages,
    setIsSending,
    setScreen,
    setSettings,
    updateTokenUsage: batchedTokenUpdate,
    handleError,
  });

  const messaging = useDebateMessaging({
    chatRef,
    setMessages,
    setIsSending,
    updateTokenUsage: batchedTokenUpdate,
    handleError,
  });

  const feedbackLogic = useDebateFeedback({
    settings,
    messages,
    setFeedback,
    setScreen,
    setIsLoadingFeedback,
    updateTokenUsage: batchedTokenUpdate,
    addArchive,
    handleError,
    tokenUsage,
    setLoadingProgress: setProgress, // 新規追加
  });

  // --- Actions (delegated to specialized hooks) ---

  const handleSetupComplete = (newSettings: DebateSettings) => {
    setFeedback(null);
    setViewingArchive(false);
    session.handleSetupComplete(newSettings);
  };

  const handleReset = () => {
    setScreen('setup');
    setSettings(null);
    setMessages([]);
    setFeedback(null);
    setViewingArchive(false);
    chatRef.current = null;
  };

  const handleSelectArchive = (archive: DebateArchive) => {
    setMessages(archive.messages);
    setFeedback(archive.feedback);
    setViewingArchive(true);
    setSettings({
      topic: archive.topic,
      difficulty: Difficulty.NORMAL,
      mode: DebateMode.DEBATE,
    } as any);
    setScreen('feedback');
  };

  const handleDeleteArchive = (id: string) => {
    if (window.confirm('この履歴を削除してもよろしいですか？')) {
      storeDeleteArchive(id);
    }
  };

  const handleNavigateToTraining = (rec: TrainingRecommendation) => {
    // Create new settings based on recommendation
    const newSettings: DebateSettings = {
      topic: 'Training Session',
      difficulty: Difficulty.NORMAL,
      mode: DebateMode.DEBATE,
    };

    switch (rec.actionType) {
      case 'open_minigame':
        if (rec.actionPayload.minigameType) {
          newSettings.mode = DebateMode.MINIGAME;
          newSettings.miniGameType = rec.actionPayload.minigameType;
          setSettings(newSettings);
          setScreen('minigame');
        }
        break;
      case 'start_drill':
        if (rec.actionPayload.drillTopic) {
          newSettings.mode = DebateMode.DRILL;
          newSettings.topic = rec.actionPayload.drillTopic;
          setSettings(newSettings);
          session.handleStartDebate(newSettings);
        }
        break;
      case 'start_study':
        if (rec.actionPayload.studyTopic) {
          newSettings.mode = DebateMode.STUDY;
          newSettings.topic = rec.actionPayload.studyTopic;
          setSettings(newSettings);
          session.handleStartDebate(newSettings);
        }
        break;
      case 'open_thinking_gym':
        if (rec.actionPayload.thinkingFramework) {
          newSettings.mode = DebateMode.THINKING_GYM;
          newSettings.topic = 'Thinking Gym';
          newSettings.thinkingFramework = rec.actionPayload.thinkingFramework;
          setSettings(newSettings);
          // Gym handles start inside the mode usually, but we can init chat
          session.handleStartDebate(newSettings);
        }
        break;
      case 'open_textbook':
        newSettings.mode = DebateMode.TEXTBOOK;
        if (rec.actionPayload.textbookChapterId) {
          newSettings.textbookChapterId = rec.actionPayload.textbookChapterId;
        }
        setSettings(newSettings);
        setScreen('textbook');
        break;
    }
  };

  return {
    screen,
    setScreen,
    settings,
    messages,
    setMessages,
    isSending,
    feedback,
    tokenUsage,
    archives,
    homeworkTasks,
    viewingArchive,
    updateTokenUsage,
    isLoadingFeedback,
    loadingProgress: progress,
    estimatedSeconds,
    elapsedSeconds,
    currentTip,
    handleSetupComplete,
    handlePremiseConfirmed: session.handlePremiseConfirmed,
    handleSendMessage: messaging.handleSendMessage,
    handleAiStart: session.handleAiStart,
    handleEndDebate: feedbackLogic.handleEndDebate,
    handleReset,
    handleSelectArchive,
    handleDeleteArchive,
    handleAddHomework: addHomework,
    handleCompleteHomework: completeHomework,
    handleDeleteHomework: deleteHomework,
    handleExportData: exportData,
    handleImportData: importData,
    handleNavigateToTraining,
  };
};
