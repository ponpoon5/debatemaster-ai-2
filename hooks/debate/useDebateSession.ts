import { useCallback, MutableRefObject } from 'react';
import {
  DebateSettings,
  Message,
  TokenUsage,
  DebateArchive,
  DebateMode,
  PremiseData,
} from '../../core/types';
import { Chat, GenerateContentResponse } from '@google/genai';
import { createDebateChat, generateWeaknessProfile, cleanText } from '../../services/gemini/index';
import { parseApiError } from '../../core/utils/error-parser';
import { ScreenType } from '../useDebateApp';

// タイムアウト設定 (ミリ秒)
const CHAT_TIMEOUT_MS = 45000; // 45秒

// タイムアウト付きでPromiseを実行するヘルパー関数
const withTimeout = <T>(
  promise: Promise<T>,
  ms: number,
  errorMsg: string = '通信がタイムアウトしました'
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(errorMsg)), ms)),
  ]);
};

interface UseDebateSessionParams {
  chatRef: MutableRefObject<Chat | null>;
  settings: DebateSettings | null;
  archives: DebateArchive[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  setIsSending: (sending: boolean) => void;
  setScreen: (screen: ScreenType) => void;
  setSettings: (settings: DebateSettings | null) => void;
  updateTokenUsage: (usage: TokenUsage) => void;
  handleError: (error: unknown, context?: string) => void;
}

export const useDebateSession = ({
  chatRef,
  settings,
  archives,
  setMessages,
  setIsSending,
  setScreen,
  setSettings,
  updateTokenUsage,
  handleError,
}: UseDebateSessionParams) => {
  const handleStartDebate = useCallback(
    async (currentSettings: DebateSettings) => {
      setMessages([]);
      setIsSending(true);

      try {
        let weaknessProfile = currentSettings.weaknessProfile;

        // If Training mode and profile not provided (fallback), analyze weakness
        if (currentSettings.mode === DebateMode.TRAINING && !weaknessProfile) {
          const result = await withTimeout(
            generateWeaknessProfile(archives),
            CHAT_TIMEOUT_MS,
            '弱点分析がタイムアウトしました'
          );
          weaknessProfile = result.profile;
          updateTokenUsage(result.usage);
        }

        const chat = createDebateChat(
          currentSettings.topic,
          currentSettings.difficulty,
          [],
          currentSettings.mode,
          weaknessProfile,
          currentSettings.premises,
          currentSettings.facilitationSettings,
          currentSettings.debateType,
          currentSettings.thinkingFramework,
          currentSettings.storyScenario
        );
        chatRef.current = chat;
        setScreen('chat');

        // Auto-start for specific modes
        const autoStartModes = [
          DebateMode.TRAINING,
          DebateMode.STUDY,
          DebateMode.DRILL,
          DebateMode.THINKING_GYM,
          DebateMode.DEMO,
          DebateMode.FACILITATION,
          DebateMode.STORY,
        ];

        if (autoStartModes.includes(currentSettings.mode)) {
          let startPrompt = '';
          if (currentSettings.mode === DebateMode.TRAINING)
            startPrompt = 'トレーニングを開始してください。';
          else if (currentSettings.mode === DebateMode.STUDY)
            startPrompt = `「${currentSettings.topic}」のレクチャーを開始してください。`;
          else if (currentSettings.mode === DebateMode.DRILL)
            startPrompt = `「${currentSettings.topic}」のドリルを開始してください。`;
          else if (currentSettings.mode === DebateMode.THINKING_GYM)
            startPrompt = '思考ジムのトレーニングを開始してください。';
          else if (currentSettings.mode === DebateMode.DEMO)
            startPrompt = '模範ディベートを開始してください。次のターンへ。';
          else if (currentSettings.mode === DebateMode.FACILITATION)
            startPrompt =
              '議論を開始してください。まずはAさんとBさんのそれぞれの立場を明確にしてください。';
          else if (currentSettings.mode === DebateMode.STORY)
            startPrompt = 'シナリオを開始してください。現状を説明し、会議を始めてください。';

          const response = await withTimeout<GenerateContentResponse>(
            chat.sendMessage(startPrompt),
            CHAT_TIMEOUT_MS,
            '開始メッセージの受信がタイムアウトしました。再読み込みしてください。'
          );

          if (response.text) {
            const clean = cleanText(response.text);
            if (clean) {
              const aiMsg: Message = {
                id: Date.now().toString(),
                role: 'model',
                text: clean,
              };
              setMessages([aiMsg]);
            }

            if (response.usageMetadata) {
              updateTokenUsage({
                inputTokens: response.usageMetadata.promptTokenCount || 0,
                outputTokens: response.usageMetadata.candidatesTokenCount || 0,
                totalTokens: response.usageMetadata.totalTokenCount || 0,
              });
            }
          }
        }
      } catch (error: unknown) {
        console.error('Failed to start debate:', error);
        const apiError = parseApiError(error);
        handleError(apiError, '議論の開始');
        setScreen('setup');
      } finally {
        setIsSending(false);
      }
    },
    [chatRef, archives, setMessages, setIsSending, setScreen, updateTokenUsage, handleError]
  );

  const handleSetupComplete = useCallback(
    (newSettings: DebateSettings) => {
      setSettings(newSettings);
      if (newSettings.mode === DebateMode.DEBATE) {
        setScreen('premise_check');
      } else if (newSettings.mode === DebateMode.TEXTBOOK) {
        setScreen('textbook');
      } else if (newSettings.mode === DebateMode.MINIGAME) {
        setScreen('minigame');
      } else {
        handleStartDebate(newSettings);
      }
    },
    [setSettings, setScreen, handleStartDebate]
  );

  const handlePremiseConfirmed = useCallback(
    (premises: PremiseData, usage?: TokenUsage) => {
      if (settings) {
        if (usage) updateTokenUsage(usage);
        const updatedSettings = { ...settings, premises };
        setSettings(updatedSettings);
        handleStartDebate(updatedSettings);
      }
    },
    [settings, updateTokenUsage, setSettings, handleStartDebate]
  );

  const handleAiStart = useCallback(
    async (stance: 'PRO' | 'CON') => {
      if (!chatRef.current) return;
      setIsSending(true);
      try {
        const prompt =
          stance === 'PRO'
            ? 'あなたは肯定側（PRO）です。先攻として、立論（Opening Statement）を開始してください。'
            : 'あなたは否定側（CON）です。先攻として、立論（Opening Statement）を開始してください。';

        const response = await withTimeout<GenerateContentResponse>(
          chatRef.current.sendMessage(prompt),
          CHAT_TIMEOUT_MS
        );
        const text = response.text ? cleanText(response.text) : '';

        if (text) {
          const aiMsg: Message = {
            id: Date.now().toString() + '_ai',
            role: 'model',
            text: text,
          };
          setMessages((prev) => [...prev, aiMsg]);

          if (response.usageMetadata) {
            updateTokenUsage({
              inputTokens: response.usageMetadata.promptTokenCount || 0,
              outputTokens: response.usageMetadata.candidatesTokenCount || 0,
              totalTokens: response.usageMetadata.totalTokenCount || 0,
            });
          }
        }
      } catch (error: unknown) {
        console.error('Failed to start AI debate:', error);
        const apiError = parseApiError(error);
        handleError(apiError, 'AI先攻の開始');
      } finally {
        setIsSending(false);
      }
    },
    [chatRef, setIsSending, setMessages, updateTokenUsage, handleError]
  );

  return {
    handleStartDebate,
    handleSetupComplete,
    handlePremiseConfirmed,
    handleAiStart,
  };
};
