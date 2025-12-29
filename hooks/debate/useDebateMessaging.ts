import { useCallback, MutableRefObject } from 'react';
import { flushSync } from 'react-dom';
import { Message, TokenUsage } from '../../core/types';
import { Chat } from '@google/genai';
import { cleanText } from '../../services/gemini/index';
import { parseApiError } from '../../core/utils/error-parser';
import { extractUsage } from '../../services/gemini/utils/token-usage';

interface UseDebateMessagingParams {
  chatRef: MutableRefObject<Chat | null>;
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  setIsSending: (sending: boolean) => void;
  updateTokenUsage: (usage: TokenUsage) => void;
  handleError: (error: unknown, context?: string) => void;
}

export const useDebateMessaging = ({
  chatRef,
  setMessages,
  setIsSending,
  updateTokenUsage,
  handleError,
}: UseDebateMessagingParams) => {
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!chatRef.current) return;

      // Optimistic update: 即座にユーザーメッセージをUIに追加
      const tempUserId = `temp-${Date.now()}`;
      const userMsg: Message = {
        id: tempUserId,
        role: 'user',
        text: text,
        isPending: true, // 楽観的更新フラグ
      };

      setMessages(prev => {
        if (!prev) return [userMsg];
        return [...prev, userMsg];
      });

      setIsSending(true);

      // AI応答用のプレースホルダーメッセージを作成
      const aiMsgId = `${Date.now()}_ai`;
      const aiMsg: Message = {
        id: aiMsgId,
        role: 'model',
        text: '',
      };

      setMessages(prev => [...prev, aiMsg]);

      try {
        // ストリーミングでメッセージを送信
        const stream = await chatRef.current.sendMessageStream({ message: text });
        let accumulatedText = '';
        let lastUsage: TokenUsage | undefined;

        // 送信成功時、ユーザーメッセージのpendingフラグを削除
        // Note: IDは変更せず、tempUserIdのまま維持（構造分析との整合性のため）
        setMessages(prev =>
          prev.map(msg =>
            msg.id === tempUserId ? { ...msg, isPending: false } : msg
          )
        );

        for await (const chunk of stream) {
          const chunkText = chunk.text || '';
          accumulatedText += chunkText;

          // リアルタイムでメッセージを更新
          const cleanedText = cleanText(accumulatedText);
          setMessages(prev =>
            prev.map(msg => (msg.id === aiMsgId ? { ...msg, text: cleanedText } : msg))
          );

          // トークン使用量を抽出（最終チャンクに含まれる）
          if (chunk.usageMetadata) {
            lastUsage = extractUsage(chunk);
          }
        }

        // 最終的なトークン使用量を更新
        if (lastUsage) {
          updateTokenUsage(lastUsage);
        }
      } catch (error: unknown) {
        console.error('❌ Chat error:', error);
        const apiError = parseApiError(error);
        handleError(apiError, 'メッセージ送信');

        // エラー時はロールバック: 楽観的に追加したメッセージとAIプレースホルダーを削除
        setMessages(prev => prev.filter(msg => msg.id !== tempUserId && msg.id !== aiMsgId));
      } finally {
        // 不安定なネットワーク環境でのUI更新遅延を防ぐため、flushSyncで同期的に状態を更新
        flushSync(() => {
          setIsSending(false);
        });
      }
    },
    [chatRef, setMessages, setIsSending, updateTokenUsage, handleError]
  );

  return {
    handleSendMessage,
  };
};
